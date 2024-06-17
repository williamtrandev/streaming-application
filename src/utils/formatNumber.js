import { formatDistanceToNow, differenceInHours, differenceInDays, differenceInMonths, differenceInYears } from 'date-fns';

export const formatNumLikes = (num) => {
	try {
		if (num >= 1000000000) {
			return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'B';
		} else if (num >= 1000000) {
			return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
		} else if (num >= 1000) {
			return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
		} else {
			return num.toString();
		}
	} catch (error) {
		return 0;
	}
};

export const formatNumFollowers = (num) => {
	try {
		if (num >= 1000000000) {
			return (num / 1000000000).toFixed(2).replace(/\.0$/, '') + 'B';
		} else if (num >= 1000000) {
			return (num / 1000000).toFixed(2).replace(/\.0$/, '') + 'M';
		} else if (num >= 1000) {
			return (num / 1000).toFixed(2).replace(/\.0$/, '') + 'K';
		} else {
			return num.toString();
		}
	} catch (error) {
		return 0;
	}
};

export const formatNumViewers = (num) => {
	try {
		return num.toLocaleString('en-US');
	} catch (error) {
		return 0;
	}
}

export const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const minutes = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');

    return `${hours}:${minutes}:${secs}`;
}

export const formatTimeDifference = (date) => {
	const now = new Date();
	const diffYears = differenceInYears(now, new Date(date));
	const diffMonths = differenceInMonths(now, new Date(date));
	const diffDays = differenceInDays(now, new Date(date));
	const diffHours = differenceInHours(now, new Date(date));

	if (diffYears > 0) {
		return `${diffYears} ${diffYears === 1 ? 'year' : 'years'} ago`;
	} else if (diffMonths > 0) {
		return `${diffMonths} ${diffMonths === 1 ? 'month' : 'months'} ago`;
	} else if (diffDays > 0) {
		return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
	} else {
		return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
	}
};