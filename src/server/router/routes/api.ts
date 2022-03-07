import router from "../router";
import { Request, Response } from "express";
import { FileUtils } from "../../common/fileUtils";
import path from "path";

router.route("/push")
    .post((req: Request, res: Response) => {
        if (req.body) {
            if (req.body.name) {
                FileUtils.writeFile(path.resolve(__dirname, `../../../gifs/${req.body.name}.json`), req.body);
            } else {
                FileUtils.writeFile(path.resolve(__dirname, `../../../gifs/${req.socket.remoteAddress}.json`), req.body);
            }
            res.sendStatus(200);
        } else {
            console.log("Invalid body", req.body);
            res.sendStatus(400);
        }
    });

export default router;
