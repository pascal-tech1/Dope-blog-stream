import React, { useState } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { useDispatch } from "react-redux";

const DashboardCustomDropdown = ({
	allFilters,
	setSelectedFilter,
	selectedFilter,
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const dispatch = useDispatch();

	const toggleDropdown = () => {
		setIsOpen(!isOpen);
	};
	const handleSelected = (filter) => {
		dispatch(setSelectedFilter(filter));
	};

	const handleDropDownClose = (e) => {
		if (e.target !== e.currentTarget && isOpen) {
			console.log("im here to close");
			setIsOpen(false);
		}
	};

	return (
		<div onClick={(e) => handleDropDownClose(e)} className="relative">
			<button
				onClick={toggleDropdown}
				className="bg-white border justify-center px-2 flex gap-1 items-center  rounded  py-1 text-gray-700 focus:outline-none focus:border-gray-500"
			>
				{selectedFilter}
				{isOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}
			</button>

			{isOpen && (
				<div className="absolute mt-2 py-2 left-[-0.5rem] px-2 w-[10rem] flex-wrap  items-center justify-center flex rounded border border-gray-300 bg-white shadow-lg">
					{allFilters.map((filter) => (
						<button
							className=" bg-gray-100 hover:bg-gray-200 transition-all delay-75 rounded-full px-2 py-1 my-1 "
							onClick={() => handleSelected(filter)}
						>
							{filter}
						</button>
					))}
				</div>
			)}
		</div>
	);
};

export default DashboardCustomDropdown;
