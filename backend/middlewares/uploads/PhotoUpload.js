const multer = require("multer");
const sharp = require("sharp");
const path = require("path");

// temp storage
const multerStorage = multer.memoryStorage();

// file checking
const multerFliter = (req, file, cb) => {
	console.log(file, "im her filee")

	try {
		if (file.mimetype.startsWith("image")) {
		
			cb(null, true);
		} else {
			console.log('im here file upload',file)
			cb({ message: "unsupported file format" }, false);
		}
	} catch (error) {
		console.log(error)
	}
};

// profile photo upload MiddleWare
const profilePhotoUpload = multer({
	storage: multerStorage,
	fileFilter: multerFliter,
	limits: { fileSize: 1000000 },
});

// profile photo upload MiddleWare
const postImageUpload = multer({
	storage: multerStorage,
	fileFilter: multerFliter,
	limits: { fileSize: 10000000 },
});

// image resizing MiddleWare
const ProfilePhotResize = async (req, res, next) => {
	console.log(req.file, "photo resize")
	try {
		if (!req.file) throw new Error("no file to resize");

		req.file.fileName = `user-${Date.now()} - ${req.file.originalname}`;
		await sharp(req.file.buffer)
			.resize(300, 300)
			.toFormat("jpeg")
			.jpeg({ quality: 90 })
			.toFile(path.join(`public/images/profile/${req.file.fileName}`));

		next();
	} catch (error) {
		next(error);
	}
};
const postImageResize = async (req, res, next) => {
	try {
		const { file, url } = req;

		if (file) {
			const fileName = `user-${Date.now()} - ${file.originalname}`;
			await sharp(file.buffer)
				.resize(500, 500)
				.toFormat("jpeg")
				.jpeg({ quality: 90 })
				.toFile(path.join(`public/images/posts/${fileName}`));
			console.log(fileName);
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
