import React, { useState } from "react";
import { BiCamera } from "react-icons/bi";
import { uploadProfilePhoto } from "../redux/user/userSlice";
import { CropImage, LazyLoadImg, Spinner } from "../components";
import { useSelector } from "react-redux";

const ProfilePhoto = ({ user }) => {
	const [image, setImage] = useState(null);
	const [fileName, setFileName] = useState("blogVanaImage");
	const { profilePictureUploadStatus, whatUploading } = useSelector(
		(store) => store.userSlice
	);
	const handleFileChange = (e) => {
		e.preventDefault();
		let files;
		if (e.dataTransfer) {
			files = e.dataTransfer.files;
		} else if (e.target) {
			files = e.target.files;

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

			<div className=" font-inter absolute -mt-[10%] h-[18vw] w-[18vw] md:h-[12vw] md:w-[12vw] lg:h-[10vw] lg:w-[10vw]   rounded-full border border-blue-600">
				<LazyLoadImg
					backgroundClassName={"  rounded-full  w-full h-full  relative"}
					imgClassName={
						"absolute inset-0 w-full h-full  object-cover rounded-full "
					}
					originalImgUrl={user?.profilePhoto}
					blurImageStr={user?.blurProfilePhoto}
					optimizationStr={"q_auto,f_auto,w_200"}
					paddingBottom={"100%"}
				/>
			</div>
			<label className=" absolute cursor-pointer  text-center px-1 flex items-center justify-center bg-blue-200 drop-shadow-md hover:drop-shadow-sm hover:bg-blue-300 transition-all delay-75  h-8 w-8 rounded-full ">
				<input
					onChange={(e) => handleFileChange(e)}
					type="file"
					name="image"
					accept="image/*"
					id="image"
					className="hidden z-50"
				/>

				{profilePictureUploadStatus === "loading" &&
				whatUploading === "coverPhoto" ? (
					<div className=" self-center w-[2.1rem] h-[2.1rem] ml-2 mt-1">
						<Spinner />
					</div>
				) : (
					<BiCamera className=" text-4xl fill-white -rotate-3" />
				)}
			</label>
		</div>
	);
};

export default ProfilePhoto;
