import { Device } from "./device";

export class Simulator implements Device {

    private readonly callback: (pixels: string) => void;

    private readonly pixels: Array<string> = [];

    constructor(callback: (pixels: string) => void) {
        this.callback = callback;
    }

    drawPixelFromHex(position: number, hexColor: string): void {
        this.pixels[position] = hexColor;
    }

    show(): void {
        this.callback(this.pixels.join());
    }
}
