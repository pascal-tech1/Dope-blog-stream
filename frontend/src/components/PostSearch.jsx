import React, { useEffect } from "react";
import { useSearchWithDebounce } from "../customHooks/SearchWithDebounce";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchAllCategorys } from "../redux/category/categorySlice";
import {
	fetchPostByCategory,
	setFetchFirstCategory,
} from "../redux/post/allPostSlice";
import Category from "./Category";
import DashboardCustomDropdown from "./DashboardCustomDropdown";

const PostSearch = ({}) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const { allCategory } = useSelector((store) => store.categorySlice);

	const { activeCategory } = useSelector((store) => store.allPostSlice);

	let allCategoryArray = allCategory.map((category) => category.title);
	allCategoryArray = ["all", ...allCategoryArray];

	const displayedCategoryArray = [
		activeCategory,
		...allCategoryArray
			.filter((category) => category != activeCategory)
			.slice(0, 5),
	];

	useEffect(() => {
		allCategory.length === 0 && dispatch(fetchAllCategorys());
	}, []);

	const handleSelected = (filter) => {
		
		dispatch(setFetchFirstCategory(filter));
		dispatch(fetchPostByCategory());
		navigate("/");
	};

	const { searchTerm, handleInputChange } = useSearchWithDebounce();

	return (
		<div className="  dark:bg-dark   gap-4 categorySticky ">
			<div className=" hidden md:flex justify-center">
				<Category
					allCategory={displayedCategoryArray}
					handleSelected={handleSelected}
					isActive={activeCategory}
				/>
			</div>
			<div className="  md:hidden flex justify-between gap-4 mx-3">
				<DashboardCustomDropdown
					allFilters={allCategoryArray}
					selectedFilter={activeCategory}
					handleSelected={handleSelected}
					left={"-left-4"}
					dropdownWidth={"w-[60vw]"}
				/>
				<form className="relative z-50   w-[50vw]">
					<input
						className={` text-xs  px-1 font-sm rounded-lg bg-gray-100 border dark:border-gray-800 focus:border-b-gray-300 dark:bg-lightdark py-2  text-center focus:outline-none w-full  dark:focus:border-b-gray-600`}
						type="text"
						id="searchInput"
						placeholder="Search"
						value={searchTerm}
						onChange={handleInputChange}
						onClick={(e) => {
							e.preventDefault();
						}}
					/>
				</form>
			</div>
		</div>
	);
};

export default PostSearch;
