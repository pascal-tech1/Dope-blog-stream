import React, { useState } from "react";
import Category from "./Category";

import { IoIosArrowDropdown, IoIosArrowDropup } from "react-icons/io";

const CustomDropdown = ({ allCategory }) => {
	const [isOpen, setIsOpen] = useState(false);

	const toggleDropdown = () => {
		setIsOpen(!isOpen);
	};

	return (
		<div className="relative">
			<button
				onClick={toggleDropdown}
				className="bg-white border px-2 flex gap-1 items-center  rounded  py-1 text-gray-700 focus:outline-none focus:border-gray-500"
			>
				More Category{" "}
				{isOpen ? <IoIosArrowDropup /> : <IoIosArrowDropdown />}
			</button>

			{isOpen && (
				<div className="absolute mt-2 py-2 -left-[50%] -right-[50%] items-center justify-center flex rounded border border-gray-300 bg-white shadow-lg">
					<Category
						className={
							" flex justify-between gap-1 items-center flex-wrap"
						}
						allCategory={allCategory}
					/>
				</div>
			)}
		</div>
	);
};

export default CustomDropdown;
