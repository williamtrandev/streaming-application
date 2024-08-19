import React, { useState, useRef } from 'react';
import CryptoJS from 'crypto-js';

const RegPage = () => {
	const [isRecording, setIsRecording] = useState(false);
	const [response, setResponse] = useState('');
	const [error, setError] = useState('');
	const mediaRecorderRef = useRef(null);
	const intervalIdRef = useRef(null);

	const defaultOptions = {
		host: 'identify-ap-southeast-1.acrcloud.com',
		endpoint: '/v1/identify',
		signature_version: '1',
		data_type: 'audio',
		secure: true,
		access_key: '160de2e9d27d41505a825592318ef856',
		access_secret: 'X8OTS36ScYMbybn9eDiYBDOjd3JdHHwz3VuoLSZ6'
	};

	const buildStringToSign = (method, uri, accessKey, dataType, signatureVersion, timestamp) => {
		return [method, uri, accessKey, dataType, signatureVersion, timestamp].join('\n');
	};

	const sign = (signString, accessSecret) => {
		return CryptoJS.HmacSHA1(signString, accessSecret).toString(CryptoJS.enc.Base64);
	};

	const identify = async (data) => {
		console.log('Sending audio data to server...'); // Debug log
		const timestamp = Math.floor(Date.now() / 1000);
		const stringToSign = buildStringToSign('POST', defaultOptions.endpoint, defaultOptions.access_key, defaultOptions.data_type, defaultOptions.signature_version, timestamp);
		const signature = sign(stringToSign, defaultOptions.access_secret);

		const formData = new FormData();
		formData.append('sample', data);
		formData.append('sample_bytes', data.size);
		formData.append('access_key', defaultOptions.access_key);
		formData.append('data_type', defaultOptions.data_type);
		formData.append('signature_version', defaultOptions.signature_version);
		formData.append('signature', signature);
		formData.append('timestamp', timestamp);

		try {
			const response = await fetch(`https://${defaultOptions.host}${defaultOptions.endpoint}`, {
				method: 'POST',
				body: formData
			});
			const result = await response.text();
			setResponse(result);
		} catch (error) {
			setError('Error: ' + error.message);
		}
	};

	const startRecording = async () => {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
			const mediaRecorder = new MediaRecorder(stream);
			mediaRecorderRef.current = mediaRecorder;
			mediaRecorder.ondataavailable = async (event) => {
				console.log('ondataavailable event fired'); // Debug log
				if (event.data.size > 0) {
					console.log('Data size:', event.data.size); // Debug log
					const audioBlob = new Blob([event.data], { type: 'audio/wav' });
					await identify(audioBlob);
				} else {
					console.log('No data available'); // Debug log
				}
			};

			mediaRecorder.start();
			setIsRecording(true);

			intervalIdRef.current = setInterval(() => {
				mediaRecorder.stop();
				mediaRecorder.start(); // Restart the recording
			}, 10000); // 10 seconds interval
		} catch (error) {
			setError('Error: ' + error.message);
		}
	};

	const stopRecording = () => {
		if (mediaRecorderRef.current) {
			mediaRecorderRef.current.stop();
			clearInterval(intervalIdRef.current);
			setIsRecording(false);
		}
	};
	return (
		<div className="container mx-auto p-4">
			<h1 className="text-2xl font-bold mb-4">Check Audio for Copyright</h1>
			<button
				onClick={isRecording ? stopRecording : startRecording}
				className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
			>
				{isRecording ? 'Stop Recording' : 'Start Recording'}
			</button>
			{response && (
				<div className="mt-4">
					<h2 className="text-xl font-semibold">Response:</h2>
					<pre className="bg-gray-100 p-4 rounded">{response}</pre>
				</div>
			)}
			{error && (
				<div className="mt-4 text-red-600">
					<h2 className="text-xl font-semibold">Error:</h2>
					<p>{error}</p>
				</div>
			)}
		</div>
	);
};

export default RegPage;
