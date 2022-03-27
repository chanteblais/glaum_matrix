import React from "react";
import Tool from "../components/tool";
import FormatColorFillTwoToneIcon from "@mui/icons-material/FormatColorFillTwoTone";

export const bucketId = "bucket";

const Bucket = ({ selectedTool, selectTool }) => {
  return (
    <Tool id={bucketId}
          icon={<FormatColorFillTwoToneIcon sx={{ fontSize: "1.75rem" }}/>}
          selectedTool={selectedTool}
          selectTool={selectTool}
    />
  );
};

export default Bucket;
