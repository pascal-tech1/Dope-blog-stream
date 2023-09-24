import React, { useState } from "react";

const UserPage = () => {
	const [isDropdownOpen , setIsDropdownOpen]= useState(false)
	const toggleDropdown = ()=>{
		setIsDropdownOpen(!isDropdownOpen)
	}
	return (
		<div class="relative inline-block text-left">
			<button
				onClick={toggleDropdown}
				class="bg-blue-500 text-white py-2 px-4 rounded inline-flex items-center"
			>
				Dropdown
				<svg
					class="w-4 h-4 ml-2"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 20 20"
					fill="currentColor"
				>
					<path
						fill-rule="evenodd"
						d="M10.293 5.293a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414-1.414l3-3a1 1 0 011.414 0z"
						clip-rule="evenodd"
					/>
				</svg>
			</button>
			<ul class={`${isDropdownOpen ? "" : 'hidden'} absolute left-0 mt-2 py-2 bg-white border border-gray-300 rounded-lg shadow-lg`}>
				<li>
					<a
						href="#"
						class="block px-4 py-2 text-gray-800 hover:bg-blue-500 hover:text-white"
					>
						Option 1
					</a>
				</li>
				<li>
					<a
						href="#"
						class="block px-4 py-2 text-gray-800 hover:bg-blue-500 hover:text-white"
					>
						Option 2
					</a>
				</li>
				<li>
					<a
						href="#"
						class="block px-4 py-2 text-gray-800 hover:bg-blue-500 hover:text-white"
					>
						Option 3
					</a>
				</li>
			</ul>
		</div>
	);
};

export default UserPage;
