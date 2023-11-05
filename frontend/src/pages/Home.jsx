import React, {  useEffect} from "react";
import {
	Category,
	CustomDropdown,
	NavBar,
	UserToFollow,
} from "../components";
import { MdOutlineCalendarMonth } from "react-icons/md";
import AllPost from "./AllPost";
import { useDispatch, useSelector } from "react-redux";
import { fetchRandomUser } from "../redux/user/userSlice";
import { fetchAllCategorys } from "../redux/category/categorySlice";
import { toggleDisplayedCategory } from "../redux/post/allPostSlice";

const Home = () => {
	const dispatch = useDispatch();

	const { allCategory } = useSelector((store) => store.categorySlice);
	const { randomUsers } = useSelector((store) => store.userSlice);
	const { displayedCategory, activeCategory } = useSelector(
		(store) => store.allPostSlice
	);

	let allCategoryLeft = allCategory.filter(
		(category) => !displayedCategory.includes(category.title)
	);
	allCategoryLeft = allCategoryLeft.map((category) => category.title);

	useEffect(() => {
		dispatch(fetchRandomUser(3));
		dispatch(fetchAllCategorys());
	}, []);

	useEffect(() => {
		allCategoryLeft = allCategory.filter(
			(category) => !displayedCategory.includes(category.title)
		);
		allCategoryLeft = allCategoryLeft.map((category) => category.title);
		if (!displayedCategory.includes(activeCategory))
			dispatch(toggleDisplayedCategory(activeCategory));
	}, [displayedCategory, activeCategory]);

	const theme = "dark";

	return (
		<div className={`bg-${theme}-background font-inter font-lights `}>
			<NavBar />

			<div className=" md:grid grid-cols-3 mt-7 md:mt-16 text-sm   ">
				{/* right section */}
				<main className=" col-span-2  px-6 py-6  lg:px-20  ">
					<div className="">
						<div className="flex flex-wrap  items-center justify-center">
							<Category
								allCategory={displayedCategory}
								initialActive={"All"}
							/>
							<div className="mt-2 ml-6 md:hidden">
								<CustomDropdown allCategory={allCategoryLeft} />
							</div>
						</div>

						<AllPost />
					</div>
				</main>
				{/* left section */}
				<main className=" grid-cols-2 col-span-1 hidden md:grid h-max ">
					<div className=" fixed">
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
								<h2 className=" whitespace-nowrap text-center text-sm font-medium my-4 place-self-center">
									People you might be interested in
								</h2>

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
								<Category allCategory={allCategoryLeft} />
							</section>
						</div>
					</div>
				</main>
			</div>
		</div>
	);
};

export default Home;
