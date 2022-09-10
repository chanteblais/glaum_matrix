import React from "react";
import Tool from "../../../components/tool";
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';

const Upload = ({ canvasService, enabled }) => {
	return (
		<Tool id="play"
			  icon={<CloudUploadOutlinedIcon sx={{ fontSize: "1.75rem" }}/>}
			  enabled={enabled}
			  onClickCallback={() => canvasService.clear()}
		/>
	);
};

export default Upload;
