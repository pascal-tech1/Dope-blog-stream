import React from "react";
import { NavBar } from "../components";
import { articles } from "../utils/data";
import { MdOutlineCalendarMonth } from "react-icons/md";

const Home = () => {

	const theme = 'dark'
	const category = ["design", "developtment", "ux", "marketing"];
	return (
		<div className={`bg-${theme}-background font-helvetic `}>
			<NavBar />

			<div className=" md:grid grid-cols-3 mt-[4rem] mx-10 ">
				<main className=" col-span-2 md:border-r-2 px-6 py-6 ">
					<div className="">
						<div className="flex justify-between py-6 flex-wrap">
							<input
								className=" font-sm py-1 border rounded-xl border-blue-200 text-center focus:outline-none focus:border-blue-400 delay-75  justify-center items-center"
								type="search"
								name="search"
								id="seearch"
								placeholder="Search"
							/>
							{category.map((category) => {
								return (
									<button className=" text-sm delay-75 mt-2 mx-2 flex f bg-gray-100 hover:bg-gray-200 rounded-xl  py-[0.35rem] px-4">
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
						{articles.slice(0,2).map((article) => {
							return (
								<div className=" border-t my-5">
									<div className="flex flex-row mt-3 mb-2 justify-self-center items-center">
										<img
											className=" w-8 h-8 rounded-full"
											src={article.imageUrl}
											alt=""
										/>
										<div className="flex flex-col text-xs text-gray-400 ml-2">
											<div className="flex">
												<h3>{article.user.name}</h3>
												<h3 className="">{article.date}</h3>
											</div>
											<h3>{article.user.profession}</h3>
										</div>
									</div>
									<div className="flex  flex-col md:flex-row justify-centers items-center gap-8">
										<div className="">
											<h3 className=" font-semibold text-lg ">
												{article.title}
											</h3>
											<div className=" text-xs">
												{article.content.substring(1, 230)}
												<button className="text-blue-300 hover:text-blue-400 delay-100 cursor-pointer mx-1">
													Read more
												</button>
											</div>
										</div>
										<img
											className=" max-w-xs w-52"
											src={article.imageUrl}
											alt=""
										/>
									</div>
								</div>
							);
						})}
					</div>
				</main>
				<main className=" grid-cols-2 col-span-1 mb-8 px-6 py-6">
					<div className=" fixed">
						<div className="flex gap-5 bg-gray-100 p-4 m-4 h-max place-self-center">
							<div>
								<h3 className=" font-medium text-sm ">
									Get unlimited access to everything on Reader
								</h3>
								<h4 className=" text-gray-4s00 text-xs mt-2 mb-4">
									plans starting at $/week
								</h4>
								<button className="bg-gray-200 py-1 px-2 rounded-lg">
									Get unlimeted acces
								</button>
							</div>
							<MdOutlineCalendarMonth className=" text-8xl font-normal  text-gray-400 " />
						</div>
						<section>
							<h2 className="mx-4 text-center text-sm font-medium my-5">
								People you might be interested in
							</h2>

							{articles.slice(0, 3).map((article) => {
								return (
									<div className="flex  gap-3 lg:mx-6 my-5">
										<div>
											{" "}
											<img
												className=" w-8 h-8 rounded-full"
												src={article.imageUrl}
												alt=""
											/>
										</div>
										<div>
											<h3 className=" text-xs text-gray-900">
												{article.user.name}
											</h3>
											<h3 className=" text-xs text-gray-4s00">
												{article.user.profession}
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
						</section>
						<section className="flex justify-center flex-col py-6 px-8">
							<h2 className=" text-gray-900 font-medium mb-4 text-center">
								More interesting topics
							</h2>
							<div className=" flex justify-between gap-4 flex-wrap">
								{articles.map((article) => {
									return (
										<button className=" text-sm border border-blue-300 hover:border-gray-300 hover:bg-gray-300 rounded-xl px-3 py-[0.15rem] ">
											{article.category}
										</button>
									);
								})}
							</div>
						</section>
					</div>
				</main>
			</div>
		</div>
	);
};

export default Home;
