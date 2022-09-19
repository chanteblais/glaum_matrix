import React from "react";
import ClearIcon from "@mui/icons-material/Clear";
import Tool from "../../../components/tool";

const Clear = ({ canvasService, enabled }) => {
	return (
		<Tool id="clear"
			  icon={<ClearIcon sx={{ fontSize: "1.75rem" }}/>}
			  enabled={enabled}
			  onClickCallback={() => canvasService.clear()}
		/>
	);
};

export default Clear;
