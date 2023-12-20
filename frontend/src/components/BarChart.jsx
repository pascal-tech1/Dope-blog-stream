import React from "react";
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
					color: "#94bef9",
				},
			},
			title: {
				display: true,
				text: `${chartSelectedFilter.toUpperCase()} CHART`,
				color: "#94bef9",
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
					color: "#94bef9",
				},
			},
			y: {
				ticks: {
					callback: function (value) {
						return value >= 1000 ? value / 1000 + "k" : value; // Convert values greater than or equal to 1000 to "1k" format
					},
					color: "#94bef9",
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
	// 			backgroundColor: "rgb(255, 99, 133)",
	// 		},
	// 		{
	// 			label: "Dislikes",
	// 			data: [],
	// 			backgroundColor: "rgb(53, 162, 235)",
	// 		},
	// 	];
	// }

	if (chartSelectedFilter === "likes and dislikes") {
		datasets = [
			{
				label: "Likes",
				data: userPostImpression?.likesDataset,
				backgroundColor: "rgb(255, 99, 133)",
			},
			{
				label: "Dislikes",
				data: userPostImpression?.disLikesDataset,
				backgroundColor: "rgb(53, 162, 235)",
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
		<div className="w-full h-[300px]  flex flex-col  py-2 rounded-lg font-inter">
			<div className=" px-2 self-start ">
				<DashboardCustomDropdown
					allFilters={allFilter}
					setSelectedFilter={setChartSelectedFilter}
					selectedFilter={chartSelectedFilter}
					dropdownWidth={"yes"}
				/>
			</div>

			<Bar options={options} data={data} />
		</div>
	);
}
