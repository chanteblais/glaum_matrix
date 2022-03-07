import { Dispatcher } from "./dispatcher";
import { Simulator } from "./devices/simulator";
import { FileUtils } from "../common/fileUtils";
import { RaspberryPi } from "./devices/raspberryPi";

class Publisher {

    private readonly imageLocationPattern: string = "gifs/**/*.json";
    private readonly interval: number = 5000;
    private readonly refreshRate: number = 10;
    private readonly dispatcher: Dispatcher;
    private readonly simulator: Simulator;
    private stopped = false;
    private paused = false;

    constructor() {
        this.dispatcher = new Dispatcher();
        this.simulator = new Simulator(function (data) {
            (<any>process).send({ data });
        });
        this.dispatcher.addOutput(this.simulator);
        // Check if rpi
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        if (require("detect-rpi")()) {
            console.log("This is a raspberry pie, starting real matrix.");
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const pi = new RaspberryPi();
            pi.start();
            this.dispatcher.addOutput(pi);
        }
        // Check from messages from parent
        this.stopped = false;
        (<any>process).on("message", (command: string) => {
            console.log("Received command: ", command);
            this.stopped = command === "stop";
            this.paused = command === "pause";
        });
    }

    async loop() {
        while (!this.stopped) {
            if (!this.paused) {
                const files = FileUtils.getFiles(this.imageLocationPattern);
                for (const fileName of files) {
                    if (this.stopped || this.paused) {
                        break;
                    }
                    console.log("Playing file", fileName);
                    const fileData = await Publisher.getFileData(fileName);
                    if (fileData) {
                        if (fileData.gif) {
                            await this.dispatcher.playGIF(fileData.payload, fileData.speed);
                        } else {
                            const e = new Date().getTime() + (10 * 1000);
                            while (new Date().getTime() <= e) {
                                const fileData = await Publisher.getFileData(fileName);
                                if (fileData) {
                                    this.dispatcher.draw(fileData.payload);
                                }
                                await new Promise(resolve => setTimeout(resolve, this.refreshRate));
                            }
                        }
                    }
                }
            } else {
                console.log("Publisher is paused. Will check again in", this.interval, "milliseconds");
                await new Promise(resolve => setTimeout(resolve, this.interval));
            }
        }
    }

    private static async getFileData(fileName: string): Promise<any> {
        const content = await FileUtils.readFile(fileName);
        try {
            return JSON.parse(content);
        } catch (error) {
            // Syntax error is expected when a file is read while is being written
            if (!(error instanceof SyntaxError)) {
                console.log("Error reading file", fileName, error);
            }
        }
        return undefined;
    }
}

const publisher = new Publisher();
console.log("Publisher started...");
publisher.loop()
    .finally(() => {
        console.log("Publisher done.");
    });
