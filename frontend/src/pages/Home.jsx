import React, { useEffect } from "react";
import { Category, PostSearch, UserToFollow } from "../components";
import AllPost from "./AllPost";
import { useDispatch, useSelector } from "react-redux";
import { fetchRandomUser } from "../redux/user/userSlice";

import {
	fetchPostByCategory,
	setActiveCategory,
	setFetchFirstCategory,
} from "../redux/post/allPostSlice";

import { useNavigate } from "react-router-dom";

const Home = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const { allCategory } = useSelector((store) => store.categorySlice);
	const { randomUsers } = useSelector((store) => store.userSlice);

	let allCategoryArray = allCategory.map((category) => category.title);
	allCategoryArray = ["all", ...allCategoryArray];

	useEffect(() => {
		dispatch(fetchRandomUser(4));
	}, []);

	const handleSelected = (filter) => {
		dispatch(setActiveCategory(filter));
		dispatch(setFetchFirstCategory(filter));
		dispatch(fetchPostByCategory());
		navigate("/");
	};
	return (
		<div className={`font-inter mt-2 text-lg lg:text-base `}>
			<div className=" md:grid grid-cols-5 ">
				{/* right section */}
				<main className=" col-span-3 md:border-r md:dark:border-r-[#171717] ">
					<div className="">
						<PostSearch  />

						<AllPost  />
					</div>
				</main>
				{/* left section */}

				<div className="hidden md:flex flex-col col-start-4 col-span-full  stickyRight custom-scrollbar mb-6 px-4 dark:bg-[#171717] pt-2 ">
					<div className="flex gap-2  bg-gray-100 justify-between py-2  text-lg  md:text-sm px-2 rounded-lg dark:bg-[#171717] dark:text-slate-300  ">
						<div className="flex flex-col justify-center items-center text-center gap-2">
							<h3 className=" font-medium hidden lg:flex ">
								Get unlimited access to everything on BlogVana
							</h3>

							<h1 className="  bg-blue-300 text-white py-1 px-2 rounded-lg dark:bg-[#1C1C1C] ">
								Premium comming soon
							</h1>
						</div>
						<img
							src="/blogvana.png"
							alt=""
							className=" w-20 border border-blue-400 self-center mr-4"
						/>
					</div>
					{/* followers section */}
					<section className="">
						<h2 className="  text-center font-medium my-3 place-self-center dark:text-slate-200">
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
