import type { NextApiRequest, NextApiResponse } from "next";
import nc from "next-connect";
import { FileUtils } from "../../common/fileUtils";

export default nc<NextApiRequest, NextApiResponse>()
	.post((req, res) => {
		if (req.body) {
			const drawing = JSON.parse(req.body);
			if (drawing.name) {
				FileUtils.writeFile(`${process.env.imagesPath}/${drawing.name}.json`, drawing);
			} else {
				FileUtils.writeFile(`${process.env.imagesPath}/${req.socket.remoteAddress}.json`, drawing);
			}
			res.status(200).send();
		} else {
			console.log("Invalid body", req.body);
			res.status(400).send();
		}
	});
