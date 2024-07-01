import { Chart as ChartJS, defaults } from "chart.js/auto";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import { DatePicker } from 'antd';
import { useEffect, useState } from 'react';
import { useGetStats } from "../../api/studio";
import { useAuth } from '../../contexts/AuthContext';
import { filterBtns } from "../../constants";
import { formatDataChart } from "../../utils";

const concurrentViewers = [
	{ "time": "00:00:02", "viewers": 150 },
	{ "time": "00:00:03", "viewers": 200 },
	{ "time": "00:01:02", "viewers": 250 },
	{ "time": "00:01:22", "viewers": 300 },
	{ "time": "00:02:02", "viewers": 350 },
	{ "time": "00:03:02", "viewers": 320 }
];
const newFollowersSubscribers = [
	{ streamId: "Stream 1", newFollowers: 50, newSubscribers: 20 },
	{ streamId: "Stream 2", newFollowers: 150, newSubscribers: 30 },
	{ streamId: "Stream 3", newFollowers: 60, newSubscribers: 25 },
	{ streamId: "Stream 4", newFollowers: 90, newSubscribers: 200 },
	{ streamId: "Stream 5", newFollowers: 102, newSubscribers: 104 },
	{ streamId: "Stream 6", newFollowers: 110, newSubscribers: 45 },
	{ streamId: "Stream 7", newFollowers: 50, newSubscribers: 100 },
	{ streamId: "Stream 8", newFollowers: 10, newSubscribers: 60 },
	{ streamId: "Stream 9", newFollowers: 140, newSubscribers: 65 },
	{ streamId: "Stream 10", newFollowers: 45, newSubscribers: 70 },
];
const viewerData = {
	"subscribedViewers": 120,
	"unsubscribedViewers": 80
};
const colors = [
	"rgba(43, 63, 229, 0.8)",
	"rgba(250, 192, 19, 0.8)",
	"rgba(253, 135, 135, 0.8)",
	"rgba(144, 202, 249, 0.8)",
	"rgba(165, 214, 167, 0.8)",
	"rgba(255, 224, 178, 0.8)",
	"rgba(179, 157, 219, 0.8)",
	"rgba(255, 245, 157, 0.8)",
	"rgba(188, 170, 164, 0.8)",
	"rgba(255, 138, 128, 0.8)"
];
defaults.responsive = true;
defaults.plugins.title.align = "start";
defaults.plugins.title.font.size = 20;

const AnalyticsPage = () => {
	const [activeIndex, setActiveIndex] = useState(0);
	const [dataBar, setDataBar] = useState([]);
	const [labelDataBar, setLabelDataBar] = useState([]);
	const [statsType, setStatsType] = useState('time_streaming');
	const [fromDate, setFromDate] = useState('');
	const [toDate, setToDate] = useState('');
	const options = {
		plugins: {
			tooltip: {
				callbacks: {
					label: function (context) {
						let label = context.dataset.label || '';
						if (label) {
							label += ': ';
						}
						if (context.parsed.y !== null) {
							label += formatDataChart(context.parsed.y, statsType);
						}
						return label;
					},
				},
			},
		},
		scales: {
			y: {
				ticks: {
					callback: function (value) {
						return formatDataChart(value, statsType);
					}
				}
			}
		}
	};
	const { data: statsData, isSuccess: isStatsSuccess } = useGetStats({ statsType: statsType, fromDate: fromDate, toDate: toDate });
    const handleClick = (index, value) => {
        setActiveIndex(index);
		setStatsType(value);
    };
	useEffect(() => {
		if (isStatsSuccess && statsData && statsData.datasets) {
			const datasets = statsData.datasets.map((dataset) => {
				return {
					label: dataset.label,
					data: dataset.stats.map((data) => data.data),
					backgroundColor: dataset.stats.map((_, index) => colors[index % colors.length]),
					borderRadius: 5,
				}
			}) 
			setDataBar(datasets);
			const labels = statsData?.datasets[0]?.stats.map(data => new Date(data.dateStream).toLocaleDateString());
			setLabelDataBar(labels);
		}
		console.log(statsData)
	}, [statsData, isStatsSuccess]);
	return (
		<div className="space-y-5">
			<p className="font-bold text-theme text-2xl">Data from latest stream</p>
			<div className="w-full grid grid-cols-1 md:grid-cols-2 gap-5">
				<div className="flex flex-col items-center justify-center bg-white dark:bg-meta-4 rounded-md shadow-md space-y-3 p-5">
					<p className="font-bold text-lg">Viewers At Latest Stream</p>
					<Line 
						data={{
							labels: concurrentViewers.map((data) => data.time),
							datasets: [
								{
									label: "Viewers",
									data: concurrentViewers.map((data) => data.viewers),
									backgroundColor: "#064FF0",
									borderColor: "#064FF0",
								},
							],
						}}
						options={{
							elements: {
								line: {
									tension: 0.5,
								},
							},
						}}
					/>
				</div>
				<div className="flex flex-col items-center justify-center bg-white dark:bg-meta-4 rounded-md shadow-md space-y-3 p-5">
					<p className="font-bold text-lg">New Followers And Subscribers</p>
					<Doughnut className="max-w-100 max-h-100"
						data={{
							labels: ['Subscribed Viewers', 'Unsubscribed Viewers'],
							datasets: [
								{
									label: 'Viewers',
									data: [viewerData.subscribedViewers, viewerData.unsubscribedViewers],
									backgroundColor: colors,
									hoverBackgroundColor: colors
								}
							]
						}}
						options={{
							responsive: true,
							plugins: {
								legend: {
									position: 'bottom',
								},
								tooltip: {
									callbacks: {
										label: function (tooltipItem) {
											return `${tooltipItem.label}: ${tooltipItem.raw}`;
										}
									}
								}
							}
						}}
					/>
				</div>
			</div>
			<p className="!mt-10 font-bold text-theme text-2xl">Statistics in your 10 latest stream</p>
			<div className="flex flex-col items-center justify-center w-full gap-5">
				<DatePicker.RangePicker
					size="large"
					className="dark:bg-meta-4 dark:border-none dark:text-white"
					onChange={(date, dateString) => {
						console.log(date, dateString);
						setFromDate(dateString[0]);
						setToDate(dateString[1]);
					}}
				/>
				<div className="flex">
					{filterBtns.map((filterBtn, index) => {
						const isFirst = index === 0;
						const isLast = index === filterBtns.length - 1;
						const isActive = index === activeIndex;
						return (
							<div
								className={`
									p-3 cursor-pointer text-sm border-r
									${isFirst ? 'rounded-l-lg' : ''}
									${isLast ? 'rounded-r-lg border-r-0 ' : ''}
									${isActive ? '!bg-purple-700 text-white' : ''}
									bg-white text-black dark:bg-meta-4 dark:text-white dark:border-gray-600
									hover:!bg-purple-700 hover:!text-white
									transition duration-300 ease-in-out
								`}
								key={index}
								onClick={() => handleClick(index, filterBtn.value)}
							>
								{filterBtn.label}
							</div>
						);
					})}
				</div>
			</div>
			<div className="w-full bg-white dark:bg-meta-4 rounded-md shadow-md space-y-3 p-5">
				<Bar className="max-h-[70vh]"
					data={{
						labels: labelDataBar,
						datasets: dataBar
					}}
					options={options}
				/>
			</div>
		</div>
	)
}

export default AnalyticsPage;