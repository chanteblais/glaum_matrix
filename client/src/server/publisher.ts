// Matrix
import { GlaumMatrix } from "./matrix";
import { SimulatorMatrix } from "./simulatorMatrix";
import { FileUtils } from "./fileUtils";

const isPi = require("detect-rpi");

const matrix = new GlaumMatrix();
const simulatorMatrix = new SimulatorMatrix(function (data) {
    // @ts-ignore
    process.send({ data });
});
if (isPi()) {
    console.log("This is a raspberry pie, starting real matrix.");
    const RaspberryPiMatrix = require("./rpiMatrix");
    const rpiMatrix = new RaspberryPiMatrix();
    matrix.addOutput(rpiMatrix);
}
matrix.addOutput(simulatorMatrix);

let stop = false;
process.on("message", (command) => {
    console.log("Recevied command", command);
    stop = command === "stop";
})

async function start() {
    while (true) {
        while (!stop) {
            // foreach file
            const fileData: Array<Array<string>> = [];
            const lines = (await FileUtils.readFile("mygif")).split("\n");
            lines.forEach(line => {
                fileData.push(line.split(","))
            });
            const file = {
                name: "mock",
                blocked: false,
                visible: true,
                gif: fileData.length > 1,
                infinite: false,
                data: fileData
            };
            if (!file.blocked && file.visible) {
                if (file.gif) {
                    await matrix.playGIF(file.data);
                } else {
                    await matrix.draw(file.data);
                }
            }
        }
        console.log("Process stopped. Sleeping for 10s before checking again...");
        await new Promise(resolve => setTimeout(resolve, 10000));
    }
}

start();
