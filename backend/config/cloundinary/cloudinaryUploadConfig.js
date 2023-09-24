const cloudinary = require("cloudinary").v2;

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

const handleCloudinaryUpload = async (file, folderName) => {
	
	try {
		const options = {
			resource_type: "auto",
			folder: folderName,
		};

		const data = await cloudinary.uploader.upload(file, options);
		console.log("im cloudinary");
		return { url: data?.secure_url };
	} catch (error) {
		console.log(error)
		throw new Error("image upload to database failed");
	}
};

module.exports = handleCloudinaryUpload;
