const expressAsyncHandler = require("express-async-handler");
const Category = require("../../model/category/Category");
const validateMongoDbUserId = require("../../utils/validateMongoDbUserId");
// '''''''''''''''''''''''''''''''''''''''''
//   creating a category
// '''''''''''''''''''''''''''''''''''''''''''

const createCategoryCtrl = expressAsyncHandler(async (req, res) => {
	const { title } = req?.body;
	const categoryAlreadyExist = await Category.findOne({ title });

	if (categoryAlreadyExist) {
		throw new Error("Category Already exist");
	}
	const loginAdmin = req?.user;

	try {
		const category = await Category.create({
			user: loginAdmin?._id,
			title,
		});

		res.status(201).json(category);
	} catch (error) {
		res.json({ message: "faliled to create Category" });
	}
});

// '''''''''''''''''''''''''''''''''''''''''
//   fetch all categorys
// ''''''''''''''''''''''''''''''''''''''''''''
const fetchAllCategorysCtrl = expressAsyncHandler(async (req, res) => {
	try {
		const allCategory = await Category.find({}).select("title");
		res.status(200).json({ status: "success", allCategory });
	} catch (error) {
		res
			.status(500)
			.json({ message: "faliled to fetch All Category try again" });
	}
});
// '''''''''''''''''''''''''''''''''''''''''
//   fetch single category
// ''''''''''''''''''''''''''''''''''''''''''''
const fetchSingleCategorysCtrl = expressAsyncHandler(async (req, res) => {
	const { categoryId } = req?.params;
	validateMongoDbUserId(categoryId);
	try {
		const category = await Category.findById(categoryId);
		res.json(category);
	} catch (error) {
		res.json(error);
	}
});

// '''''''''''''''''''''''''''''''''''''''''
//   update category cocntroller
// ''''''''''''''''''''''''''''''''''''''''''''
const updateCategoryCtrl = expressAsyncHandler(async (req, res) => {
	const { categoryId } = req?.params;
	const { title } = req?.body;

	// // check if title exist
	const categoryAlreadyExist = await Category.findOne({ title });
	if (categoryAlreadyExist) {
		throw new Error("category already exist");
	}
	validateMongoDbUserId(categoryId);

	try {
		const category = await Category.findByIdAndUpdate(
			categoryId,
			{
				title,
			},
			{ new: true, runValidators: true }
		);

		res.json(category);
	} catch (error) {
		res.json(error);
	}
});

// '''''''''''''''''''''''''''''''''''''''''
//   delete category controller
// ''''''''''''''''''''''''''''''''''''''''''''
const deleteCategoryCtrl = expressAsyncHandler(async (req, res) => {
	const { categoryId } = req?.params;
	validateMongoDbUserId(categoryId);

	try {
		const category = await Category.findByIdAndDelete(categoryId, {
			new: true,
		});
		res.json(category);
	} catch (error) {
		res.json(error);
	}
});

module.exports = {
	createCategoryCtrl,
	fetchAllCategorysCtrl,
	fetchSingleCategorysCtrl,
	updateCategoryCtrl,
	deleteCategoryCtrl,
};
