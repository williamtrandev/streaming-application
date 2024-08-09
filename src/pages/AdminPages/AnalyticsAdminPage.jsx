import { Bar, Doughnut, Line } from "react-chartjs-2";
import { DatePicker } from 'antd';
import { useEffect, useState } from 'react';
import { appName } from "../../constants";
import { useAuth } from '../../contexts/AuthContext';
import { filterBtns } from "../../constants";
import { formatDataChart } from "../../utils";
import { formatNumViewers } from "../../utils/formatNumber";
import { Activity, MoveDownLeft, MoveDownRight, MoveUpRight, Tv2, User } from "lucide-react";
import dayjs from 'dayjs';
import { useOverview, useStats } from "../../api/admin";


const AnalyticsAdminPage = () => {
	const ranges = {
		'Last 7 Days': [dayjs().subtract(7, 'day'), dayjs()],
		'Last 30 Days': [dayjs().subtract(30, 'day'), dayjs()],
		'This Month': [dayjs().startOf('month'), dayjs().endOf('month')],
		'Last Month': [
			dayjs().subtract(1, 'month').startOf('month'),
			dayjs().subtract(1, 'month').endOf('month'),
		],
	};
	const [activeIndex, setActiveIndex] = useState(0);
	const [dataBar, setDataBar] = useState([]);
	const [labelDataBar, setLabelDataBar] = useState([]);
	const [statsType, setStatsType] = useState('time_streaming');
	const [fromDate, setFromDate] = useState(dayjs().format('YYYY-MM-DD'));
	const [toDate, setToDate] = useState(dayjs().format('YYYY-MM-DD'));
	const [numUsers, setNumUsers] = useState(0);
	const [numStreams, setNumStreams] = useState(0);
	const [numViewersPerMin, setNumViewersPerMin] = useState(0);
	const [numUsersGrowth, setNumUsersGrowth] = useState(0);
	const [numStreamsGrowth, setNumStreamsGrowth] = useState(0);
	const [numViewersPerMinGrowth, setNumViewersPerMinGrowth] = useState(0);
	const daysDifference = dayjs(toDate).diff(dayjs(fromDate), 'day') + 1;
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
	const [dataLine, setDataLine] = useState([]);
	const [labelDataLine, setLabelDataLine] = useState([]);
	const { data: overviewData, isSuccess: isOverviewSuccess } = useOverview(fromDate, toDate);
	const { data: statsData, isSuccess: isStatsSuccess } = useStats();
	useEffect(() => {
		if (isOverviewSuccess && overviewData) {
			const { streams, users, numViewersPerMin } = overviewData.data;
			const growth = overviewData.growth;
			console.log(overviewData.growth)
			setNumUsers(users);
			setNumStreams(streams);
			setNumViewersPerMin(numViewersPerMin);
			setNumUsersGrowth(growth.users);
			setNumStreamsGrowth(growth.streams);
			setNumViewersPerMinGrowth(growth.numViewersPerMin); 
		}
	}, [overviewData, isOverviewSuccess]);
	useEffect(() => {
		if (isStatsSuccess && statsData) {
			const labels = statsData.labels;
			const datasets = [
				{
					label: 'Cumulative Streamers',
					data: statsData.datasets.streamers,
					borderColor: 'rgba(75, 192, 192, 1)',
					backgroundColor: 'rgba(75, 192, 192, 0.2)',
					fill: true,
				},
				{
					label: 'Cumulative Users',
					data: statsData.datasets.users,
					borderColor: 'rgba(153, 102, 255, 1)',
					backgroundColor: 'rgba(153, 102, 255, 0.2)',
					fill: true,
				},
			];

			setLabelDataLine(labels);
			setDataLine(datasets);
		}
	}, [statsData, isStatsSuccess]);
	return (
		<div className="space-y-5">
			<p className="font-bold text-theme text-2xl">Overview Dashboard</p>
			<DatePicker.RangePicker
				size="large"
				className="dark:bg-meta-4 dark:border-none dark:text-white analytics-step-4"
				ranges={ranges}
				defaultValue={[dayjs(), dayjs()]}
				onChange={(date, dateString) => {
					console.log(date, dateString);
					setFromDate(dateString[0]);
					setToDate(dateString[1]);
				}}
			/>
			<div className="w-full gap-5">
				<div className="grid md:grid-cols-3 gap-10">
					<div className="bg-white dark:bg-meta-4 p-5 rounded-lg shadow-md flex items-center gap-5">
						<div className="w-15 h-15 rounded-full bg-green-200 flex items-center justify-center">
							<User className="w-5 h-5 text-green-800"/>
						</div>
						<div className="flex flex-col">
							<span className="text-base">User</span>
							<span className="text-lg font-semibold">{formatNumViewers(numUsers)}</span>
							<div className={`text-xs flex gap-1 ${ numUsersGrowth < 0 ? '!text-red-600' : '!text-blue-500' }`}>
								{
									numUsersGrowth < 0 ? 
										<MoveDownLeft className="w-4 h-4" />
									: 
										<MoveUpRight className="w-4 h-4" />
								}

								{numUsersGrowth !== 'Infinity' ? `${Math.abs(numUsersGrowth.toFixed(2))} %` : numUsersGrowth} vs {daysDifference} days ago
							</div>
						</div>
					</div>
					<div className="bg-white dark:bg-meta-4 p-5 rounded-lg shadow-md flex items-center gap-5">
						<div className="w-15 h-15 rounded-full bg-blue-200 flex items-center justify-center">
							<Tv2 className="w-5 h-5 text-blue-800" />
						</div>
						<div className="flex flex-col">
							<span className="text-base">Stream</span>
							<span className="text-lg font-semibold">{formatNumViewers(numStreams)}</span>
							<div className={`text-xs flex gap-1 ${numStreamsGrowth < 0 ? '!text-red-600' : '!text-blue-500'}`}>
								{
									numStreamsGrowth < 0 ?
										<MoveDownLeft className="w-4 h-4" />
										:
										<MoveUpRight className="w-4 h-4" />
								}

								{numStreamsGrowth !== 'Infinity' ? `${formatNumViewers(Math.abs(numStreamsGrowth.toFixed(2)))}%` : numStreamsGrowth} vs {daysDifference} days ago
							</div>
						</div>
					</div>
					<div className="bg-white dark:bg-meta-4 p-5 rounded-lg shadow-md flex items-center gap-5">
						<div className="w-15 h-15 rounded-full bg-orange-200 flex items-center justify-center">
							<Activity className="w-5 h-5 text-orange-800" />
						</div>
						<div className="flex flex-col">
							<span className="text-base">Number of Viewers Per Minute</span>
							<span className="text-lg font-semibold">{formatNumViewers(numViewersPerMin)}</span>
							<div className={`text-xs flex gap-1 ${numViewersPerMinGrowth < 0 ? '!text-red-600' : '!text-blue-500'}`}>
								{
									numViewersPerMinGrowth < 0 ?
										<MoveDownLeft className="w-4 h-4" />
										:
										<MoveUpRight className="w-4 h-4" />
								}

								{numViewersPerMinGrowth !== 'Infinity' ? `${formatNumViewers(Math.abs(numViewersPerMinGrowth.toFixed(2)))}%` : numViewersPerMinGrowth} vs {daysDifference} days ago
							</div>
						</div>
					</div>
				</div>
			</div>
			<p className="!mt-10 font-bold text-theme text-2xl">Statistics streamers and users in system for this month</p>
			<div className="w-full bg-white dark:bg-meta-4 rounded-md shadow-md space-y-3 p-5 analytics-step-2">
				<Line
					className="max-h-[70vh]"
					data={{
						labels: labelDataLine,
						datasets: dataLine
					}}
					options={{
						maxPointsLimit: 10,
						scales: {
							x: {
								ticks: {
									autoSkip: true,
									maxTicksLimit: 10,
								}
							},
							y: {
								ticks: {
									stepSize: 1,
									maxTicksLimit: 10,
									beginAtZero: true,
									callback: function (value) {
										return Math.floor(value);
									}
								}
							}
						},
						elements: {
							line: {
								tension: 0.5,
							},
						},
					}}
				/>
			</div>
		</div>
	)
}

export default AnalyticsAdminPage