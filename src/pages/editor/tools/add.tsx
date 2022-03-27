import React from "react";
import AddIcon from "@mui/icons-material/Add";
import Tool from "../components/tool";

const Add = ({ canvasService }) => {
  return (
    <Tool id="add"
          icon={<AddIcon sx={{ fontSize: "1.75rem" }}/>}
          onClickCallback={() => canvasService.clear()}
    />
  );
};

export default Add;
