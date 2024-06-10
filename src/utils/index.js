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

export { blobToBase64 };