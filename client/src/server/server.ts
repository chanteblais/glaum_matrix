import { GlaumMatrix } from "./matrix";
import { SimulatorMatrix } from "./simulatorMatrix";

const isPi = require("detect-rpi");
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const port = process.env.PORT;
const app = express();
app.use(bodyParser.text());
app.use(express.json());
app.use("/", express.static(path.join(__dirname, "web/PixelCraft")));
app.use("/lib", express.static(path.join(__dirname, "web/PixelCraft/lib")));
app.use("/images", express.static(path.join(__dirname, "web/PixelCraft/images")));
app.use("/icons", express.static(path.join(__dirname, "web/PixelCraft/icons")));
app.use("/css", express.static(path.join(__dirname, "web/PixelCraft/css")));
app.use("/webfonts", express.static(path.join(__dirname, "web/PixelCraft/webfonts")));

// Matrix
const matrix = new GlaumMatrix();

// Endpoints
app.post("/publish", async function (req, res) {
    if (req.body) {
        if (req.body.gif) {
            await matrix.playGIF(req.body.payload);
        } else {
            matrix.draw(req.body.payload);
        }
        res.sendStatus(200);
    } else {
        console.log("Invalid body", req.body);
        res.sendStatus(400);
    }
});

let simulatorAdded = false;
app.get("/simulator", function (req, res) {
    console.log("Got /simulator");
    res.set({
        Connection: "keep-alive",
        "Cache-Control": "no-cache",
        "Content-Type": "text/event-stream",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Cache-Control, last-event-id"
    });
    res.flushHeaders();

    res.write("retry: 10000\n\n");

    // Initialize the simulator matrix
    const simulatorMatrix = new SimulatorMatrix(function (data) {
        res.write(`event: matrixUpdate\ndata: "${data}"\n\n`);
    });
    if (!simulatorAdded) {
        matrix.addOutput(simulatorMatrix);
        simulatorAdded = true;
    }
});

if (isPi()) {
    console.log("This is a raspberry pie, starting real matrix.");
    const RaspberryPiMatrix = require("./rpiMatrix");
    const rpiMatrix = new RaspberryPiMatrix();
    matrix.addOutput(rpiMatrix);
}

// Setup app
app.listen(port, () => {
    console.log(`Glaum Matrix Client listening at http://localhost:${port}`);
});
