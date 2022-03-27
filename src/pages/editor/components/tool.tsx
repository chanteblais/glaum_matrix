import React, { ReactComponentElement } from "react";
import { IconButton } from "@mui/material";

interface ToolProps {
	id: string;
	icon: ReactComponentElement<any>;
	enabled: boolean;
	selectedTool?: string;
	selectTool?;
	onClickCallback?;
}

const Tool = ({ id, icon, enabled, onClickCallback, selectedTool, selectTool }: ToolProps) => {

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
							xs: 45,
							md: 55
						},
						height: {
							xs: 45,
							md: 55
						},
						color: "common.white",
						margin: "3px",
						backgroundColor: "#28233d",
						border: selectedTool === id ? "1px solid #FFFFFF" : "",
						borderRadius: "5px",
						boxShadow: 3,
					}}
					disabled={!enabled}
					onClick={(e) => handleClick(e)}
		>
			{icon}
		</IconButton>
	);
};

export default Tool;
