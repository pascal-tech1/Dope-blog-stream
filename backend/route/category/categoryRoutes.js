const express = require("express");
const {
	createCategoryCtrl,
	fetchAllCategorysCtrl,
	fetchSingleCategorysCtrl,
	updateCategoryCtrl,
	deleteCategoryCtrl,
} = require("../../controllers/category/categoryCtrl");
const authMiddleWare = require("../../middlewares/authentication/authMiddleWare");

const categoryRoutes = express.Router();
categoryRoutes.get("/", fetchAllCategorysCtrl);
categoryRoutes.post("/", authMiddleWare, createCategoryCtrl);

categoryRoutes.get(
	"/:categoryId",
	authMiddleWare,
	fetchSingleCategorysCtrl
);
categoryRoutes.put("/:categoryId", authMiddleWare, updateCategoryCtrl);
categoryRoutes.delete("/:categoryId", authMiddleWare, deleteCategoryCtrl);
module.exports = categoryRoutes;
