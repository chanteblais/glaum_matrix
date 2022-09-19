import { Dispatcher } from "./dispatcher";
import { EventEmitter } from "./devices/eventEmitter";
import { FileUtils } from "./common/fileUtils";
import { RaspberryPi } from "./devices/raspberryPi";
import * as dotenv from "dotenv";

dotenv.config();

class Publisher {

	private readonly imageLocationPattern: string = `${process.env.IMAGES_PATH}/*.json`;
	private readonly timePerImage: number = parseInt(process.env.TIME_PER_IMAGE_IN_SEC);
	private readonly dispatcher: Dispatcher;
	private readonly eventEmitter: EventEmitter;

	constructor() {
		console.log("Starting publisher, reading files from", this.imageLocationPattern);

		this.dispatcher = new Dispatcher();

		// Instantiate an Event Emitter in case there are EventSource clients (like the Simulator).
		this.eventEmitter = new EventEmitter();
		this.dispatcher.addOutput(this.eventEmitter);

		// Check if running in a Raspberry Pi.
		// eslint-disable-next-line @typescript-eslint/no-var-requires
		if (require("detect-rpi")()) {
			console.log("This is a raspberry pie, starting real matrix.");
			// eslint-disable-next-line @typescript-eslint/no-var-requires
			const pi = new RaspberryPi();
			pi.start();
			this.dispatcher.addOutput(pi);
		}
	}

	async loop() {
		while (true) {
			const files = FileUtils.getFiles(this.imageLocationPattern);
			console.log(`Found ${files.length} files to publish`);
			if (files.length > 0) {
				for (const fileName of files) {
					const drawing = await Publisher.loadDrawing(fileName);
					if (drawing) {
						if (drawing.gif) {
							console.log("Playing GIF file", fileName);
							await this.dispatcher.playGIF(drawing.payload, drawing.speed);
						} else {
							console.log("Displaying file", fileName);
							// const e = new Date().getTime() + (10 * 1000);
							// while (new Date().getTime() <= e) {
							this.dispatcher.draw(drawing.data);
							await new Promise(resolve => setTimeout(resolve, this.timePerImage * 1000));
							// }
						}
					} else {
						console.log("No data on file", fileName);
					}
				}
			} else {
				await new Promise(resolve => setTimeout(resolve, 1000));
			}
		}
	}

	private static async loadDrawing(fileName: string): Promise<any> {
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
