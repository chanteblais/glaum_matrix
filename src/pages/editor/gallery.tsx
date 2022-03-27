import { Card, CardContent, useMediaQuery } from "@mui/material";
import React, { ReactComponentElement } from "react";
import { Theme } from "@mui/material/styles";
import { colours } from "./config";
import { FramesService } from "./services/framesService";

const Gallery = ({ frames }) => {

  const isSmallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down("md"));

  return (
    <Card id="">
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
        {frames.map((frame, i) => {
          console.log(frame[0]);
          return <img key={i} src={frame[0].src} alt="adf"/>;
        })}
      </CardContent>
    </Card>);
};

export default Gallery;
