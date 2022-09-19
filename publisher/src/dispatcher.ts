import { Device } from "./devices/device";

/**
 * Dispatches drawing commands to devices.
 */
export class Dispatcher {

	private readonly gitPlayCount: number = parseInt(process.env.GIF_PLAY_COUNT);
	private devices: Array<Device> = [];

	public addOutput(output: Device): void {
		this.devices.push(output);
	}

	public draw(frames: Array<Array<string>>): void {
		if (frames.length !== 1) {
			throw Error("Can only draw 1 frame");
		}
		for (let i = 0; i < frames[0].length; i++) {
			if (frames[0][i]) {
				this.devices.forEach(device => device.drawPixelFromHex(i, frames[0][i]));
			}
		}

		this.devices.forEach(device => device.show());
	}

	public async playGIF(frames: Array<Array<string>>, speed: number): Promise<void> {
		for (let g = 0; g < this.gitPlayCount; g++) {
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
				await new Promise(resolve => setTimeout(resolve, speed));
			}
			if (i > frames.length) {
				i = 0;
			}
		}
	}
}
