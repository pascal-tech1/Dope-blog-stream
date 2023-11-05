import React, { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
	fetchPostByCategory,
	setActiveCategory,
	setFetchFirstCategory,
} from "../redux/post/allPostSlice";

const Category = ({ allCategory, className }) => {
	const { activeCategory } = useSelector((store) => store.allPostSlice);
	const dispatch = useDispatch();
	className = className || " flex justify-between gap-2 flex-wrap ";
	return (
		<div className={className}>
			{allCategory?.map((category, index) => {
				return (
					<button
						key={index}
						onClick={(e) => {
							dispatch(setActiveCategory(category));
							dispatch(setFetchFirstCategory(category));
							dispatch(fetchPostByCategory());
						}}
						className={`whitespace-nowrap gap-2 mt-1 text-sm delay-75 cursor-pointer flex bg-gray-200 hover:bg-gray-300 rounded-xl py-[0.2rem] px-4 ${
							activeCategory === category &&
							" bg-gray-400 hover:bg-gray-400"
						}`}
					>
						{category.charAt(0).toUpperCase() +
							category.slice(1).toLowerCase()}
					</button>
				);
			})}
		</div>
	);
};

export default Category;
