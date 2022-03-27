import { CanvasService } from "./canvasService";
import { Frame, Image } from "../components/shapes";
import Utils from "./utils";

export class FramesService {

	private canvasService: CanvasService;
	private frames: Frame[] = [];
	private updateFramesCallback;

	constructor(canvasService) {
		this.canvasService = canvasService;
	}

	public setUpdateFramesCallback(setFrames) {
		this.updateFramesCallback = setFrames;
	}

	/**
	 * Set the frame with the id provided as the current
	 * Then calls the update frames callback to propagate the change
	 */
	public setCurrentFrame(key: number) {
		this.frames
			.forEach(f => {
				f.current = f.key === key;
			});

		this.updateFramesCallback(Utils.deepClone(this.frames));
	}

	/**
	 * Update the current frame with the data from the provided frame
	 * Then calls the update frames callback to propagate the change
	 */
	public updateCurrentFrame(newFrame: Frame) {
		if (!this.frames.length) {
			this.addFrame();
		}

		this.frames
			.filter(frame => frame.current)
			.forEach(frame => {
				frame.data = Utils.deepClone(newFrame.data);
				frame.image.src = newFrame.image.src;
			});

		this.updateFramesCallback(Utils.deepClone(this.frames));
	}

	// ensureCurrentFrameIsVisible() {
	//   document.querySelectorAll("#frames #gallery img").forEach(img => {
	//     if (img.getAttribute("current") === "true") {
	//       img.scrollIntoView();
	//     }
	//   });
	// }

	/**
	 * 	Adds a new frame (empty or duplicate the current)
	 */
	public addFrame(duplicate = false) {
		let frame;
		if (duplicate) {
			frame = this.getCurrentFrame();
		} else {
			frame = this.getEmptyFrame();
		}

		// Add to position
		let currentFrameIndex = this.getCurrentFrameIndex();
		if (this.frames.length !== 0) {
			currentFrameIndex += 1;
		}
		this.frames.splice(currentFrameIndex, 0, frame);

		// Set as current
		this.setCurrentFrame(frame.key);
	}

	/**
	 * Duplicates the current frame
	 */
	public duplicateFrame() {
		this.addFrame(true);
	}

	public updateFrames(frames: Frame[]) {
		this.frames = frames;
		this.updateFramesCallback(frames);
	}

	/**
	 * Creates a new empty frame
	 */
	private getEmptyFrame() {
		let img = new Image();
		img.src = this.canvasService.emptyBase64;
		return new Frame(img, Utils.deepClone(this.canvasService.emptyData));
	}

	private getCurrentFrame() {
		let currentFrame = this.frames[this.getCurrentFrameIndex()];
		// Deep clone it
		let img = new Image();
		img.src = currentFrame.image.src;
		return new Frame(img, Utils.deepClone(currentFrame.data));
	}

	/**
	 * Get the index of the current frame
	 */
	private getCurrentFrameIndex() {
		let index = 0;
		for (let i = 0; i < this.frames.length; i++) {
			if (this.frames[i].current) {
				index = i;
				break;
			}
		}
		return index;
	}
}
