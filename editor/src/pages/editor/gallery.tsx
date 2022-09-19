import { Card, CardContent } from "@mui/material";
import React, { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { Frame } from "../../components/shapes";
import Utils from "../../services/utils";

interface GalleryProps {
	frames: Frame[];
	selectFrame;
	updateFrames;
}

const Gallery = ({ frames, selectFrame, updateFrames }: GalleryProps) => {

	const [isBrowser, setIsBrowser] = useState(false);

	useEffect(() => {
		setIsBrowser(typeof window !== 'undefined');
	}, []);

	// const isSmallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down("md"));

	const reorder = (list, startIndex, endIndex) => {
		const result = Utils.deepClone(list);
		const [removed] = result.splice(startIndex, 1);
		result.splice(endIndex, 0, removed);
		return result;
	};

	function onDragEnd(result) {
		// dropped outside the list
		if (!result.destination) {
			return;
		}

		const items = reorder(
			frames,
			result.source.index,
			result.destination.index
		);

		updateFrames(items);
	}

	return isBrowser ? (
		<DragDropContext onDragEnd={onDragEnd}>
			<Droppable droppableId="droppable" direction="horizontal">
				{(provided) => (
					<Card>
						<CardContent
							ref={provided.innerRef}
							sx={{
								//   paddingBottom: {
								//     xs: 1,
								//     md: 4,
								//     "&:last-of-type": {
								//       paddingBottom: isSmallScreen ? "0.25rem" : "1rem"
								//     }
								//   },
								overflow: "auto",
								display: "flex",
							}}
							{...provided.droppableProps}
						>
							{frames.map((item, index) => (
								<Draggable key={item.key} draggableId={item.key.toString()} index={index}>
									{(provided) => (
										<div
											ref={provided.innerRef}
											{...provided.draggableProps}
											{...provided.dragHandleProps}
										>
											<img
												alt={item.key.toString()}
												src={item.image.src}
												style={{
													border: item.current ? "1px solid white" : "none",
													margin: "0 5px 0 5px"
												}}
												onClick={() => selectFrame(item)}
											/>
										</div>
									)}
								</Draggable>
							))}
							{provided.placeholder}
						</CardContent>
					</Card>
				)}
			</Droppable>
		</DragDropContext>
	) : null;
};

export default Gallery;
