import React from "react";
import Tool from "../components/tool";
import FormatColorResetOutlinedIcon from "@mui/icons-material/FormatColorResetOutlined";

export const eraserId = "eraser";

const Eraser = ({ selectedTool, selectTool }) => {
  return (
    <Tool id={eraserId}
          icon={<FormatColorResetOutlinedIcon sx={{ fontSize: "1.75rem" }}/>}
          selectedTool={selectedTool}
          selectTool={selectTool}
    />
  );
};

export default Eraser;
