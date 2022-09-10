import React from "react";
import AddIcon from "@mui/icons-material/Add";
import Tool from "../../../components/tool";

const Add = ({ canvasService, framesService, enabled }) => {
	return (
		<Tool id="add"
			  icon={<AddIcon sx={{ fontSize: "1.75rem" }}/>}
			  enabled={enabled}
			  onClickCallback={() => {
				  framesService.addFrame();
				  canvasService.clear();
			  }}
		/>
	);
};

export default Add;
