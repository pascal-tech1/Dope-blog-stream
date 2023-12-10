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
import ChartSkeleton from "./chartSkeleton";

export function BarChart() {
	const {
		chartSelectedFilter,
		userPostImpression,
		userPostImpressionStatus,
	} = useSelector((store) => store.userSlice);

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
					boxWidth: 10,
					padding: 20,
					color: "white", // Set legend label color to white
				},
			},
			title: {
				display: true,
				text: `${chartSelectedFilter.toUpperCase()} CHART`,
				color: "white", // Set title color to white
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
					color: "white", // Set x-axis label color to white
				},
			},
			y: {
				ticks: {
					callback: function (value) {
						return value >= 1000 ? value / 1000 + "k" : value;
					},
					color: "white", // Set y-axis label color to white
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
				backgroundColor: "#1081E8",
			},
			{
				label: "Dislikes",
				data: userPostImpression?.disLikesDataset,
				backgroundColor: "rgb(255, 99, 133)",
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
		<div className="w-full h-[300px]  flex flex-col  py-2 rounded-lg   ">
			<div className=" px-2 self-start ml-10 ">
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
