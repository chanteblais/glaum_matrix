import React from "react";
import Tool from "../components/tool";
import CreateTwoToneIcon from "@mui/icons-material/CreateTwoTone";

export const pencilId = "pencil";

const Pencil = ({ selectedTool, selectTool }) => {
  return (
    <Tool id={pencilId}
          icon={<CreateTwoToneIcon sx={{ fontSize: "1.75rem" }}/>}
          selectedTool={selectedTool}
          selectTool={selectTool}
    />
  );
};

export default Pencil;
