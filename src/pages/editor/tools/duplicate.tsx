import React from "react";
import Tool from "../components/tool";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

const Duplicate = ({ canvasService }) => {
  return (
    <Tool id="duplicate"
          icon={<ContentCopyIcon sx={{ fontSize: "1.75rem" }}/>}
          onClickCallback={() => canvasService.clear()}
    />
  );
};

export default Duplicate;
