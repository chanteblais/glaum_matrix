import { CanvasService } from "./canvasService";
import { FramesService } from "./framesService";

export class Drawing {

  private canvasService: CanvasService;
  private framesService: FramesService;

  setCanvasService(canvasService: CanvasService) {
    this.canvasService = canvasService;
  }

  setFramesService(framesService: FramesService) {
    this.framesService = framesService;
  }

  publish() {

  }

  updateFrame() {
    this.framesService.updateFrame();
  }
}
