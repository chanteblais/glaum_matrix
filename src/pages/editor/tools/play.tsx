import React from "react";
import Tool from "../components/tool";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import StopIcon from "@mui/icons-material/Stop";
import { createWorkerFactory, useWorker } from "@shopify/react-web-worker";

const Play = ({ playGif, setPlayGif, frames, selectFrame }) => {

	const createWorker = createWorkerFactory(() => import("../services/playGIFWorker"));
	const worker = useWorker(createWorker);

	async function play() {
		setPlayGif(true);
		await worker.play(frames, selectFrame);
	}

	async function stop() {
		await worker.stop();
		setPlayGif(false);
	}

	return (playGif
			?
			<Tool id="stop"
				  icon={<StopIcon sx={{ fontSize: "1.75rem" }}/>}
				  enabled={true}
				  onClickCallback={() => stop()}
			/>
			:
			<Tool id="play"
				  icon={<PlayArrowIcon sx={{ fontSize: "1.75rem" }}/>}
				  enabled={true}
				  onClickCallback={() => play()}
			/>
	);
};

export default Play;
