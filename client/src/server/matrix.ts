import { Device } from "./device";

const fs = require("fs");

export class GlaumMatrix {

    private devices: Array<Device> = [];

    public addOutput(output: Device) {
        this.devices.push(output);
    }

    public draw(pixelArray) {
        for (let i = 0; i < pixelArray.length; i++) {
            if (pixelArray[i]) {
                this.devices.forEach(device => device.drawPixelFromHex(i, pixelArray[i]));
            }
        }

        this.devices.forEach(device => device.show());
    }

    public playGIF(frames: [][]) {
        const delayTime = 1000;
        while (true) {
            for (var i = 0; i < frames.length; i++) {
                for (var j = 0; j < frames[i].length; j++) {
                    if (frames[i][j]) {
                        this.devices.forEach(device => device.drawPixelFromHex(j, frames[i][j]));
                    }
                }
                if (j > frames[i].length) {
                    j = 0;
                }
                this.devices.forEach(device => device.show());
                GlaumMatrix.sleep(delayTime);
            }
            if (i > frames.length) {
                i = 0;
            }
        }
    }

    private static sleep(milliseconds) {
        const date = Date.now();
        let currentDate;
        do {
            currentDate = Date.now();
        } while (currentDate - date < milliseconds);
    }

    private static writeFile(filename, content) {
        fs.writeFileSync(`../gifs/${filename}.txt`, "");
        for (let i = 0; i < content.length; i++) {
            fs.appendFileSync(`../gifs/${filename}.txt`, content[i].toString());
            // don"t append newline at end of file
            if (i < content.length - 1) {
                fs.appendFileSync(`../gifs/${filename}.txt`, "\n");
            }
        }
    }

    private static readFile(filename) {
        let data;
        try {
            data = fs.readFileSync(`../gifs/${filename}.txt`, "utf8");
        } catch (err) {
            console.error(err);
        }

        return data;
    }
}
