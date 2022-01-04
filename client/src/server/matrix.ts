import { Device } from "./device";

export class GlaumMatrix {

    private devices: Array<Device> = [];

    public addOutput(output: Device) {
        this.devices.push(output);
    }

    public async draw(pixelArray) {
        for (let i = 0; i < pixelArray.length; i++) {
            if (pixelArray[i]) {
                this.devices.forEach(device => device.drawPixelFromHex(i, pixelArray[i]));
            }
        }

        this.devices.forEach(device => device.show());
        await new Promise(resolve => setTimeout(resolve, 10));
    }

    public async playGIF(frames: Array<Array<string>>) {
        const delayTime = 50;
        const gifPlays = 5;
        for (let g = 0; g < gifPlays; g++) {
            let i;
            for (i = 0; i < frames.length; i++) {
                let j;
                for (j = 0; j < frames[i].length; j++) {
                    if (frames[i][j]) {
                        this.devices.forEach(device => device.drawPixelFromHex(j, frames[i][j]));
                    }
                }
                if (j > frames[i].length) {
                    j = 0;
                }
                this.devices.forEach(device => device.show());
                await new Promise(resolve => setTimeout(resolve, delayTime));
            }
            if (i > frames.length) {
                i = 0;
            }
        }
    }
}
