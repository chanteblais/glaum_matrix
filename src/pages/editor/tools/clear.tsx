import React from "react";
import ClearIcon from "@mui/icons-material/Clear";
import Tool from "../components/tool";

const Clear = ({ canvasService }) => {
  return (
    <Tool id="clear"
          icon={<ClearIcon sx={{ fontSize: "1.75rem" }}/>}
          onClickCallback={() => canvasService.clear()}
    />
  );
};

export default Clear;
