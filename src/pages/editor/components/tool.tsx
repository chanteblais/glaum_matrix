import React, { ReactComponentElement } from "react";
import { IconButton } from "@mui/material";

interface ToolProps {
  id: string;
  icon: ReactComponentElement<any>;
  selectedTool?: string;
  selectTool?;
  onClickCallback?;
}

const Tool = ({ id, icon, onClickCallback, selectedTool, selectTool }: ToolProps) => {

  function handleClick(e) {
    if (selectTool) {
      selectTool(id);
    }
    if (onClickCallback) {
      onClickCallback(e);
    }
  }

  return (
    <IconButton component="div"
                sx={{
                  width: {
                    xs: 48,
                    md: 55
                  },
                  height: {
                    xs: 48,
                    md: 55
                  },
                  color: "common.white",
                  margin: "3px",
                  backgroundColor: "#28233d",
                  border: selectedTool === id ? "1px solid #FFFFFF" : "",
                  borderRadius: "5px",
                  boxShadow: 3,
                }}
                onClick={(e) => handleClick(e)}
    >
      {icon}
    </IconButton>
  );
};

export default Tool;
