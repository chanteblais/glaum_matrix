import express from "express";
import bodyParser from "body-parser";
import { Device } from "./device";

export class EventEmitter implements Device {

	private readonly pixels: Array<string> = [];

	private clients: Array<any> = [];

	// constructor(callback: (pixels: string) => void) {
	constructor() {
		const app = express();
		app.use(bodyParser.text());
		app.use(express.json({ limit: "10mb" }));
		app.get("/events", this.eventsHandler.bind(this));
		// this.callback = callback;
		app.listen(process.env.PORT, () => {
			console.log(`Event emitter listening at http://localhost:${process.env.PORT}`);
		});
	}

	eventsHandler(request, response): void {
		// response.set({
		// 	"Connection": "keep-alive",
		// 	"Cache-Control": "no-cache",
		// 	"Content-Type": "text/event-stream",
		// 	"Access-Control-Allow-Origin": "*",
		// 	"Access-Control-Allow-Headers": "Cache-Control, last-event-id"
		// });
		// const headers = {
		// 	"Content-Type": "text/event-stream",
		// 	"Connection": "keep-alive",
		// 	"Cache-Control": "no-cache",
		// 	"Access-Control-Allow-Origin": "*",
		// 	"Access-Control-Allow-Headers": "Cache-Control, last-event-id"
		// };
		// response.writeHead(200, headers);
		response.set({
			"Connection": "keep-alive",
			"Cache-Control": "no-cache",
			"Content-Type": "text/event-stream",
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Headers": "Cache-Control, last-event-id"
		});
		response.flushHeaders();

		response.write("retry: 10000\n\n");

		// // Initialize the simulator matrix
		// publisher.on("message", (msg) => {
		// 	res.write(`event: matrixUpdate\ndata: "${msg.data}"\n\n`);
		// });
		const clientId = Date.now();
		console.log("Got new client", clientId);
		const newClient = {
			id: clientId,
			response
		};
		this.clients.push(newClient);

		request.on("close", () => {
			console.log(`${clientId} Connection closed`);
			this.clients = this.clients.filter(client => client.id !== clientId);
		});
	}

	drawPixelFromHex(position: number, hexColor: string): void {
		this.pixels[position] = hexColor;
	}

	show(): void {
		this.clients.forEach(client => {
			client.response.write('event: matrixUpdate\n');  // added these
			client.response.write(`data: ${JSON.stringify(this.pixels)}`);
			client.response.write("\n\n");
		});
	}
}
