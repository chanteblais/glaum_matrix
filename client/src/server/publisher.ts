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

async function test() {
    while (true) {
        // foreach file
        var fileData: Array<Array<string>> = [];
        var lines = FileUtils.readFile("mygif").split("\n");
        lines.forEach(line => {
            fileData.push(line.split(","))
        });
        const file = {
            name: "mock",
            blocked: false,
            visible: true,
            gif: true,
            infinite: false,
            data: fileData
        };
            if (!file.blocked && file.visible) {
                console.log("Playing file: " + file.name);
                if (file.gif) {
                    await matrix.playGIF(file.data);
                } else {
                    matrix.draw(file.data);
                }
            }
    }
}

test();
