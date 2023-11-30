import React, { useState } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { useDispatch } from "react-redux";

const DashboardCustomDropdown = ({
	allFilters,
	selectedFilter,
	dropdownWidth,
	handleSelected,
	setSelectedFilter,
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const dispatch = useDispatch();

	const toggleDropdown = () => {
		setIsOpen(!isOpen);
	};

	const handleSelectedFilter = (filter) => {
		dispatch(setSelectedFilter(filter));
	};

	handleSelected = handleSelected ? handleSelected : handleSelectedFilter;
	const handleDropDownClose = (e) => {
		if (e.target !== e.currentTarget && isOpen) {
			setIsOpen(false);
		}
	};

	return (
		<div
			onClick={(e) => handleDropDownClose(e)}
			className="relative z-[100] flex flex-col"
		>
			<button
				type="button"
				onClick={toggleDropdown}
				className="bg-white border capitalize whitespace-nowrap justify-center px-2 flex font-inter  items-center  rounded  py-1 text-gray-700 focus:outline-none focus:border-gray-500"
			>
				{selectedFilter}
				{isOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}
			</button>

			{isOpen && (
				<div
					className={`absolute flex top-10  py-2 self-center text-sm gap-1 flex-wrap ${
						dropdownWidth ? "" : "w-[60vw]"
					} max-w-[16rem]  items-center justify-center rounded border border-gray-300 bg-white shadow-lg`}
				>
					{allFilters.map((filter) => (
						<button
							type="button"
							className=" bg-gray-100 hover:bg-gray-200 transition-all delay-75 rounded-full px-2 py-1 my-1 "
							onClick={() => {
								handleSelected(filter);
							}}
						>
							{filter.charAt(0).toUpperCase() +
								filter.slice(1).toLowerCase()}
						</button>
					))}
				</div>
			)}
		</div>
	);
};

export default DashboardCustomDropdown;
