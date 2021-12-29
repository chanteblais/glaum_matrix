import { Device } from "./device";

export class SimulatorMatrix implements Device {

    private callback: Function;

    private readonly pixels: Array<string> = [];

    constructor(callback) {
        this.callback = callback;
    }

    drawPixelFromHex(position: number, hexColor: string): void {
        this.pixels[position] = hexColor;
    }

    show(): void {
        this.callback(this.pixels.join());
    }
}
