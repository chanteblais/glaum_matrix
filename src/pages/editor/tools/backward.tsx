import React from "react";
import Tool from "../../../components/tool";
import ArrowBackIosNewTwoToneIcon from "@mui/icons-material/ArrowBackIosNewTwoTone";

const Backward = ({ canvasService, enabled }) => {
	return (
		<Tool id="add"
			  icon={<ArrowBackIosNewTwoToneIcon sx={{ fontSize: "1.75rem" }}/>}
			  enabled={enabled}
			  onClickCallback={() => canvasService.backward()}
		/>
	);
};

export default Backward;
