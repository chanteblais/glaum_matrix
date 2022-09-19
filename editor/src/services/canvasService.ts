import { boardColour } from "../configs/config";
import Utils from "./utils";
import { Frame, Image, Point } from "../components/shapes";
import { pencilId } from "../pages/editor/tools/pencil";
import { eraserId } from "../pages/editor/tools/eraser";
import { bucketId } from "../pages/editor/tools/bucket";

export class CanvasService {

	private enabled: Boolean;
	public emptyData: any[][];
	public emptyBase64: string;
	public previousPoint;
	private canvas;
	private context;
	private width;
	private height;
	private selectedTool;
	private selectedColour;
	private data;
	private updateFrameCallback;

	public setupCanvas(canvas, width, height) {
		this.width = width;
		this.height = height;
		this.canvas = canvas;
		this.context = this.canvas.getContext("2d");
		this.context.globalAlpha = 1;
		this.emptyData = [...Array(this.width)].map(() => Array(this.height).fill(boardColour));
		this.clear();
	}

	public setUpdateCurrentFrameCallback(updateFrameCallback) {
		this.updateFrameCallback = updateFrameCallback;
	}

	public setTool(tool) {
		this.selectedTool = tool;
	}

	public setColour(colour) {
		this.selectedColour = colour;
		this.context.fillStyle = Utils.getCSSColourFromRGBArray(colour);
	}

	public setEnabled(enabled) {
		this.enabled = enabled;
	}

	public beforePerform() {
		this.previousPoint = new Point(undefined, undefined);
	}

	public perform(clientX, clientY, spot) {
		if (!this.enabled) {
			return;
		}

		if (spot && this.previousPoint.x !== undefined) {
			return; // Don't re-paint the last point in a streak
		}

		// Extrapolate the drawing area based on the pixel size
		const rect = this.canvas.getBoundingClientRect();
		let x = clientX - rect.left;
		let y = clientY - rect.top;
		x = Math.floor(this.width * x / this.canvas.clientWidth);
		y = Math.floor(this.height * y / this.canvas.clientHeight);

		if (this.selectedTool === pencilId) {
			const point = new Point(x, y);
			if (!point.equals(this.previousPoint) || spot) {
				this.previousPoint = point;
				this.draw(point.x, point.y);
			}
		} else if (this.selectedTool === eraserId) {
			this.erase(x, y);
		} else if (this.selectedTool === bucketId && spot) {
			this.fill(x, y, this.data[x][y]);
		}

		this.publishFrame();
	}

	public populate(data) {
		if (data.length) {
			let tmpColour;
			if (this.selectedColour) {
				tmpColour = this.selectedColour;
			}
			let i, j;
			for (i = 0; i < this.width; i++) {
				for (j = 0; j < this.height; j++) {
					this.setColour(data[i][j]);
					this.draw(i, j);
				}
			}
			if (tmpColour) {
				this.setColour(tmpColour);
			}
		}
	}

	public erase(x, y) {
		const temp = this.selectedColour;
		this.setColour(boardColour);
		this.draw(x, y);
		this.setColour(temp);
	}

	public clear() {
		this.context.fillStyle = Utils.getCSSColourFromRGBArray(boardColour);
		this.context.fillRect(0, 0, this.context.canvas.width, this.context.canvas.height);
		// Technically didn't have to do this every time, but keeping it here for simplicity
		this.emptyBase64 = this.canvas.toDataURL();
		this.data = Utils.deepClone(this.emptyData);
		if (this.selectedColour) {
			this.setColour(this.selectedColour);
		}

		this.publishFrame();
	}

	public backward() {
		this.shiftFrame(false);
	}

	public forward() {
		this.shiftFrame(true);
	}

	private publishFrame() {
		const image = new Image(this.canvas.toDataURL());
		this.updateFrameCallback(new Frame(image, Utils.deepClone(this.data)));
	}

	private draw(x, y) {
		if (this.isInsideBoundaries(x, y)) {
			this.data[x][y] = this.selectedColour;
			this.context.fillRect(Math.floor(x * (this.canvas.width / this.width)), Math.floor(y * (this.canvas.height / this.height)), Math.floor(this.canvas.width / this.width), Math.floor(this.canvas.height / this.height));
			// if (JSON.stringify(this.steps[this.steps.length - 1]) !== JSON.stringify([x, y, this.color, this.ctx.globalAlpha])) {
			//  this.steps.push([x, y, this.color, this.ctx.globalAlpha]);
			// }
		}
	}

	private fill(x, y, cc) {
		if (this.isInsideBoundaries(x, y)) {
			if (JSON.stringify(this.data[x][y]) === JSON.stringify(cc) && JSON.stringify(this.data[x][y]) !== JSON.stringify(this.selectedColour)) {
				this.draw(x, y);
				this.fill(x + 1, y, cc);
				this.fill(x, y + 1, cc);
				this.fill(x - 1, y, cc);
				this.fill(x, y - 1, cc);
			}
		}
	}

	private shiftFrame(right: boolean) {
		const tmpColour = this.selectedColour;
		const data = Utils.deepClone(this.data);
		let i, j;
		for (i = 1; i < this.width - 1; i++) {
			for (j = 0; j < this.height; j++) {
				const indexToCopy = right ? data[i - 1] : data[i + 1];
				this.setColour(indexToCopy[j]);
				this.draw(i, j);
			}
		}
		this.setColour(tmpColour);
		this.publishFrame();
	}

	private isInsideBoundaries(x, y) {
		return x >= 0 && x < this.width && y >= 0 && y < this.height;
	}
}
