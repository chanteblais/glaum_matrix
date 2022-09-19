import React from "react";
import Tool from "../../../components/tool";
import ArrowForwardIosTwoToneIcon from "@mui/icons-material/ArrowForwardIosTwoTone";

const Forward = ({ canvasService, enabled }) => {
	return (
		<Tool id="forward"
			  icon={<ArrowForwardIosTwoToneIcon sx={{ fontSize: "1.75rem" }}/>}
			  enabled={enabled}
			  onClickCallback={() => canvasService.forward()}
		/>
	);
};

export default Forward;
