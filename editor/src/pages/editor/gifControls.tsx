import React from "react";
import Add from "./tools/add";
import Duplicate from "./tools/duplicate";
import Play from "./tools/play";
import Upload from "./tools/upload";
import { Card, CardContent, FormControlLabel, Grid, Switch, useMediaQuery } from "@mui/material";
import { Theme } from "@mui/material/styles";

const GifControls = ({ canvasService, framesService, enabled, gifEnabled, setGifEnabled, playGif, setPlayGif, frames, selectFrame }) => {

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
				<Grid container>
					<Grid item xs={12} sx={{ paddingLeft: { xs: 2 } }}>
						<FormControlLabel control={<Switch checked={gifEnabled} onChange={(e) => setGifEnabled(e.target.checked)} name="gifEnabled"/>} label="GIF"/>
					</Grid>
					{
						gifEnabled ?
							<Grid item xs={12}>
								<Add canvasService={canvasService} framesService={framesService} enabled={enabled}/>
								<Duplicate framesService={framesService} enabled={enabled}/>
								<Play playGif={playGif} setPlayGif={setPlayGif} frames={frames} selectFrame={selectFrame}/>
								<Upload canvasService={canvasService} enabled={enabled}/>
							</Grid> : null
					}
				</Grid>
			</CardContent>
		</Card>
	);
};

export default GifControls;
