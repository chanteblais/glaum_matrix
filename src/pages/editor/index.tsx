import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import Palette from "./palette";
import Board from "./board";
import Tools from "./tools";
import Gallery from "./gallery";
import GifControls from "./gifControls";
import { pencilId } from "./tools/pencil";
import { initialColour, matrixHeight, matrixWidth, maxNumberOfSwatches, predefinedColours } from "../../configs/config";
import { CanvasService } from "../../services/canvasService";
import { FramesService } from "../../services/framesService";
import { Frame } from "../../components/shapes";

const Editor = () => {

	// This is the tricky part, where the frames service (that controls the gallery) is connected to the canvas service (that controls the canvas)
	// A few callbacks here and there to maintain the loose coupling
	const [canvasService] = useState(() => new CanvasService());
	const [framesService] = useState(() => new FramesService(canvasService));

	// The state of the frames, for the gallery to always be updated according to what's being drawn
	const [frames, setFrames] = useState(() => new Array<Frame>());

	// When a frame is selected, set the current frame in the frames service (it will also trigger the frames state update)
	// Then populate the canvas with the frame data
	function selectFrame(frame: Frame) {
		console.log("Selected frame: ", frame);
		framesService.setCurrentFrame(frame.key);
		canvasService.populate(frame.data);
	}

	// Hook for updating the frames in the frames service, which in turn will update the frames state.
	// We do this because most frames operations happen in the frames service
	function updateFrames(frames: Frame[]) {
		framesService.updateFrames(frames);
	}

	// Set the callback for the canvas to update the current frame
	// This is the function in the frames service that updates the current frame
	canvasService.setUpdateCurrentFrameCallback(framesService.updateCurrentFrame.bind(framesService));

	// Set the callback for the frames service to update the frames state
	// This is required so the gallery component re-render the frames when they're updated
	framesService.setUpdateFramesCallback(setFrames.bind(this));

	// State for the tool
	const [selectedTool, setSelectedTool] = useState(pencilId);
	useEffect(() => {
		canvasService.setTool(selectedTool);
	}, [selectedTool, canvasService]);

	// State for the colour palette
	const [colours, setColours] = useState([...predefinedColours]);

	// State for the selected colour
	const [selectedColour, setSelectedColour] = useState(initialColour);
	useEffect(() => {
		canvasService.setColour(selectedColour);
	}, [selectedColour, canvasService]);

	function colourPicked(colour) {
		console.log("Colour picked:", colour);
		updateColours(colour);
		setSelectedColour(colour);
	}

	function updateColours(colour) {
		for (const existing of colours) {
			if (JSON.stringify(existing) === JSON.stringify(colour)) {
				return;
			}
		}
		console.log("Adding new colour");
		const newColours = [...colours];
		newColours.splice(predefinedColours.length, null, colour);
		setColours(newColours.slice(0, maxNumberOfSwatches));
	}

	// State for gif toggle
	const [gifEnabled, setGifEnabled] = useState(true);

	// State for playing gifs
	const [playGif, setPlayGif] = useState(false);

	// Disable canvas when gifs are playing
	useEffect(() => {
		canvasService.setEnabled(!playGif);
	}, [canvasService, playGif]);

	return (
		<Grid container spacing={{ xs: 1, lg: 4 }}>
			<Grid item xs justifyContent="center">
				<Grid container spacing={{ xs: 1, lg: 4 }}>
					<Grid item xs>
						<Tools enabled={!playGif} canvasService={canvasService} selectedTool={selectedTool} selectTool={setSelectedTool}/>
					</Grid>
					<Grid item xs>
						<GifControls enabled={!playGif}
									 canvasService={canvasService}
									 framesService={framesService}
									 gifEnabled={gifEnabled}
									 setGifEnabled={setGifEnabled}
									 playGif={playGif}
									 setPlayGif={setPlayGif}
									 frames={frames}
									 selectFrame={selectFrame}/>
					</Grid>
				</Grid>
			</Grid>
			<Grid item xs={12} lg={8} justifyContent="center">
				<Board canvasService={canvasService} height={matrixWidth} width={matrixHeight}/>
			</Grid>
			<Grid item xs justifyContent="center" order={{ xs: 4, lg: 2 }}>
				<Palette colours={colours} selectedColour={selectedColour} selectColour={colourPicked}/>
			</Grid>
			{
				gifEnabled ?
					<Grid item xs={12} justifyContent="center" order={{ xs: 2, lg: 4 }}>
						<Gallery frames={frames} updateFrames={updateFrames} selectFrame={selectFrame}/>
					</Grid> : null
			}
		</Grid>
	);
};

export default Editor;
