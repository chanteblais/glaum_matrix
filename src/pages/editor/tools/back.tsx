import React from "react";
import Tool from "../components/tool";
import ArrowBackIosNewTwoToneIcon from "@mui/icons-material/ArrowBackIosNewTwoTone";

const Back = ({ canvasService }) => {
  return (
    <Tool id="add"
          icon={<ArrowBackIosNewTwoToneIcon sx={{ fontSize: "1.75rem" }}/>}
          onClickCallback={() => canvasService.clear()}
    />
  );
};

export default Back;
