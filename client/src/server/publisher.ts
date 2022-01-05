import { GlaumMatrix } from "./matrix";
import { SimulatorMatrix } from "./simulatorMatrix";
import { FileUtils } from "./fileUtils";

class Publisher {

    private readonly imageLocationPattern: string = "../gifs/*.json";
    private readonly interval: number = 50;
    private readonly refreshRate: number = 10;
    private readonly matrix: GlaumMatrix;
    private readonly simulatorMatrix: SimulatorMatrix;
    private stopped: boolean = false;
    private paused: boolean = false;

    constructor() {
        this.matrix = new GlaumMatrix();
        this.simulatorMatrix = new SimulatorMatrix(function (data) {
            // @ts-ignore
            process.send({ data });
        });
        this.matrix.addOutput(this.simulatorMatrix);
        // Check if rpi
        if (require("detect-rpi")()) {
            console.log("This is a raspberry pie, starting real matrix.");
            const RaspberryPiMatrix = require("./rpiMatrix");
            const rpiMatrix = new RaspberryPiMatrix();
            this.matrix.addOutput(rpiMatrix);
        }
        // Check from messages from parent
        this.stopped = false;
        process.on("message", (command) => {
            console.log("Received command", command);
            this.stopped = command === "stop";
            this.paused = command === "pause";
        });
    }

    async loop() {
        while (!this.stopped) {
            if (!this.paused) {
                for (const fileName of FileUtils.getFiles(this.imageLocationPattern)) {
                    console.log("Playing file", fileName);
                    const fileData = await this.getFileData(fileName);
                    if (fileData) {
                        // if (!fileData.blocked && fileData.visible) {
                        if (fileData.gif) {
                            await this.matrix.playGIF(fileData.payload, fileData.speed);
                        } else {
                            const e = new Date().getTime() + (10 * 1000);
                            while (new Date().getTime() <= e) {
                                const fileData = await this.getFileData(fileName);
                                if (fileData) {
                                    this.matrix.draw(fileData.payload);
                                }
                                await new Promise(resolve => setTimeout(resolve, this.refreshRate));
                            }
                        }

                        // }
                    }
                }
            } else {
                console.log("Publisher is stopped. Will check again in", this.interval, "seconds");
                await new Promise(resolve => setTimeout(resolve, this.interval));
            }
        }
    }

    private async getFileData(fileName: string) {
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
publisher.loop();
