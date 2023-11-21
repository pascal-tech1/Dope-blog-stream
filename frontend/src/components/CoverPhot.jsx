import React, { useState } from "react";
import { BiCamera } from "react-icons/bi";
import { uploadProfilePhoto } from "../redux/user/userSlice";
import Image from "../Adoh/image";

const CoverPhoto = ({ user }) => {
	const [image, setImage] = useState(null);
	const [fileName, setFileName] = useState("blogVanaImage");

	const handleFileChange = (e) => {
		e.preventDefault();
		let files;
		if (e.dataTransfer) {
			console.log("im here now");
			files = e.dataTransfer.files;
		} else if (e.target) {
			files = e.target.files;
			console.log(files[0].name);
			if (files[0].name) setFileName(files[0].name);
			else setFileName("blogVanaImage");
		}
		const reader = new FileReader();
		reader.onload = () => {
			setImage(reader.result);
		};
		reader.readAsDataURL(files[0]);
	};
	return (
		<div className=" w-full relative">
			{image && (
				<Image
					image={image}
					handleFileChange={handleFileChange}
					setImage={setImage}
					fileName={fileName}
					uploadAction={uploadProfilePhoto}
					whatUploading ={"coverPhoto"}
				/>
			)}
			<img
				src={user?.coverPhoto}
				alt=""
				className=" h-[25vw] min-[400px]:h-[20vw] md:h-[12vw] lg:h-[10vw]  w-full rounded-md  "
			/>
			<label className=" absolute bottom-0 right-0  text-center px-1 flex items-center justify-center bg-blue-200 drop-shadow-md hover:drop-shadow-sm hover:bg-blue-300 transition-all delay-75  h-8 w-8 rounded-full ">
				<input
					onChange={(e) => handleFileChange(e)}
					type="file"
					name="image"
					id="image"
					className="hidden z-50"
				/>

				<BiCamera className=" text-4xl fill-white -rotate-3" />
			</label>
		</div>
	);
};

export default CoverPhoto;
