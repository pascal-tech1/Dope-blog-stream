import { useState } from "react";
import { useDarkMode } from "../customHooks";
import DashboardCustomDropdown from "./DashboardCustomDropdown";

const Theme = () => {
	const isSystemInDakMode = useDarkMode();
	const defaultTheme = localStorage.getItem("theme")
		? localStorage.getItem("theme")
		: "system";

	const [theme, setTheme] = useState(defaultTheme);

	const filters = ["light", "dark", "system"];
	const handleSelected = (event) => {
		setTheme(event);
		if (event !== "system") {
			localStorage.theme = event;
			document.documentElement.classList.toggle("dark", event === "dark");
		} else {
			localStorage.removeItem("theme");
			if (isSystemInDakMode) {
				document.documentElement.classList.add("dark");
			} else {
				document.documentElement.classList.remove("dark");
			}
		}
	};
	return (
		<DashboardCustomDropdown
			allFilters={filters}
			handleSelected={handleSelected}
			selectedFilter={theme}
			dropdownWidth={"max-w-[6rem]"}
		/>
		// <div className="flex flex-col items-start">
		// 	{/* Your component content */}

		// 	{/* Theme toggle buttons */}
		// 	<button onClick={() => setTheme("light")} className="">Light</button>
		// 	<button onClick={() => setTheme("dark")}>Dark</button>
		// 	<button
		// 		onClick={() => {
		// 			localStorage.removeItem("theme");
		// 			if (isSystemInDakMode) {
		// 				document.documentElement.classList.add("dark");
		// 			} else {
		// 				document.documentElement.classList.remove("dark");
		// 			}
		// 		}}
		// 	>
		// 		System
		// 	</button>
		// </div>
	);
};

export default Theme;
