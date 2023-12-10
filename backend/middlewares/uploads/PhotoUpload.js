const multer = require("multer");
const sharp = require("sharp");
const path = require("path");

// temp storage
const multerStorage = multer.memoryStorage();

// file checking
const multerFliter = (req, file, cb) => {
	console.log('im here multer')
	console.log("multer", file);
	try {
		if (file.mimetype.startsWith("image")) {
			cb(null, true);
		} else {
			cb({ message: "unsupported file format" }, false);
		}
	} catch (error) {}
};

// profile photo upload MiddleWare
const profilePhotoUpload = multer({
	storage: multerStorage,
	fileFilter: multerFliter,
	limits: { fileSize: 10000000 },
});

// profile photo upload MiddleWare
const postImageUpload = multer({
	storage: multerStorage,
	fileFilter: multerFliter,
	limits: { fileSize: 10000000 },
});

// image resizing MiddleWare
const ProfilePhotResize = async (req, res, next) => {
	console.log("phot resize", req.file);
	try {
		if (!req.file) throw new Error("no file to resize");

		if (req.file) {
			const outputBuffer = await sharp(req.file.buffer)
				.resize(20, 20)
				.toFormat("jpeg", { quality: 20 })
				.toBuffer();

			// Convert the buffer to a base64-encoded string
			const base64String = outputBuffer.toString("base64");
			req.blurProfilePhoto = base64String;
		}

		req.file.fileName = `user-${Date.now()} - ${req.file.originalname}`;
		await sharp(req.file.buffer)
			.jpeg({ quality: 90 })
			.toFile(path.join(`public/images/profile/${req.file.fileName}`));
		next();
	} catch (error) {
		console.log("erro", error);
		next(error);
	}
};
const postImageResize = async (req, res, next) => {
	console.log("posttttttttttt", req.file);
	try {
		const { file, url } = req;
		if (file) {
			const outputBuffer = await sharp(file.buffer)
				.resize(40, 40)
				.toFormat("jpeg", { quality: 50 })
				.toBuffer();

			// Convert the buffer to a base64-encoded string
			const base64String = outputBuffer.toString("base64");
			req.blurImageUrl = base64String;
		}

		if (file) {
			const fileName = `user-${Date.now()} - ${file.originalname}`;
			await sharp(file.buffer)
				.toFormat("jpeg")
				.toFile(path.join(`public/images/posts/${fileName}`));

			req.file.fileName = fileName;
		} else if (url && url.startsWith("/update")) {
			// Handle the case where no file is provided but the URL starts with "/update".
			next();
			return;
		} else {
			const error = new Error("No file provided for resizing");
			error.status = 400; // Bad Request
			throw error;
		}

		next();
	} catch (error) {
		next(error);
	}
};

module.exports = {
	profilePhotoUpload,
	ProfilePhotResize,
	postImageResize,
	postImageUpload,
};
