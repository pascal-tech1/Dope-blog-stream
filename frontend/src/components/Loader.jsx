import React from "react";

const Loader = () => {
	const myStyles = {
		width: "48px",
		height: "48px",
		border: "3px dotted #FFF",
		borderStyle: "solid solid dotted dotted",
		borderRadius: "50%",
		display: "inline-block",
		position: "relative",
		boxSizing: "border-box",
		animation: "rotation 2s linear infinite",
	};

	const afterStyles = {
		content: "",
		boxSizing: "border-box",
		position: "absolute",
		left: "0",
		right: "0",
		top: "0",
		bottom: "0",
		margin: "auto",
		border: "3px dotted #FF3D00",
		borderStyle: "solid solid dotted",
		width: "24px",
		height: "24px",
		borderRadius: "50%",
		animation: "rotationBack 1s linear infinite",
		transformOrigin: "center center",
	};

	return (
		<span style={myStyles}>
			<span style={afterStyles}></span>
		</span>
	);
};

export default Loader;
