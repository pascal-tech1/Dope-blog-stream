import React, { useState } from "react";
import Category from "./Category";

const CustomDropdown = ({ allCategory }) => {
	const [isOpen, setIsOpen] = useState(false);

	const toggleDropdown = () => {
		setIsOpen(!isOpen);
	};

	return (
		<div className="relative">
			<button
				onClick={toggleDropdown}
				className="bg-white border  rounded px-10 py-1 text-gray-700 focus:outline-none focus:border-gray-500"
			>
				More Category
			</button>

			{isOpen && (
				<div className="absolute mt-2 w-48 py-4 px-2 rounded border border-gray-300 bg-white shadow-lg">
					<Category allCategory={allCategory} />
				</div>
			)}
		</div>
	);
};

export default CustomDropdown;
