var ws281x = require('rpi-ws281x');
const fs = require('fs');
const { connect } = require('http2');

class GlaumMatrix {

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

    matrixArray = 
        [99,97,77,75,55,53,33,31,11,9,
        100,96,78,74,56,52,34,30,12,8,
        101,95,79,73,57,51,35,29,13,7,
        102,94,80,72,58,50,36,28,14,6,
        103,93,81,71,59,49,37,27,15,5,
        104,92,82,70,60,48,38,26,16,4,
        105,91,83,69,61,47,39,25,17,3,
        106,90,84,68,62,46,40,24,18,2,
        107,89,85,67,63,45,41,23,19,1,
        108,88,86,66,64,44,42,22,20,0]

    constructor() {
        this.config = {};

        // Number of leds in my strip
        this.config.leds = 109;

        // Use DMA 10 (default 10)
        this.config.dma = 10;

        // Set full brightness, a value from 0 to 255 (default 255)
        this.config.brightness = 120;

        // Set the GPIO number to communicate with the Neopixel strip (default 18)
        this.config.gpio = 18;

        // The RGB sequence may vary on some strips. Valid values
        // are "rgb", "rbg", "grb", "gbr", "bgr", "brg".
        // Default is "rgb".
        // RGBW strips are not currently supported.
        this.config.stripType = 'grb';

        // Configure ws281x
        ws281x.configure(this.config);

        this.pixels = new Uint32Array(this.config.leds);
    }

    sleep(milliseconds) {
        const date = Date.now();
        let currentDate = null;
        do {
          currentDate = Date.now();
        } while (currentDate - date < milliseconds);
      }

    matrixIndex(index) {
        return this.matrixArray[index]
    }

    drawPixelFromHex(pixelIndex, hex) {

        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        
        let r = parseInt(result[1], 16);
        let g = parseInt(result[2], 16);
        let b = parseInt(result[3], 16);

        var color = (r << 16) | (g << 8)| b;

        this.pixels[pixelIndex] = color

    }

    writeFile(filename, content) {
        fs.writeFileSync(`../gifs/${filename}.txt`, "")
        for (var i = 0; i < content.length; i++) {
            fs.appendFileSync(`../gifs/${filename}.txt`, content[i].toString()) 
            // don't append newline at end of file
            if (i < content.length -1) {
                fs.appendFileSync(`../gifs/${filename}.txt`, "\n") 
            }
        }
    }

    readFile(filename) {
        let data 
        try {
            data = fs.readFileSync(`../gifs/${filename}.txt`, 'utf8')
          } catch (err) {
            console.error(err)
          }

          return data
    }

    draw(canvas) {
        for (var i = 0; i < canvas.length; i++ ) {
            if (canvas[i]) {
                this.drawPixelFromHex(this.matrixIndex(i), canvas[i])
            }
        }

        ws281x.render(this.pixels);
    }

    playGIF(filename) {
        let delayTime = 1000
        let frames = new Array()
        let content = this.readFile(filename)
        let rows = content.split("\n")

        for (const row of rows) {
            frames.push(row.split(","))
        }

        while (true) {
            for (var i = 0; i < frames.length; i++) {
                for (var j = 0; j < frames[i].length; j++ ) {
                    if (frames[i][j]) {
                        this.drawPixelFromHex(this.matrixIndex(j), frames[i][j])
                    }
                }
                if (j > frames[i].length) {
                    j = 0
                }
                ws281x.render(this.pixels);
                this.sleep(delayTime)
            }
            if (i > frames.length) {
                i = 0
            }
        }
    }
};

module.exports = GlaumMatrix

