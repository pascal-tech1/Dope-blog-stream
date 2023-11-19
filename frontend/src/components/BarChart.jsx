import React, { useEffect } from "react";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

import DashboardCustomDropdown from "./DashboardCustomDropdown";

import { setChartSelectedFilter } from "../redux/user/userSlice";
import { useSelector } from "react-redux";

export function BarChart() {
	const { chartSelectedFilter, userPostImpression } = useSelector(
		(store) => store.userSlice
	);

	ChartJS.register(
		CategoryScale,
		LinearScale,
		BarElement,
		Title,
		Tooltip,
		Legend
	);

	const options = {
		responsive: true,
		maintainAspectRatio: false,
		autoPadding: true,
		plugins: {
			legend: {
				display: true,
				position: "top",
				align: "end",
				labels: {
					boxWidth: 10, // Adjust the width of the legend item
					padding: 20, // Adjust the padding between legend items
				},
			},
			title: {
				display: true,
				text: `${chartSelectedFilter.toUpperCase()} CHART`,
			},
		},
		tooltips: {
			enabled: true,
			mode: "index",
			intersect: false,
			callbacks: {
				label: function (tooltipItem, data) {
					return data.labels[tooltipItem.dataIndex];
				},
			},
		},

		scales: {
			x: {
				ticks: {
					callback: function (value) {
						return value;
					},
				},
			},
			y: {
				ticks: {
					callback: function (value) {
						return value >= 1000 ? value / 1000 + "k" : value; // Convert values greater than or equal to 1000 to "1k" format
					},
				},
			},
		},
	};

	const labels = userPostImpression?.postsTitle;
	let datasets;
	// if (userPostImpression.length === 0) {
	// 	datasets = [
	// 		{
	// 			label: "Likes",
	// 			data: [],
	// 			backgroundColor: "rgba(255, 99, 132, 0.5)",
	// 		},
	// 		{
	// 			label: "Dislikes",
	// 			data: [],
	// 			backgroundColor: "rgba(53, 162, 235, 0.5)",
	// 		},
	// 	];
	// }

	if (chartSelectedFilter === "likes and dislikes") {
		datasets = [
			{
				label: "Likes",
				data: userPostImpression?.likesDataset,
				backgroundColor: "rgba(255, 99, 132, 0.5)",
			},
			{
				label: "Dislikes",
				data: userPostImpression?.disLikesDataset,
				backgroundColor: "rgba(53, 162, 235, 0.5)",
			},
		];
	}

	if (chartSelectedFilter === "number of views") {
		datasets = [
			{
				label: "number of views",
				data: userPostImpression?.numViewDataset,
				backgroundColor: "rgba(255, 99, 132, 0.5)",
			},
		];
	}

	const data = {
		labels,
		datasets,
	};

	const allFilter = ["likes and dislikes", "number of views"];

	return (
		<div className="w-full h-[300px]  flex flex-col  py-2 rounded-lg">
			<div className=" px-2 self-start ">
				<DashboardCustomDropdown
					allFilters={allFilter}
					setSelectedFilter={setChartSelectedFilter}
					selectedFilter={chartSelectedFilter}
					dropdownWidth={"yes"}
				/>
			</div>
			{userPostImpression && <Bar options={options} data={data} />}
		</div>
	);
}
