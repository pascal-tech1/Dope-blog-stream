import React, { useState } from "react";
import { uptimizeCloudinaryImage } from "../utils/imageCloudinaryOptimizer";

const LazyLoadImg = ({
	backgroundClassName,
	imgClassName,
	originalImgUrl,
	blurImageStr,
	optimizationStr,
}) => {
	const [isLoaded, setIsLoaded] = useState(false);
	const optimizedImageUrl = uptimizeCloudinaryImage(
		optimizationStr,
		originalImgUrl
	);

	if (!blurImageStr) {
		return (
			<img
				className={backgroundClassName}
				src={optimizedImageUrl}
				alt=""
				loading="lazy"
			/>
		);
	}
	return (
		<div
			className={backgroundClassName}
			style={{
				backgroundImage:
					blurImageStr && `url(data:image/png;base64,${blurImageStr})`,
				backgroundSize: "cover",
				backgroundPosition: "center",
				paddingBottom: "100%", // Maintain aspect ratio by setting paddingBottom to a percentage
			}}
		>
			<img
				className={imgClassName}
				src={optimizedImageUrl}
				alt=""
				onLoad={() => setIsLoaded(true)}
				style={{ visibility: isLoaded ? "visible" : "hidden" }}
				loading="lazy"
			/>
		</div>
	);
};

export default LazyLoadImg;
