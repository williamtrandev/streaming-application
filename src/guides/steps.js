export const studioSteps = [
	{
		selector: '.studio-step-1',
		content: `This button will use for streaming with your camera.`
	},
	{
		selector: '.studio-step-2',
		content: `This button will use for streaming with OBS software.`
	},
	{
		selector: '.studio-step-3',
		content: `This button will use for scheduling your stream.`
	},
	{
		selector: '.studio-step-4',
		content: "This table will show all your schedule streams.",
		action: () => {
			localStorage.setItem('isFirstStudio', false);
		}
	},
];

export const analyticsSteps = [
	{
		selector: '.analytics-step-1',
		content: `This chart provides a statistical overview of the viewers of your latest stream.`
	},
	{
		selector: '.analytics-step-2',
		content: `This chart provides statistics for your 10 latest streams based on the metrics you choose.`
	},
	{
		selector: '.analytics-step-3',
		content: `There are 3 options available: streaming time, number of followers, and number of likes/dislikes.`
	},
	{
		selector: '.analytics-step-4',
		content: "You can also choose a specific time period.",
		action: () => {
			localStorage.setItem('isFirstAnalytics', false);
		}
	},
];

export const communitySteps = [
	{
		selector: '.community-step-1',
		content: "Enter the username or full name of the account you want to add."
	},
	{
		selector: '.community-step-2',
		content: "Click here to confirm your choice."
	},
	{
		selector: '.community-step-3',
		content: "This table will display all of your moderators.",
		action: () => {
			localStorage.setItem('isFirstCommunity', false);
		}
	},
];
