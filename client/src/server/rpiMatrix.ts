import { Device } from "./device";

export class RaspberyPiMatrix implements Device {

    // matrixMap = [
    //     [9, 8, 7, 6, 5, 4, 3, 2, 1, 0 ],
    //     [11,12,13,14,15,16,17,18,19,20],
    //     [31,30,29,28,27,26,25,24,23,22],
    //     [33,34,35,36,37,38,39,40,41,42],
    //     [53,52,51,50,49,48,47,46,45,44],
    //     [55,56,57,58,59,60,61,62,63,64],
    //     [75,74,73,72,71,70,69,68,67,66],
    //     [77,78,79,80,81,82,83,84,85,86],
    //     [97,96,95,94,93,92,91,90,89,88],
    //    [99,100,101,102,103,104,105,106,107,108]
    // ]

    private readonly ledStripMap: Array<number> =
        [99, 97, 77, 75, 55, 53, 33, 31, 11, 9,
            100, 96, 78, 74, 56, 52, 34, 30, 12, 8,
            101, 95, 79, 73, 57, 51, 35, 29, 13, 7,
            102, 94, 80, 72, 58, 50, 36, 28, 14, 6,
            103, 93, 81, 71, 59, 49, 37, 27, 15, 5,
            104, 92, 82, 70, 60, 48, 38, 26, 16, 4,
            105, 91, 83, 69, 61, 47, 39, 25, 17, 3,
            106, 90, 84, 68, 62, 46, 40, 24, 18, 2,
            107, 89, 85, 67, 63, 45, 41, 23, 19, 1,
            108, 88, 86, 66, 64, 44, 42, 22, 20, 0]

    private readonly pixels: Uint32Array;

    private ws281x: any;

    constructor() {
        const config = {
            // The RGB sequence may vary on some strips. Valid values
            // are "rgb", "rbg", "grb", "gbr", "bgr", "brg".
            // Default is "rgb".
            // RGBW strips are not currently supported.
            stripType: "grb",
            // Set the GPIO number to communicate with the Neopixel strip (default 18)
            gpio: 18,
            // Set full brightness, a value from 0 to 255 (default 255)
            brightness: 120,
            // Use DMA 10 (default 10)
            dma: 10,
            // Number of leds in my strip
            leds: 109
        };

        // Configure ws281x
        this.ws281x = require("rpi-ws281x");
        this.ws281x.configure(config);

        // Pixel array
        this.pixels = new Uint32Array(config.leds);
    }

    public drawPixelFromHex(pixelIndex, hex) {
        const rgbGroups = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        if (rgbGroups) {
            const r = parseInt(rgbGroups[1], 16);
            const g = parseInt(rgbGroups[2], 16);
            const b = parseInt(rgbGroups[3], 16);

            const mappedIndex = this.ledStripMap[pixelIndex];
            this.pixels[mappedIndex] = (r << 16) | (g << 8) | b;
        }
    }

    show(): void {
        this.ws281x.render(this.pixels);
    }
}
