import { Chart as ChartJS, defaults } from "chart.js/auto";
import { Bar, Doughnut, Line } from "react-chartjs-2";

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
// const textColor = getComputedStyle(document.documentElement).getPropertyValue('--text-color');

const AnalyticsPage = () => {
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
							// scales: {
							// 	x: {
							// 		ticks: {
							// 			color: textColor,
							// 		},
							// 	},
							// 	y: {
							// 		ticks: {
							// 			color: textColor,
							// 		},
							// 	},
							// },
							// plugins: {
							// 	legend: {
							// 		labels: {
							// 			color: textColor,
							// 		},
							// 	},
							// },
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
			<p className="!mt-10 font-bold text-theme text-2xl">Followers and Subcribers in your 10 latest stream</p>
			<div className="w-full bg-white dark:bg-meta-4 rounded-md shadow-md space-y-3 p-5">
				<Bar className="max-h-[70vh]"
					data={{
						labels: newFollowersSubscribers.map((data) => data.streamId),
						datasets: [
							{
								label: "New Followers",
								data: newFollowersSubscribers.map((data) => data.newFollowers),
								backgroundColor: newFollowersSubscribers.map((_, index) => colors[index % colors.length]),
								borderRadius: 5,
							},
							{
								label: "New Subscribers",
								data: newFollowersSubscribers.map((data) => data.newSubscribers),
								backgroundColor: newFollowersSubscribers.map((_, index) => colors[index % colors.length]),
								borderRadius: 5,
							},
						],
					}}
				/>
			</div>
		</div>
	)
}

export default AnalyticsPage