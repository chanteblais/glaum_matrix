import { useEffect, useRef } from "react";
import { Card } from "@mui/material";

let active;

const Board = ({ canvasService, width, height }) => {

	const canvasRef = useRef(null);

	useEffect(() => {
		canvasService.setupCanvas(canvasRef.current, width, height);
		// Moved on-click to on-mouse-up to tell the difference between a click and a mouse-drag + click
		canvasRef.current.addEventListener("mousemove", e => {
			if (active) {
				canvasService.perform(e.clientX, e.clientY, false);
			}
		});

		canvasRef.current.addEventListener("touchmove", e => {
			canvasService.perform(e.touches[0].clientX, e.touches[0].clientY, false);
		});

		canvasRef.current.addEventListener("mousedown", async () => {
			canvasService.beforePerform();
			active = true;
			//window.app.publish().then();
		});
		canvasRef.current.addEventListener("mouseup", async e => {
			active = false;
			canvasService.perform(e.clientX, e.clientY, true);
			//window.app.publish().then();
		});
	}, [canvasService, width, height]);

	return (
		<Card sx={{
			padding: {
				xs: 1,
				lg: 4
			},
			display: "flex",
			justifyContent: "center",
		}}>
			<canvas
				id="canvasService"
				ref={canvasRef}
				width={10 * width}
				height={10 * height}
				style={{
					boxShadow: "0 0 5px 0 rgba(0 0 0)",
					width: "100%",
					maxWidth: "600px",
					cursor: "crosshair",
					touchAction: "none",
					imageRendering: "pixelated",
				}}
			/>
		</Card>
	);
};

export default Board;
