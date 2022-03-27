import { colours } from "./config";
import { Card, CardContent, IconButton, useMediaQuery } from "@mui/material";
import React from "react";
import { Theme } from "@mui/material/styles";

const Palette = ({ selectedColour, selectColour }) => {

  function createSwatch(colour, i) {
    return (
      <IconButton
        key={i}
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
        }}
        onClick={() => selectColour(colour)}
      >
        &nbsp;
      </IconButton>
    );
  }

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
        {colours.map((color, i) => {
          return createSwatch(color, i);
        })}
      </CardContent>
    </Card>);
};

export default Palette;
