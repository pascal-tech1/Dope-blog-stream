import React, { useState, useCallback, useRef, useEffect } from "react";
import { BiDownload, BiReset, BiZoomIn, BiZoomOut } from "react-icons/bi";
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
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { uploadProfilePhoto } from "../redux/user/userSlice";
import { useDispatch } from "react-redux";

function generateDownload(canvas, crop) {
	if (!crop || !canvas) {
		return;
	}

	canvas.toBlob(
		(blob) => {
			const previewUrl = window.URL.createObjectURL(blob);

			const anchor = document.createElement("a");
			anchor.download = "cropPreview.png";
			anchor.href = URL.createObjectURL(blob);
			anchor.click();

			window.URL.revokeObjectURL(previewUrl);
		},
		"image/png",
		1
	);
}

function setCanvasImage(image, canvas, crop, scale, rotation) {
	if (!crop || !canvas || !image) {
		return;
	}

	const scaleX = image.naturalWidth / image.width;
	const scaleY = image.naturalHeight / image.height;
	const ctx = canvas.getContext("2d");
	const pixelRatio = window.devicePixelRatio;

	const canvasWidth = canvas.width / pixelRatio;
	const canvasHeight = canvas.height / pixelRatio;

	const { x, y, width, height } = crop;

	const rotatedWidth =
		width * Math.abs(Math.cos((rotation * Math.PI) / 180)) +
		height * Math.abs(Math.sin((rotation * Math.PI) / 180));
	const rotatedHeight =
		height * Math.abs(Math.cos((rotation * Math.PI) / 180)) +
		width * Math.abs(Math.sin((rotation * Math.PI) / 180));

	canvas.width = rotatedWidth * scale * pixelRatio * scaleX;
	canvas.height = rotatedHeight * scale * pixelRatio * scaleY;

	ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
	ctx.imageSmoothingQuality = "high";

	// Translate to the center of the canvas, apply rotation, and then translate back
	ctx.translate(canvas.width / 2, canvas.height / 2);
	ctx.rotate((rotation * Math.PI) / 180);
	ctx.translate(-canvas.width / 2, -canvas.height / 2);

	ctx.drawImage(
		image,
		x * scaleX,
		y * scaleY,
		width * scaleX,
		height * scaleY,
		0,
		0,
		rotatedWidth * scale * scaleX,
		rotatedHeight * scale * scaleY
	);
}

export default function Image({ image, setShown }) {
	const [upImg, setUpImg] = useState();
	const [hasAspectRatio, togleHasAspectRatio] = useState(true);
	const imgRef = useRef(null);
	const previewCanvasRef = useRef(null);
	const dispatch = useDispatch();

	const [crop, setCrop] = useState({ unit: "px", width: 30, aspect: 1 });
	const [scaleNumber, setScaleNumber] = useState(1);
	const [angle, setAngle] = useState(0);
	const [isPreview, setIsPreview] = useState(false);

	const uploadCroppedImage = async () => {
		if (!completedCrop || !previewCanvasRef.current) {
			return;
		}

		const blobPromise = new Promise((resolve) => {
			previewCanvasRef.current.toBlob(
				(blob) => {
					resolve(blob);
				},
				"image/png",
				1
			);
		});

		const blob = await blobPromise;

		const file = new File([blob], "croppedImage.png", {
			type: "image/png",
		});
		// dispatch(uploadProfilePhoto(file));
		dispatch(uploadProfilePhoto(file));

		setShown(null);
	};

	useEffect(() => {
		if (hasAspectRatio) {
			setCrop({ unit: "px", width: 30, aspect: 1 });
		} else {
			setCrop({});
		}
	}, [hasAspectRatio]);

	const [completedCrop, setCompletedCrop] = useState(null);

	// on selecting file we set load the image on to cropper
	const onSelectFile = (e) => {
		if (e.target.files && e.target.files.length > 0) {
			const reader = new FileReader();
			reader.addEventListener("load", () => setUpImg(reader.result));
			reader.readAsDataURL(e.target.files[0]);
		}
	};

	const onLoad = useCallback((img) => {
		imgRef.current = img;
	}, []);

	useEffect(() => {
		setCanvasImage(
			imgRef.current,
			previewCanvasRef.current,
			completedCrop,
			scaleNumber,
			angle
		);
	}, [completedCrop, scaleNumber, angle]);

	return (
		<div className=" z-[1000] fixed top-0 left-0 w-full h-full flex justify-center bg-black bg-opacity-40   ">
			<div
				className={` ${
					!isPreview && "justify-between"
				} flex items-center flex-col  bg-white h-[90vh] w-[100vw] lg:w-[80vw] shadow-lg rounded-lg mx-2 mt-6 relative`}
			>
				<button
					onClick={() => setShown(null)}
					className="right-3 absolute top-2 drop-shadow-lg "
				>
					<MdCancel className=" fill-red-400 shadow-md hover:shadow-none text-xl " />
				</button>

				<div className="flex justify-between items-center  gap-4 pt-4 pb-3  px-4  flex-wrap">
					<label className="  cursor-pointer ">
						<input
							type="file"
							accept="image/*"
							onChange={onSelectFile}
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
						disabled={!completedCrop?.width || !completedCrop?.height}
						onClick={() =>
							generateDownload(previewCanvasRef.current, completedCrop)
						}
						className=" border shadow-md hover:shadow-sm py-1 rounded-md px-3"
					>
						<BiDownload />
					</button>
					<button
						onClick={() => uploadCroppedImage()}
						className=" border shadow-md hover:shadow-sm py-1 rounded-md px-3"
					>
						<FiUploadCloud />
					</button>
				</div>

				<div
					className={`${
						isPreview ? "hidden" : ""
					}  px-4 flex flex-col items-center `}
				>
					<div className=" ">
						<div className=" z-[10000000000000]">
							<ReactCrop
								src={image}
								onImageLoaded={onLoad}
								crop={crop}
								onChange={(c) => setCrop(c)}
								onComplete={(c) => setCompletedCrop(c)}
								// onChange={onCropChange}
								scale={scaleNumber}
								style={{ maxHeight: "90vh", maxWidth: "80vh" }}
								className={`${
									scaleNumber > 0 && ""
								}  custom-scrollbar cursor-grab `}
								// keepSelection={!isPreview}
								rotate={angle}
							/>
						</div>
					</div>
				</div>
				<div
					className={`${
						isPreview ? "hidden" : ""
					}  flex gap-4 flex-wrap  bg-slate-200 px-8 py-2 mb-4 rounded-md items-center mt-4  `}
				>
					<button
						className=" shadow-sm hover:shadow-none"
						onClick={() => togleHasAspectRatio(!hasAspectRatio)}
					>
						<MdImageAspectRatio />
					</button>
					<button
						className=" shadow-sm hover:shadow-none"
						onClick={() => setScaleNumber(scaleNumber + 0.1)}
					>
						<BiZoomIn />
					</button>
					<button
						className=" shadow-sm hover:shadow-none"
						onClick={() =>
							scaleNumber > 0.2 && setScaleNumber(scaleNumber - 0.1)
						}
					>
						<BiZoomOut />
					</button>
					<button
						className=" shadow-sm hover:shadow-none"
						onClick={() => setAngle(angle + 10)}
					>
						<MdRotateLeft />
					</button>
					<button
						className=" shadow-sm hover:shadow-none"
						onClick={() => setAngle(angle - 10)}
					>
						<MdRotateRight />
					</button>
					<button
						className=" shadow-sm hover:shadow-none"
						onClick={() => setAngle(0)}
					>
						<BiReset />
					</button>
				</div>
				<div
					className={`${
						isPreview ? "" : "hidden"
					}   px-4  self-center my-auto  `}
				>
					{/* Canvas to display cropped image */}
					<canvas
						ref={previewCanvasRef}
						// Rounding is important so the canvas width and height matches/is a multiple for sharpness.
						style={{
							width: Math.round(completedCrop?.width ?? 0),
							height: Math.round(completedCrop?.height ?? 0),
						}}
					/>
				</div>
			</div>
		</div>
	);
}
