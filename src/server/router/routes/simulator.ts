import router from "../router";
import { Request, Response } from "express";
import { fork } from "child_process";
import path from "path";

// START PUBLISHER
const simulator = fork(path.resolve(__dirname, "../../publisher/publisher.js"));

router.route("/simulator")
    .get((req: Request, res: Response) => {
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
        simulator.on("message", (msg) => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            res.write(`event: matrixUpdate\ndata: "${msg.data}"\n\n`);
        });
    });

router.route("/start")
    .get((req: Request, res: Response) => {
        if (req.body) {
            simulator.send("start");
            res.sendStatus(200);
        } else {
            console.log("Invalid body", req.body);
            res.sendStatus(400);
        }
    });

router.route("/stop")
    .get((req: Request, res: Response) => {
        if (req.body) {
            simulator.send("stop");
            res.sendStatus(200);
        } else {
            console.log("Invalid body", req.body);
            res.sendStatus(400);
        }
    });

router.route("/pause")
    .get((req: Request, res: Response) => {
        if (req.body) {
            simulator.send("pause");
            res.sendStatus(200);
        } else {
            console.log("Invalid body", req.body);
            res.sendStatus(400);
        }
    });

export default router;
