async function blobToBase64(blobUrl) {
	try {
		const response = await fetch(blobUrl);
		const blob = await response.blob();

		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onloadend = () => {
				resolve(reader.result);
			};
			reader.onerror = () => {
				resolve(''); 
			};
			reader.readAsDataURL(blob);
		});
	} catch (error) {
		console.error('Error converting blob to Base64:', error);
		return '';
	}
}

const formatDataChart = (value, type) => {
	switch (type) {
		case 'time_streaming':
			const h = Math.floor(value / 3600);
			const m = Math.floor((value % 3600) / 60);
			const s = value % 60;
			return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
		case 'number':
		default:
			return value;
	}
};

const formatRole = (value) => {
	const parts = value.split('_');
	const formattedParts = parts.map(part => part[0].toUpperCase() + part.slice(1).toLowerCase());
	return formattedParts.join(' ');
};

export { blobToBase64, formatDataChart, formatRole };