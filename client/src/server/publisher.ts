import { GlaumMatrix } from "./matrix";
import { SimulatorMatrix } from "./simulatorMatrix";
import { FileUtils } from "./fileUtils";

class Publisher {

    private readonly interval: number = 50;
    private readonly matrix: GlaumMatrix;
    private readonly simulatorMatrix: SimulatorMatrix;
    private stop: boolean = false;

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
        this.stop = false;
        process.on("message", (command) => {
            console.log("Recevied command", command);
            this.stop = command === "stop";
        });
    }

    async loop() {
        if (!this.stop) {
            const fileData: Array<Array<string>> = [];
            const lines = (await FileUtils.readFile("mygif")).split("\n");
            lines.forEach(line => {
                fileData.push(line.split(","));
            });
            const file = {
                name: "mock",
                blocked: false,
                visible: true,
                gif: lines.length > 1,
                infinite: false,
                data: fileData
            };
            if (!file.blocked && file.visible) {
                if (file.gif) {
                    await this.matrix.playGIF(file.data);
                } else {
                    await this.matrix.draw(file.data);
                }
            }
        } else {
            console.log("Publisher is stopped. Will check again in", this.interval, "seconds");
        }
    }

    run() {
        // Loop every 100 ms
        setInterval(this.loop.bind(this), this.interval);
    }
}

const publisher = new Publisher();
publisher.run();
