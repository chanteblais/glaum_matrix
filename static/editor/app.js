class App {

    width = 16;
    height = 16;

    constructor() {
        if (window.board === undefined) {
            // Canvas
            this.canvas = new Canvas(this.width, this.height);
            window.board = this.canvas;
            // Palette
            window.palette = new Palette();
            window.palette.populate();
            // Gif publish popup
            window.playGifPopup = new Popup("#playGifPopup");
            let playButton = document.querySelector("#playGif");
            playButton.addEventListener("click", async () => {
                console.log("Clicked");
                let gifNameInput = document.querySelector("#gifName");
                let name = gifNameInput.value.trim();
                if (name === "") {
                    gifNameInput.value = "";
                    gifNameInput.classList.add("invalid");
                    return;
                }
                localStorage.setItem(Constants.gifNameStorageKey, name);
                let speed = document.querySelector("#gifSpeed").value;
                localStorage.setItem(Constants.gifSpeedStorageKey, speed);

                // Close popup
                window.playGifPopup.close();
                // Play gif
                let payload = [];
                let i, j;
                this.canvas.framesManager.frames.forEach(frame => {
                    let gifFrame = this.getFrameInHex(frame[1], i, j);
                    payload.push(gifFrame);
                });
                await fetch("http://localhost:3000/api/push", {
                    headers: {"Content-Type": "application/json"},
                    method: "POST",
                    body: JSON.stringify({gif: true, name, speed, payload})
                });
            });

            // Restore user's preferences
            let gifName = localStorage.getItem(Constants.gifNameStorageKey);
            if (gifName) {
                document.querySelector("#gifName").value = gifName;
            }
            let gifSpeed = localStorage.getItem(Constants.gifSpeedStorageKey);
            if (gifSpeed) {
                document.querySelector("#gifSpeed").value = gifSpeed;
            }

            localStorage.setItem(Constants.uuid, this.uuidv4());
        }
    }

    uuidv4() {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c === "x" ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    async publish() {
        const currentFrame = this.canvas.framesManager.getCurrentFrame();
        // const frame = [];
        // for (let i = 0; i < this.height; i++) {
        //     for (let j = 0; j < this.width; j++) {
        //         frame.push(this.getColor(j, i));
        //     }
        // }

        const payload = [];
        payload[0] = this.getFrameInHex(currentFrame[1]);
        const uuid = localStorage.getItem(Constants.uuid);
        await fetch("http://localhost:3000/api/push", {
            headers: {"Content-Type": "application/json"},
            method: "POST",
            body: JSON.stringify({gif: false, name: uuid, payload})
        });
    }

    async publishGIF() {
        window.playGifPopup.show();
    }

    getFrameInHex(img, i, j) {
        let gifFrame = [];
        for (i = 0; i < this.canvas.width; i++) {
            for (j = 0; j < this.canvas.height; j++) {
                gifFrame.push(ColourUtils.rgbToHex(img[j][i][0], img[j][i][1], img[j][i][2]));
            }
        }
        return gifFrame;
    }
}

window.onload = function () {
    window.app = new App();
};
