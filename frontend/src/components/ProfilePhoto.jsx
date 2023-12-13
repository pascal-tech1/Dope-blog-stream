import React, { useState } from "react";
import { BiCamera } from "react-icons/bi";
import { uploadProfilePhoto } from "../redux/user/userSlice";
import { CropImage, LazyLoadImg } from "../components";

const ProfilePhoto = ({ user }) => {
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
				<CropImage
					image={image}
					handleFileChange={handleFileChange}
					setImage={setImage}
					fileName={fileName}
					uploadAction={uploadProfilePhoto}
					whatUploading={"profilePhoto"}
				/>
			)}

			<div className=" absolute -top-16  w-28 h-28  md:w-32 md:h-32   rounded-full border border-blue-600">
				<LazyLoadImg
					backgroundClassName={" rounded-full  w-full h-full  relative"}
					imgClassName={
						"absolute inset-0 w-full h-full  object-cover rounded-full "
					}
					originalImgUrl={user?.profilePhoto}
					blurImageStr={user?.blurProfilePhoto}
					optimizationStr={"q_auto,f_auto,w_200"}
					paddingBottom={"100%"}
				/>
			</div>
			<label className=" absolute md:left-24 md:-bottom-12 -bottom-10 left-20   text-center px-1 flex items-center justify-center bg-blue-200 drop-shadow-md hover:drop-shadow-sm hover:bg-blue-300 transition-all delay-75  h-8 w-8 rounded-full ">
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

export default ProfilePhoto;
