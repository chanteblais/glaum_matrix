import { boardColour } from "../config";
import ColourUtils from "./colourutils";
import { Point } from "../components/shapes";
import { pencilId } from "../tools/pencil";
import { eraserId } from "../tools/eraser";
import { bucketId } from "../tools/bucket";
import { Drawing } from "./drawing";

export class CanvasService {

  private drawing: Drawing;
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
  private updateDataCallback;

  constructor(drawing: Drawing) {
    this.drawing = drawing;
  }

  public setupCanvas(canvas, width, height) {
    this.width = width;
    this.height = height;
    this.canvas = canvas;
    this.context = this.canvas.getContext("2d");
    this.context.globalAlpha = 1;
    this.emptyData = [...Array(this.width)].map(() => Array(this.height).fill(boardColour));
    this.clear();
    this.emptyBase64 = this.getDataURL();
    this.drawing.updateFrame();
  }

  setData(data) {
    this.data = data;
  }

  setUpdateDataCallback(setCurrentData) {
    this.updateDataCallback = setCurrentData;
  }

  publishData(){
    this.updateDataCallback(this.data);
  }

  public beforePerform() {
    this.previousPoint = new Point(undefined, undefined);
  }

  public perform(clientX, clientY, spot) {
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

    this.publishData();
    this.drawing.publish();
  }

  public draw(x, y) {
    if (this.isInsideBoundaries(x, y)) {
      this.data[x][y] = this.selectedColour;
      this.context.fillRect(Math.floor(x * (this.canvas.width / this.width)), Math.floor(y * (this.canvas.height / this.height)), Math.floor(this.canvas.width / this.width), Math.floor(this.canvas.height / this.height));
      // if (JSON.stringify(this.steps[this.steps.length - 1]) !== JSON.stringify([x, y, this.color, this.ctx.globalAlpha])) {
      //  this.steps.push([x, y, this.color, this.ctx.globalAlpha]);
      // }
      this.drawing.updateFrame();
    }
  }

  public erase(x, y) {
    let temp = this.selectedColour;
    this.setColour(boardColour);
    this.draw(x, y);
    this.setColour(temp);
  }

  public fill(x, y, cc) {
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

  public clear() {
    this.context.fillStyle = ColourUtils.getCSSColourFromRGBArray(boardColour);
    this.context.fillRect(0, 0, this.context.canvas.width, this.context.canvas.height);
    this.data = [...this.emptyData];
    if (this.selectedColour) {
      this.setColour(this.selectedColour);
    }

    this.drawing.updateFrame();
    this.drawing.publish();
  }

  public isInsideBoundaries(x, y) {
    return x >= 0 && x < this.width && y >= 0 && y < this.height;
  }

  public setTool(tool) {
    this.selectedTool = tool;
  }

  public setColour(colour) {
    this.selectedColour = colour;
    this.context.fillStyle = ColourUtils.getCSSColourFromRGBArray(colour);
    // if (window.palette instanceof Palette) {
    //   window.palette.highlightSelectedColor(color);
    // }
  }

  getDataURL() {
    return this.canvas.toDataURL();
  }
}
