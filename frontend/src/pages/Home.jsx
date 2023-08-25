import React from "react";
import NavBar from "./NavBar";

const Home = () => {
	const category = ["design", "developtment", "ux", "marketing"];
	return (
		<>
			<NavBar />
			<main className=" border-r-2 max-w-full lg:max-w-4xl">
				<div className="flex place-content-between p-5">
					<input className=" border-solid" type="search" name="search" id="seearch" />
					{category.map((category) => {
						return <button className=" bg-slate-100 rounded-lg py-1 px-4">{category}</button>;
					})}
				</div>
			</main>
			<main></main>
		</>
	);
};

export default Home;
