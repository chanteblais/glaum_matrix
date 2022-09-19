import { Drawing } from "../components/drawing";

export class PublishingService {

	public async publish(drawing: Drawing) {
		await fetch("/api/draw", {
			method: "POST",
			mode: "cors",
			body: JSON.stringify(drawing)
		});
	}
}
