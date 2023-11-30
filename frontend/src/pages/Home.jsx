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
			.slice(0, 3),
	];

	useEffect(() => {
		dispatch(fetchRandomUser(4));
		dispatch(fetchAllCategorys());
	}, []);

	const handleSelected = (filter) => {
		dispatch(setActiveCategory(filter));
		dispatch(setFetchFirstCategory(filter));
		dispatch(fetchPostByCategory());
		navigate("/");
	};

	const theme = "dark";

	return (
		<div className={`bg-${theme}-background font-inter font-lights `}>
			<NavBar />

			<div className=" md:grid grid-cols-5 mt-7 md:mt-16   ">
				{/* right section */}
				<main className=" col-span-3  px-4 py-6  ">
					<div className="">
						<div className="flex flex-wrap  items-center justify-center">
							<div className="mt-2 ml-6">
								<div className=" hidden md:flex">
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
						</div>

						<AllPost />
					</div>
				</main>
				{/* left section */}
				<main className=" grid-cols-3 col-span-2 hidden md:grid px-3 ">
					<div className=" fixed h-[85vh] overflow-y-auto custom-scrollbar mb-11">
						<div className=" m-4 mr-14 px-2 h-screen border-l">
							<div className="flex gap-2  bg-gray-100 p-4 h-max place-self-center">
								<div>
									<h3 className=" font-medium text-sm ">
										Get unlimited access to everything on BlogVana
									</h3>
									<h4 className=" text-gray-400 text-xs mt-2 mb-4">
										plans starting at $/week
									</h4>
									<button className=" whitespace-nowrap flex bg-gray-200 py-1 px-2 rounded-lg">
										Get unlimeted access
									</button>
								</div>
								<MdOutlineCalendarMonth className=" hidden lg:flex text-8xl font-normal  text-gray-400 " />
							</div>
							{/* followers section */}
							<section className="">
								<h2 className=" whitespace-nowrap text-center font-medium my-4 place-self-center">
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
							<section className="flex justify-center flex-col py-3">
								<h2 className=" text-gray-900 font-medium mb-4 text-center">
									More interesting topics
								</h2>
								<Category
									allCategory={allCategoryArray}
									handleSelected={handleSelected}
								/>
							</section>
						</div>
					</div>
				</main>
			</div>
		</div>
	);
};

export default Home;
