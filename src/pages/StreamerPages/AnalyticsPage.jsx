import { Chart as ChartJS, defaults } from "chart.js/auto";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import { DatePicker } from 'antd';
import { useEffect, useState } from 'react';
import { appName } from "../../constants";
import { useGetStats, useGetStatsViewer } from "../../api/studio";
import { useAuth } from '../../contexts/AuthContext';
import { filterBtns } from "../../constants";
import { formatDataChart } from "../../utils";
import { TourProvider, useTour } from '@reactour/tour';
import { analyticsSteps } from '../../guides/steps';
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import useLocalStorage from "../../hooks/useLocalStorage";

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
	const { setIsOpen } = useTour();
	const [isFirstAnalytics, setIsFirstAnalytics] = useLocalStorage('isFirstAnalytics', true);
	useEffect(() => {
        document.title = `Analytics - ${appName}`;
    }, []);

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
	const [dataLine, setDataLine] = useState([]);
	const [labelDataLine, setLabelDataLine] = useState([]);
	const { data: statsData, isSuccess: isStatsSuccess } = useGetStats({ statsType: statsType, fromDate: fromDate, toDate: toDate });
	const { auth } = useAuth();
	const { data: statsViewerData, isSuccess: isStatsViewerSuccess } = useGetStatsViewer(auth.user._id);
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
	useEffect(() => {
		if (isStatsViewerSuccess && statsViewerData && statsViewerData.numViewersPerMin) {
			const datasets = [
				{
					label: "Viewer",
					data: statsViewerData.numViewersPerMin.map(dataset => dataset.count),
					backgroundColor: "#064FF0",
					borderColor: "#064FF0",
				}
			];
			console.log(datasets)
			setDataLine(datasets);
			const labels = statsViewerData?.numViewersPerMin.map(data => new Date(data.timestamp).toLocaleTimeString());
			setLabelDataLine(labels);
		}
	}, [statsViewerData, isStatsViewerSuccess]);
	useEffect(() => {
		setIsOpen(isFirstAnalytics);
	}, [isFirstAnalytics]);
	return (
		<div className="space-y-5">
			<p className="font-bold text-theme text-2xl">Viewers from latest stream</p>
			<div className="w-full gap-5">
				<div className="w-full flex flex-col items-center justify-center bg-white dark:bg-meta-4 rounded-md shadow-md space-y-3 p-5 analytics-step-1">
					<Line 
						className="max-h-[70vh]" 
						data={{
							labels: labelDataLine,
							datasets: dataLine
						}}
						options={{
							maxPointsLimit: 20,
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
			<p className="!mt-10 font-bold text-theme text-2xl">Statistics in your 10 latest stream</p>
			<div className="flex flex-col items-center justify-center w-full gap-5">
				<DatePicker.RangePicker
					size="large"
					className="dark:bg-meta-4 dark:border-none dark:text-white analytics-step-4"
					onChange={(date, dateString) => {
						console.log(date, dateString);
						setFromDate(dateString[0]);
						setToDate(dateString[1]);
					}}
				/>
				<div className="flex analytics-step-3">
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
			<div className="w-full bg-white dark:bg-meta-4 rounded-md shadow-md space-y-3 p-5 analytics-step-2">
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

const AnalyticsPageWithTour = () => {
	const disableBody = (target) => disableBodyScroll(target);
	const enableBody = (target) => enableBodyScroll(target);
	return (
		<TourProvider
			steps={analyticsSteps}
			afterOpen={disableBody}
			beforeClose={enableBody}
		>
			<AnalyticsPage />
		</TourProvider>
	)
}

export default AnalyticsPageWithTour;