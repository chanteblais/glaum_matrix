import React from "react";
import Tool from "../components/tool";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";

const Play = ({ canvasService }) => {
  return (
    <Tool id="play"
          icon={<PlayArrowIcon sx={{ fontSize: "1.75rem" }}/>}
          onClickCallback={() => canvasService.clear()}
    />
  );
};

export default Play;
