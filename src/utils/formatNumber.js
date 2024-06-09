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
