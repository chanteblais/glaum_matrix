import React, { useCallback, useRef, useState } from "react";
import { Box, Card, CardContent, IconButton, useMediaQuery } from "@mui/material";
import ColorizeIcon from "@mui/icons-material/Colorize";
import { Theme } from "@mui/material/styles";
import { HexColorPicker } from "react-colorful";
import useClickOutside from "../../services/useClickOutside";
import Utils from "../../services/utils";

const Palette = ({ colours, selectedColour, selectColour }) => {

	const popover = useRef();
	const [colourPicked, setColourPicked] = useState("");
	const [isOpen, toggle] = useState(false);

	const close = useCallback(() => {
		toggle(false);
		selectColour(Utils.hexToRgba(colourPicked));
	}, [selectColour, colourPicked]);
	useClickOutside(popover, close);

	function createPredefinedSwatch(colour, i) {
		return createSwatch(colour, i, <IconButton sx={{ fontSize: "1.75rem" }}/>, () => selectColour(colour));
	}

	function createColourPicker() {
		return (
			<Box sx={{
				position: "relative",
				zIndex: 1
			}}>
				{createSwatch(selectedColour, "colourPicker", <ColorizeIcon sx={{ fontSize: "1.75rem" }}/>, () => toggle(true))}
				{isOpen && (
					<Box ref={popover}
						 sx={{
							 position: "absolute",
							 top: "calc(100 % +2px)",
							 left: 0,
							 borderRadius: "5px",
							 boxShadow: 3,
						 }}>
						<HexColorPicker color={Utils.rgbArrayToHex(selectedColour)} onChange={setColourPicked}/>
					</Box>
				)}
			</Box>
		);
	}

	function createSwatch(colour, key, content, onClick) {
		if (colour && key && content && onClick) {
			return (
				<IconButton
					key={key}
					component="div"
					sx={{
						width: {
							xs: 40,
						},
						height: {
							xs: 40,
						},
						margin: "3px",
						backgroundColor: "rgb(" + colour[0] + "," + colour[1] + "," + colour[2] + ")",
						border: selectedColour === colour ? "1px solid white" : "",
						borderRadius: "5px",
						boxShadow: 3,
						cursor: "pointer"
					}}
					onClick={onClick}
				>
					{content}
				</IconButton>
			);
		}
	}

	const isSmallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down("md"));

	return (
		<Card sx={{
			overflow: "visible"
		}}>
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
				{createColourPicker()}
				{colours?.map((color, i) => createPredefinedSwatch(color, i))}
			</CardContent>
		</Card>);
};

export default Palette;
