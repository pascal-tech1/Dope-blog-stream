import React, { useState, useEffect } from "react";

const testimonials = [
	{
		id: 1,
		name: "John Doe",
		image: "win1.jpg",
		text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
	},
	{
		id: 2,
		name: "Jane Smith",
		image: "win2.jpg",
		text: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
	},
	{
		id: 3,
		name: "Jane Smith",
		image: "win3.jpg",
		text: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
	},

	// Add more testimonial objects here
];

const Carousel = () => {
	const [currentIndex, setCurrentIndex] = useState(0);

	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentIndex(
				(prevIndex) => (prevIndex + 1) % testimonials.length
			);
		}, 3000);

		return () => {
			clearInterval(interval);
		};
	}, []);

	return (
		<div className="flex  font-inter ">
			{testimonials.map((testimony, index) => {
				return (
					<div
						key={testimony.id}
						className={` w-80 dark:bg-[#1C1C1C] rounded-md p-2 font-inter dark:text-slate-200  border dark:border-gray-800 h-40 py-4 px-4 bg-blue-100 space-x-3 gap-1 flex items-center flex-col ${
							currentIndex === index ? " order-2" : "hidden"
						}`}
					>
						<div className="flex space-x-3 items-center  ">
							<img
								src={testimony.image}
								alt=""
								className="w-10 rounded-full  object-cover h-10 "
							/>
							<h3 className="  ">{testimony.name}</h3>
						</div>
						<h3 className=" text-center">
							{testimony.text}
						</h3>
					</div>
				);
			})}
		</div>
	);
};

export default Carousel;
