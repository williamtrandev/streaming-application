import React, { useState, useEffect } from 'react';
import axios from 'axios';

const axiosInstance = axios.create({
	baseURL: 'http://localhost:5000'
});

const Streaming = () => {
	const init = async () => {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({ video: true });
			document.getElementById("video").srcObject = stream;
			const peer = createPeer();
			stream.getTracks().forEach(track => peer.addTrack(track, stream));
		} catch (error) {
			console.error('Error accessing camera:', error);
		}
	};

	const createPeer = () => {
		const peer = new RTCPeerConnection({
			iceServers: [
				{
					urls: "stun:stun.stunprotocol.org"
				}
			]
		});
		peer.onnegotiationneeded = () => handleNegotiationNeededEvent(peer);
		return peer;
	};

	const handleNegotiationNeededEvent = async (peer) => {
		try {
			const offer = await peer.createOffer();
			await peer.setLocalDescription(offer);
			const payload = {
				sdp: peer.localDescription
			};
			const { data } = await axiosInstance.post('/broadcast', payload);
			const desc = new RTCSessionDescription(data.sdp);
			await peer.setRemoteDescription(desc);
		} catch (error) {
			console.error('Error handling negotiation:', error);
		}
	};


	return (
		<>
			<button className='p-4 rounded-lg' onClick={init}>Stream</button>
			<video autoPlay id="video"></video>
		</>
	);
};

export default Streaming;
