// import { Box, Modal, Slider, Button } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import AvatarEditor from "react-avatar-editor";
import { FcAddImage } from "react-icons/fc";
import { AiFillGithub } from "react-icons/ai";
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

const Cropper = () => {
	const [slideValue, setSlideValue] = useState(10);
	const cropRef = useRef(null);
	const parentDivRef = useRef(null);
	useEffect(() => {
		// Function to get dimensions
		const getDimensions = () => {
			if (parentDivRef.current) {
				const width = parentDivRef.current.offsetWidth;
				const height = parentDivRef.current.offsetHeight;
				console.log("Width:", width, "Height:", height);
			}
		};

		// Call the function initially
		getDimensions();

		// Attach an event listener for window resize (optional)
		window.addEventListener("resize", getDimensions);

		// Clean up the event listener on component unmount
		return () => {
			window.removeEventListener("resize", getDimensions);
		};
	}, [parentDivRef]); // Empty dependency array ensures the effect runs only once on mount

	//handle save
	const handleSave = async () => {
		if (cropRef) {
			const dataUrl = cropRef.current.getImage().toDataURL();
			const result = await fetch(dataUrl);
			const blob = await result.blob();
			setPreview(URL.createObjectURL(blob));
			setModalOpen(false);
		}
	};
	// image src
	const [src, setSrc] = useState(null);
	const [width, setWidth] = useState(null);
	const [height, setHeight] = useState(null);
	const screenWidth = window.screen.width;
	const screenHeight = window.screen.height;
	console.log(screenWidth)
	useEffect(() => {
		if (screenWidth < 200) {
			setWidth(170);
		}
		if (screenWidth > 200 && screenWidth < 300) {
			setWidth(180);
		}
		if (screenWidth > 300 && screenWidth < 400) {
			setWidth(200);
		}
		if (screenWidth > 400 && screenWidth < 650) {
			setWidth(300);
		}
		if (screenWidth > 650 && screenWidth < 800) {
			setWidth(600);
		}
		if (screenWidth > 800) {
			setWidth(500);
		}
	}),
		[screenWidth, screenHeight];

	// preview
	const [preview, setPreview] = useState(null);

	// modal state
	const [modalOpen, setModalOpen] = useState(false);

	// ref to control input element
	const inputRef = useRef(null);

	// handle Click
	const handleInputClick = (e) => {
		e.preventDefault();
		inputRef.current.click();
	};
	// handle Change
	const handleImgChange = (e) => {
		setSrc(URL.createObjectURL(e.target.files[0]));
		setModalOpen(true);
	};
	console.log(width, height);

	return (
		<main className=" z-[1000] fixed top-0 left-0 w-full h-full flex justify-center bg-black bg-opacity-40   ">
			<div
				ref={parentDivRef}
				className={` ${
					!modalOpen && "justify-between"
				} flex items-center flex-col  bg-blue-600 h-[90vh] w-[90vw] lg:w-[80vw] shadow-lg rounded-lg mx-6 mt-6 relative`}
			>
				{/* top butons */}
				<div className="flex justify-between items-center  gap-4 pt-4 pb-3  px-4  flex-wrap">
					<label className="  cursor-pointer ">
						<input
							type="file"
							accept="image/*"
							ref={inputRef}
							onChange={handleImgChange}
							className=" hidden z-50"
						/>
						<h1 className=" border shadow-md hover:shadow-sm py-1 rounded-md px-3">
							<LuImagePlus />
						</h1>
					</label>
					<button
						onClick={() => setModalOpen(!modalOpen)}
						className=" border shadow-md hover:shadow-sm py-1 rounded-md px-3"
					>
						<MdPreview />
					</button>
					<button className=" border shadow-md hover:shadow-sm py-1 rounded-md px-3">
						<BiDownload />
					</button>
					<button className=" border shadow-md hover:shadow-sm py-1 rounded-md px-3">
						<FiUploadCloud />
					</button>
				</div>

				{/* display avatar */}
				<div
					ref={parentDivRef}
					className={`${
						modalOpen ? "" : "hidden"
					}   px-4  self-center my-auto  `}
				>
					<AvatarEditor
						ref={cropRef}
						image={src}
						disableBoundaryChecks={true}
						scale={slideValue / 10}
						rotate={0}
						disableHiDPIScaling={true}
						width={width}
						// height={height}
						border={50}
						color={[255, 255, 255, 0.6]} // RGBA
					/>

					{/* MUI Slider */}
				</div>
				<div>
					<input
						type="range"
						min={10}
						max={50}
						size="medium"
						defaultValue={slideValue}
						value={slideValue}
						onChange={(e) => setSlideValue(e.target.value)}
					/>
					<div>
						<button
							size="small"
							variant="outlined"
							onClick={(e) => setModalOpen(false)}
						>
							cancel
						</button>
						<button
							sx={{ background: "#5596e6" }}
							size="small"
							variant="contained"
							onClick={handleSave}
						>
							Save
						</button>
					</div>
				</div>
				<div
					className={`${
						modalOpen ? "hidden" : ""
					}   px-4  self-center my-auto  `}
				>
					<img
						src={
							preview ||
							" https://www.signivis.com/img/custom/avatars/member-avatar-01.png"
						}
						alt=""
						width="200"
						height="200"
					/>
				</div>
			</div>
		</main>
	);
};

export default Cropper;
