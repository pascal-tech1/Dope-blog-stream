const multer = require("multer");
const sharp = require("sharp");
const path = require("path");

// temp storage
const multerStorage = multer.memoryStorage();

// file checking
const multerFliter = (req, file, cb) => {
	if (file.mimetype.startsWith("image")) {
		cb(null, true);
	} else {
		cb({ message: "unsupported file format" }, false);
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
	console.log("photoresize");
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
		if (!req.file) throw new Error("no file to resize");
		req.file.fileName = `user-${Date.now()} - ${req?.file?.originalname}`;
		await sharp(req?.file?.buffer)
			.resize(500, 500)
			.toFormat("jpeg")
			.jpeg({ quality: 90 })
			.toFile(path.join(`public/images/posts/${req?.file?.fileName}`));

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
