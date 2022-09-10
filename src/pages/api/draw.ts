import type { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import nc from "next-connect";
import { FileUtils } from "../../common/fileUtils";

export default nc<NextApiRequest, NextApiResponse>()
	.post((req, res) => {
		if (req.body) {
			if (req.body.name) {
				FileUtils.writeFile(path.resolve(__dirname, `../../../gifs/${req.body.name}.json`), req.body);
			} else {
				FileUtils.writeFile(path.resolve(__dirname, `../../../gifs/${req.socket.remoteAddress}.json`), req.body);
			}
			res.status(200);
		} else {
			console.log("Invalid body", req.body);
			res.status(400);
		}
	});

// export default handler;

// export default (req: NextApiRequest, res: NextApiResponse) => {
// 	if (req.body) {
// 		if (req.body.name) {
// 			FileUtils.writeFile(path.resolve(__dirname, `../../../gifs/${req.body.name}.json`), req.body);
// 		} else {
// 			FileUtils.writeFile(path.resolve(__dirname, `../../../gifs/${req.socket.remoteAddress}.json`), req.body);
// 		}
// 		res.status(200);
// 	} else {
// 		console.log("Invalid body", req.body);
// 		res.status(400);
// 	}
// }
