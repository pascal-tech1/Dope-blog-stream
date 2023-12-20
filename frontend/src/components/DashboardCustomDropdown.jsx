import React, { useEffect, useRef, useState } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { useDispatch } from "react-redux";
import { useClickOutside } from "../customHooks";

const DashboardCustomDropdown = ({
	allFilters,
	selectedFilter,
	dropdownWidth,
	left,
	handleSelected,
	setSelectedFilter,
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const dispatch = useDispatch();

	// using custom hook to close the open UserDashboardMenu
	const divRef = useRef();
	const iconRef = useRef();
	const isOutsideClicked = useClickOutside(divRef, iconRef);

	useEffect(() => {
		isOpen && !isOutsideClicked && setIsOpen(false);
	}, [isOutsideClicked]);

	const toggleDropdown = () => {
		setIsOpen(!isOpen);
	};

	const handleSelectedFilter = (filter) => {
		dispatch(setSelectedFilter(filter));
	};

	handleSelected = handleSelected ? handleSelected : handleSelectedFilter;

	return (
		<div className="relative z-[50] flex flex-col font-inter ">
			<button
				ref={iconRef}
				type="button"
				onClick={toggleDropdown}
				className="bg-white dark:bg-[#1C1C1C] text-sm  dark:text-slate-200 border dark:border-gray-700 justify-center py-[0.3rem] md:text-sm outline-none focus:border-gray-400 capitalize whitespace-nowrap  px-2 flex font-inter  items-center  rounded-md text-gray-700 focus:outline-none "
			>
				{selectedFilter}
				{isOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}
			</button>

			{isOpen && (
				<div
					ref={divRef}
					className={`${left ? left : "-left-12"} ${
						dropdownWidth ? dropdownWidth : " w-[80vw]"
					}  absolute flex top-10 self-center md:text-sm gap-1 flex-wrap max-h-[50vh] z-50 overflow-y-auto custom-scrollbar justify-evenly  px-2  items-center  rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1C1C1C] shadow-lg`}
				>
					{allFilters.map((filter, index) => (
						<button
							key={index}
							type="button"
							className={`${
								selectedFilter === filter && " border-b border-b-blue-600"
							} bg-gray-100 dark:bg-[#1C1C1C] hover:bg-gray-200 dark:hover:bg-gray-800 transition-all delay-75 rounded-md md:text-sm px-2 py-[0.12rem] my-1 `}
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
