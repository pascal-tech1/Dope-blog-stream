import React, { useEffect } from "react";
import { Category, NavBar, UserToFollow } from "../components";
import { MdOutlineCalendarMonth } from "react-icons/md";
import AllPost from "./AllPost";
import { useDispatch, useSelector } from "react-redux";
import { fetchRandomUser } from "../redux/user/userSlice";
import { fetchAllCategorys } from "../redux/category/categorySlice";
import {
	fetchPostByCategory,
	setActiveCategory,
	setFetchFirstCategory,
} from "../redux/post/allPostSlice";
import DashboardCustomDropdown from "../components/DashboardCustomDropdown";
import { useNavigate } from "react-router-dom";

const Home = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const { allCategory } = useSelector((store) => store.categorySlice);
	const { randomUsers } = useSelector((store) => store.userSlice);
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
		dispatch(fetchRandomUser(4));
		dispatch(fetchAllCategorys());
	}, []);

	const handleSelected = (filter) => {
		console.log(filter)
		dispatch(setActiveCategory(filter));
		dispatch(setFetchFirstCategory(filter));
		dispatch(fetchPostByCategory());
		navigate("/");
	};

	const theme = "dark";

	return (
		<div className={`bg-${theme}-background font-inter mt-2 `}>
			<div className=" md:grid grid-cols-5 ">
				{/* right section */}
				<main className=" col-span-3 pr-2 lg:pr-4 md:border-r md:dark:border-r-[#171717] ">
					<div className="">
						<div className="flex flex-wrap  justify-center dark:bg-[#171717]  gap-4 categorySticky  shadow-sm">
							<div className=" hidden md:flex ">
								<Category
									allCategory={displayedCategoryArray}
									handleSelected={handleSelected}
									isActive={activeCategory}
								/>
							</div>
							<div className=" md:hidden">
								<DashboardCustomDropdown
									allFilters={allCategoryArray}
									selectedFilter={activeCategory}
									handleSelected={handleSelected}
								/>
							</div>
						</div>

						<AllPost />
					</div>
				</main>
				{/* left section */}

				<div className="hidden md:flex flex-col col-start-4 col-span-full  stickyRight custom-scrollbar mb-6 pl-4 pr-8  pt-2 ">
					<div className="flex gap-2  bg-gray-100 justify-between py-2 text-sm px-2 rounded-lg dark:bg-[#171717] dark:text-slate-300  ">
						<div className="flex flex-col justify-center items-center text-center gap-2">
							<h3 className=" font-medium hidden lg:flex ">
								Get unlimited access to everything on BlogVana
							</h3>

							<h1 className="  bg-blue-300 text-white py-1 px-2 rounded-lg dark:bg-[#1C1C1C] ">
								Premium comming soon
							</h1>
						</div>
						<img
							src="../../public/blogvana.png"
							alt=""
							className=" w-20 border border-blue-400 self-center mr-4"
						/>
					</div>
					{/* followers section */}
					<section className="">
						<h2 className="  text-center font-medium my-4 place-self-center dark:text-slate-200">
							People you might be interested in
						</h2>
						{/* renders random users */}
						{randomUsers?.map((user, index) => {
							return (
								<UserToFollow key={index} user={user} index={index} />
							);
						})}
						{/* more interesting topic */}
					</section>
					<section className="flex justify-center flex-col">
						<h2 className=" dark:text-slate-300 font-medium mb-4 text-center">
							More interesting topics
						</h2>
						<Category
							allCategory={allCategoryArray}
							handleSelected={handleSelected}
						/>
					</section>
				</div>
			</div>
		</div>
	);
};

export default Home;
