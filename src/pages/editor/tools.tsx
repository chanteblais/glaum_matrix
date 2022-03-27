import React from "react";
import Clear from "./tools/clear";
import Add from "./tools/add";
import Pencil from "./tools/pencil";
import Eraser from "./tools/eraser";
import Bucket from "./tools/bucket";
import Back from "./tools/back";
import Forward from "./tools/forward";
import Duplicate from "./tools/duplicate";
import Play from "./tools/play";
import { Card, CardContent, useMediaQuery } from "@mui/material";
import { Theme } from "@mui/material/styles";

const Tools = ({ canvasService, selectedTool, selectTool }) => {

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
        <Pencil selectedTool={selectedTool} selectTool={selectTool}/>
        <Eraser selectedTool={selectedTool} selectTool={selectTool}/>
        <Bucket selectedTool={selectedTool} selectTool={selectTool}/>
        <Clear canvasService={canvasService}/>
        <Add canvasService={canvasService}/>
        <Duplicate canvasService={canvasService}/>
        <Back canvasService={canvasService}/>
        <Forward canvasService={canvasService}/>
        <Play canvasService={canvasService}/>
      </CardContent>
    </Card>
  );
};

export default Tools;
