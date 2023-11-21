import React, { useState, useCallback, useRef, useEffect } from "react";
import {
	BiCrop,
	BiDownload,
	BiReset,
	BiZoomIn,
	BiZoomOut,
} from "react-icons/bi";
import { FiUploadCloud } from "react-icons/fi";
import { LuImagePlus } from "react-icons/lu";
import {
	MdCancel,
	MdImageAspectRatio,
	MdPreview,
	MdRestore,
	MdRotateLeft,
	MdRotateRight,
} from "react-icons/md";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { useDispatch } from "react-redux";
import { BsCrop } from "react-icons/bs";

const defaultSrc =
	"https://raw.githubusercontent.com/roadmanfong/react-cropper/master/example/img/child.jpg";

export const Image = ({
	handleFileChange,
	image,
	setImage,
	fileName,
	uploadAction,
	whatUploading,
}) => {
	const [cropData, setCropData] = useState("#");
	const [isPreview, setIsPreview] = useState(false);
	const cropperRef = useRef(null);
	const dispatch = useDispatch();

	const handleCropEnd = () => {
		if (typeof cropperRef.current?.cropper !== "undefined") {
			// Get the cropped canvas with transparent fill
			const croppedCanvas = cropperRef.current?.cropper.getCroppedCanvas({
				fillColor: "transparent",
			});

			// Convert the canvas to a data URL

			setCropData(croppedCanvas.toDataURL("image/jpeg"));
		}
	};
	const handleImageUpload = async () => {
		if (typeof cropperRef.current?.cropper !== "undefined") {
			// Get the cropped canvas with transparent fill
			const croppedCanvas = cropperRef.current?.cropper.getCroppedCanvas({
				fillColor: "transparent",
			});

			const blobPromise = new Promise((resolve) => {
				croppedCanvas.toBlob(
					(blob) => {
						resolve(blob);
					},
					"image/png",
					1
				);
			});

			const blob = await blobPromise;

			const file = new File([blob], fileName, {
				type: "image/png",
			});

			dispatch(uploadAction({ file, whatUploading }));
			setImage(null);
		}
	};
	const handleDownload = () => {
		const croppedCanvas = cropperRef.current?.cropper.getCroppedCanvas({
			fillColor: "transparent",
		});

		// Create a download link
		const downloadLink = document.createElement("a");
		downloadLink.href = croppedCanvas.toDataURL("image/jpeg");
		downloadLink.download = fileName || "cropped_image.jpeg";

		// Trigger a click event on the download link
		document.body.appendChild(downloadLink);
		downloadLink.click();

		// Clean up and remove the download link
		document.body.removeChild(downloadLink);
	};

	const handleZoomIn = () => {
		if (typeof cropperRef.current?.cropper !== "undefined") {
			// Get the cropped canvas with transparent fill
			cropperRef.current?.cropper.zoom(0.1);
		}
	};
	const handleZoomOut = () => {
		if (typeof cropperRef.current?.cropper !== "undefined") {
			// Get the cropped canvas with transparent fill
			cropperRef.current?.cropper.zoom(-0.1);
		}
	};
	const handleRotateLeft = () => {
		if (typeof cropperRef.current?.cropper !== "undefined") {
			// Get the cropped canvas with transparent fill
			cropperRef.current?.cropper.rotate(-10);
		}
	};
	const handleRotateRight = () => {
		if (typeof cropperRef.current?.cropper !== "undefined") {
			// Get the cropped canvas with transparent fill
			cropperRef.current?.cropper.rotate(10);
		}
	};
	const handleReset = () => {
		if (typeof cropperRef.current?.cropper !== "undefined") {
			// Get the cropped canvas with transparent fill
			cropperRef.current?.cropper.reset();
			handleSetCustomCropping();
		}
	};
	const handleSetCoverCropping = () => {
		if (typeof cropperRef.current?.cropper !== "undefined") {
			cropperRef.current?.cropper.setAspectRatio(6);
		}
	};
	const handleSetProfileCropping = () => {
		if (typeof cropperRef.current?.cropper !== "undefined") {
			cropperRef.current?.cropper.setAspectRatio(1);
			cropperRef.current?.cropper.rounded(true);
		}
	};
	const handleSetCustomCropping = () => {
		if (typeof cropperRef.current?.cropper !== "undefined") {
			cropperRef.current?.cropper.setAspectRatio(NaN);
		}
	};
	return (
		<div className=" z-[1000] fixed top-0 left-0 w-full h-full flex justify-center bg-black bg-opacity-80 backdrop-blur-sm overflow-auto   ">
			<div
				className={` ${
					!isPreview && "justify-between"
				}  flex items-center flex-col bg-white h-[100vh] w-[100vw] lg:w-[80vw] shadow-lg rounded-lg mx-2  relative px-4 `}
			>
				<button
					onClick={(e) => {
						e.preventDefault();
						setImage(null);
					}}
					className="right-3 absolute top-2 drop-shadow-lg "
				>
					<MdCancel className=" fill-red-400 shadow-md hover:shadow-none text-xl " />
				</button>
				{/* cropper action button */}
				<div className="flex justify-center items-center  gap-8 pt-10 pb-3  px-4  flex-wrap self-stretch">
					<label className="  cursor-pointer ">
						<input
							type="file"
							accept="image/*"
							onChange={(e) => handleFileChange(e)}
							className=" hidden z-50"
						/>
						<h1 className=" border shadow-md hover:shadow-sm py-1 rounded-md px-3">
							<LuImagePlus />
						</h1>
					</label>
					<button
						onClick={() => setIsPreview(!isPreview)}
						className=" border shadow-md hover:shadow-sm py-1 rounded-md px-3"
					>
						<MdPreview />
					</button>
					<button
						onClick={handleDownload}
						className=" border shadow-md hover:shadow-sm py-1 rounded-md px-3"
					>
						<BiDownload />
					</button>
					<button
						// onClick={() => uploadCroppedImage()}
						onClick={handleImageUpload}
						className=" border shadow-md hover:shadow-sm py-1 rounded-md px-3"
					>
						<FiUploadCloud />
					</button>
				</div>
				{/* cropper image */}
				<div className={`${isPreview && "hidden"}`}>
					<div className="flex gap-4 text-sm py-4">
						<button
							onClick={handleSetCoverCropping}
							className=" shadow-sm  rounded-md hover:shadow-none flex items-center justify-center flex-col"
						>
							cover
						</button>
						<button
							onClick={handleSetProfileCropping}
							className=" shadow-sm  rounded-md hover:shadow-none flex flex-col"
						>
							profile
						</button>
						<button
							onClick={handleSetCustomCropping}
							className=" shadow-sm  rounded-md hover:shadow-none flex flex-col"
						>
							custom
						</button>
					</div>

					<Cropper
						initialAspectRatio={1}
						src={image}
						ref={cropperRef}
						viewMode={1}
						guides={true}
						minCropBoxHeight={10}
						minCropBoxWidth={10}
						background={false}
						responsive={true}
						checkOrientation={false}
						className=" max-h-[100%] max-w-[80vw] lg:max-w-[60vw]"
						cropend={handleCropEnd}
						restore={true}
						style={{ borderRadius: "50%" }}
					/>
				</div>

				{/* cropper tool bar */}
				<div
					className={`${
						isPreview ? "hidden" : ""
					}  flex gap-4 flex-wrap  bg-slate-200 px-8 py-2 mb-4 rounded-md items-center mt-4  text-lg `}
				>
					<button
						className=" shadow-md hover:shadow-none rounded-md px-1"
						onClick={handleZoomIn}
					>
						<BiZoomIn />
					</button>
					<button
						className=" shadow-md hover:shadow-none rounded-md px-1"
						onClick={handleZoomOut}
					>
						<BiZoomOut />
					</button>
					<button
						className=" shadow-md hover:shadow-none rounded-md px-1"
						onClick={handleRotateLeft}
					>
						<MdRotateLeft />
					</button>
					<button
						className=" shadow-md hover:shadow-none rounded-md px-1"
						onClick={handleRotateRight}
					>
						<MdRotateRight />
					</button>
					<button
						onClick={handleReset}
						className=" shadow-md hover:shadow-none rounded-md px-1"
					>
						<BiReset />
					</button>
				</div>
				{/* cropped image preview */}

				{/* Canvas to display cropped image */}
				<div className={` ${!isPreview && "hidden "}  my-auto `}>
					<img src={cropData} alt="cropped" className="  max-h-[50vh]" />
				</div>
			</div>
		</div>
	);
};

export default Image;