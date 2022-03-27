import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import Palette from "./palette";
import Board from "./board";
import Tools from "./tools";
import Gallery from "./gallery";
import { pencilId } from "./tools/pencil";
import { initialColour, matrixHeight, matrixWidth } from "./config";
import { CanvasService } from "./services/canvasService";
import { FramesService } from "./services/framesService";
import { Drawing } from "./services/drawing";

const Editor = () => {

  const [drawing] = useState(() => new Drawing());
  const [canvasService] = useState(() => new CanvasService(drawing));
  const [framesService] = useState(() => new FramesService(canvasService, drawing));
  drawing.setCanvasService(canvasService);
  drawing.setFramesService(framesService);

  const [currentData, setCurrentData] = useState([]);
  const [selectedTool, setSelectedTool] = useState(pencilId);
  const [selectedColour, setSelectedColour] = useState(initialColour);

  function updateData(data){
    console.log(data);
    setCurrentData(data);
  }
  canvasService.setData(currentData);
  canvasService.setUpdateDataCallback(updateData);

  useEffect(() => {
    canvasService.setTool(selectedTool);
  }, [selectedTool]);

  useEffect(() => {
    canvasService.setColour(selectedColour);
  }, [selectedColour]);

  return (
    <Grid container spacing={{ xs: 1, lg: 4 }}>
      <Grid item xs justifyContent="center">
        <Tools canvasService={canvasService} selectedTool={selectedTool} selectTool={setSelectedTool}/>
      </Grid>
      <Grid item xs={12} lg={8} justifyContent="center">
        <Board canvasService={canvasService} height={matrixWidth} width={matrixHeight}/>
      </Grid>
      <Grid item xs justifyContent="center" order={{ xs: 4, lg: 2 }}>
        <Palette selectedColour={selectedColour} selectColour={setSelectedColour}/>
      </Grid>
      <Grid item xs={12} justifyContent="center" order={{ xs: 2, lg: 4 }}>
        {/*<Gallery frames={frames}/>*/}
      </Grid>
    </Grid>
  );
};

export default Editor;
