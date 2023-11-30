import React from "react";

const ChartSkeleton = () => {
	return (
		<div
			role="status"
			class=" max-w-fit max-h-fit p-4 border border-gray-200 rounded shadow animate-pulse md:p-6 dark:border-gray-700"
		>
			<div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-full mb-2.5"></div>
			<div className=" h-2 mb-10 bg-gray-200 rounded-full dark:bg-gray-700"></div>
			<div className="flex items-baseline mt-4">
				<div className="w-full bg-gray-200 rounded-t-lg  dark:bg-gray-700"></div>
				<div className="w-full ms-6 bg-gray-200 rounded-t-lg dark:bg-gray-700"></div>
				<div className="w-full bg-gray-200 rounded-t-lg ms-6 dark:bg-gray-700"></div>
				<div className="w-full  ms-6 bg-gray-200 rounded-t-lg dark:bg-gray-700"></div>
				<div className="w-full bg-gray-200 rounded-t-lg  ms-6 dark:bg-gray-700"></div>
				<div className="w-full bg-gray-200 rounded-t-lg ms-6 dark:bg-gray-700"></div>
				<div className="w-full bg-gray-200 rounded-t-lg  ms-6 dark:bg-gray-700"></div>
			</div>
			<span class="sr-only">Loading...</span>
		</div>
	);
};

export default ChartSkeleton;
