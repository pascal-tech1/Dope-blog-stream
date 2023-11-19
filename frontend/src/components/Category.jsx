import React from "react";

const Category = ({ allCategory, className, handleSelected,isActive }) => {
	className = className || " flex justify-between gap-2 flex-wrap ";
	

	return (
		<div className={className}>
			{allCategory?.map((category, index) => {
				return (
					<button
						key={index}
						onClick={() => {
							handleSelected(category);
						}}
						className={`${isActive === category && "bg-gray-400"} whitespace-nowrap gap-2 mt-1 text-sm delay-75 cursor-pointer flex bg-gray-200 hover:bg-gray-300 rounded-xl py-[0.2rem] px-4 }`}
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
