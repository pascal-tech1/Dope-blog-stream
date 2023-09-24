import React, { useEffect } from "react";
import { NavBar } from "../components";
import { articles } from "../utils/data";
import { MdOutlineCalendarMonth } from "react-icons/md";

import { Link } from "react-router-dom";
import AllPost from "./AllPost";

const Home = () => {
	const theme = "dark";
	const category = ["design", "developtment", "ux", "marketing"];

	return (
		<div className={`bg-${theme}-background font-inter font-lights `}>
			<NavBar />

			<div className=" md:grid grid-cols-3 mt-[2rem] ">
				{/* right section */}
				<main className=" col-span-2 md:border-r-2 px-6 py-6  lg:px-20 ">
					<div className="">
						<div className="flex justify-between py-6 flex-wrap">
							{category.map((category, index) => {
								return (
									<button key={index} className=" text-sm delay-75 mt-2 mx-2 flex f bg-gray-100 hover:bg-gray-200 rounded-xl  py-[0.35rem] px-4">
										{category}
									</button>
								);
							})}
						</div>
						<div className="flex justify-between flex-wrap items-center mb-5 ">
							<h2 className=" font-medium text-gray-500  text">
								Articles
							</h2>
							<select
								className=" text-sm border rounded-lg py-[0.3rem] px-2 focus:outline-none  cursor-pointer"
								name="sort"
								id=""
							>
								<option value="Popular">Most Popular</option>
								<option value="Highest-Read">Highest Read</option>
							</select>
						</div>

						<AllPost/>
					</div>
				</main>
				{/* left section */}
				<main className=" grid-cols-2 col-span-1 py-6 hidden md:grid">
					<div className=" fixed">
						<div className=" m-4 mr-14">
							<div className="flex gap-2  bg-gray-100 p-4 h-max place-self-center">
								<div>
									<h3 className=" font-medium text-sm ">
										Get unlimited access to everything on Reader
									</h3>
									<h4 className=" text-gray-400 text-xs mt-2 mb-4">
										plans starting at $/week
									</h4>
									<button className= " whitespace-nowrap flex bg-gray-200 py-1 px-2 rounded-lg">
										Get unlimeted access
									</button>
								</div>
								<MdOutlineCalendarMonth className=" hidden lg:flex text-8xl font-normal  text-gray-400 " />
							</div>
							{/* followers section */}
							<section className="">
								<h2 className= " whitespace-nowrap text-center text-sm font-medium my-4 place-self-center">
									People you might be interested in
								</h2>

								{articles.slice(0, 3).map((article, index) => {
									return (
										<div key={index} className="flex  gap-3 lg:mx-6 my-5">
											<div>
												{" "}
												<img
													className=" w-8 h-8 rounded-full"
													src={article?.imageUrl}
													alt=""
												/>
											</div>
											<div>
												<h3 className=" text-xs text-gray-900">
													{article?.user?.name}
												</h3>
												<h3 className=" text-xs text-gray-4s00">
													{article?.user?.profession}
												</h3>
											</div>
											<div>
												<button className="  ml-6 flex hover:border-gray-300 place-items-center  border border-blue-200 px-1 py-[0.1.5rem] md:px-2 rounded-lg hover:bg-gray-100 delay-200s">
													follow
												</button>
											</div>
										</div>
									);
								})}
								{/* more interesting topic */}
							</section>
							<section className="flex justify-center flex-col py-3">
								<h2 className=" text-gray-900 font-medium mb-4 text-center">
									More interesting topics
								</h2>
								<div className=" flex justify-between gap-4 flex-wrap">
									{articles.map((article,index) => {
										return (
											<button key={index} className=" text-sm border border-blue-300 hover:border-gray-300 hover:bg-gray-300 rounded-xl px-3 py-[0.15rem] ">
												{article.category}
											</button>
										);
									})}
								</div>
							</section>
						</div>
					</div>
				</main>
			</div>
		</div>
	);
};

export default Home;
