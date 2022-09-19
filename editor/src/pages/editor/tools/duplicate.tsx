import React from "react";
import Tool from "../../../components/tool";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

const Duplicate = ({ framesService, enabled }) => {
	return (
		<Tool id="duplicate"
			  icon={<ContentCopyIcon sx={{ fontSize: "1.75rem" }}/>}
			  enabled={enabled}
			  onClickCallback={() => framesService.duplicateFrame()}
		/>
	);
};

export default Duplicate;
