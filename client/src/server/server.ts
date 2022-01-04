import { FileUtils } from "./fileUtils";

const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const { fork } = require("child_process");

const port = process.env.PORT;
const app = express();
app.use(bodyParser.text());
app.use(express.json({ limit: "10mb" }));
app.use("/", express.static(path.join(__dirname, "web/editor")));
app.use("/lib", express.static(path.join(__dirname, "web/editor/lib")));
app.use("/images", express.static(path.join(__dirname, "web/editor/images")));
app.use("/icons", express.static(path.join(__dirname, "web/editor/icons")));
app.use("/css", express.static(path.join(__dirname, "web/editor/css")));
app.use("/webfonts", express.static(path.join(__dirname, "web/editor/webfonts")));

const publisher = fork(path.join(__dirname, "publisher.js"));

// Endpoints
app.post("/publish", async function (req, res) {
    if (req.body) {
        FileUtils.writeFile("mygif", req.body.payload);
        res.sendStatus(200);
    } else {
        console.log("Invalid body", req.body);
        res.sendStatus(400);
    }
});

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
    publisher.on("message", (msg) => {
        res.write(`event: matrixUpdate\ndata: "${msg.data}"\n\n`);
    });
});

app.get("/start", function (req, res) {
    if (req.body) {
        publisher.send("start");
        res.sendStatus(200);
    } else {
        console.log("Invalid body", req.body);
        res.sendStatus(400);
    }
});

app.get("/stop", function (req, res) {
    if (req.body) {
        publisher.send("stop");
        res.sendStatus(200);
    } else {
        console.log("Invalid body", req.body);
        res.sendStatus(400);
    }
});

// Setup app
app.listen(port, () => {
    console.log(`Glaum Matrix Client listening at http://localhost:${port}`);
});
