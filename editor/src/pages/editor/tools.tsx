import React from "react";
import { Card, CardContent, useMediaQuery } from "@mui/material";
import { Theme } from "@mui/material/styles";
import Clear from "./tools/clear";
import Pencil from "./tools/pencil";
import Eraser from "./tools/eraser";
import Bucket from "./tools/bucket";
import Backward from "./tools/backward";
import Forward from "./tools/forward";

const Tools = ({ enabled, canvasService, selectedTool, selectTool }) => {

	const isSmallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down("md"));

	return (
		<Card>
			<CardContent
				sx={{
					padding: {
						xs: 1,
						md: 4,
					},
					paddingBottom: {
						xs: 1,
						md: 4,
						"&:last-of-type": {
							paddingBottom: isSmallScreen ? "0.25rem" : "1rem"
						}
					},
					display: "flex",
					flexWrap: "wrap"
				}}
			>
				<Pencil selectedTool={selectedTool} selectTool={selectTool} enabled={enabled}/>
				<Eraser selectedTool={selectedTool} selectTool={selectTool} enabled={enabled}/>
				<Bucket selectedTool={selectedTool} selectTool={selectTool} enabled={enabled}/>
				<Clear canvasService={canvasService} enabled={enabled}/>
				<Backward canvasService={canvasService} enabled={enabled}/>
				<Forward canvasService={canvasService} enabled={enabled}/>
			</CardContent>
		</Card>
	);
};

export default Tools;
