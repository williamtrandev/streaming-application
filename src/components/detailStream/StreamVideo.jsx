import { Users } from "lucide-react";
import axios from 'axios';
import { useEffect } from "react";
const HeaderStreamVideo = ({stream}) => {
	return (
		<div className="w-full flex space-x-3 items-center">
			<img src={stream.user.avatar} alt="" className="rounded-full w-[3rem] h-[3rem] object-cover" />

			<div className="w-full">
				<div className="w-full flex justify-between">
					<h3 className="font-bold text-2xl">{stream.title}</h3>
					<button type="button" className="flex space-x-2 items-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-1 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
						<span className="font-bold text-lg">+</span>
						<span>Follow</span>
					</button>
				</div>
				<div className="flex space-x-4 text-sm">
					<span>{stream.user.name}</span>
					<p className="flex space-x-2">
						<Users className="w-[1rem]" />
						<span>{stream.num_viewers}</span>
					</p>
					<span>Followers: {stream.user.num_followers}</span>
				</div>
			</div>
		</div>
	)
}
const axiosInstance = axios.create({
	baseURL: 'http://localhost:5000'
});

const Video = () => {
	async function init() {
		const peer = createPeer();
		peer.addTransceiver("video", { direction: "recvonly" })
	}

	function createPeer() {
		const peer = new RTCPeerConnection({
			iceServers: [
				{
					urls: "stun:stun.stunprotocol.org"
				}
			]
		});
		peer.ontrack = handleTrackEvent;
		peer.onnegotiationneeded = () => handleNegotiationNeededEvent(peer);

		return peer;
	}

	async function handleNegotiationNeededEvent(peer) {
		try {
			const offer = await peer.createOffer();
			await peer.setLocalDescription(offer);
			const payload = {
				sdp: peer.localDescription
			};
			const { data } = await axiosInstance.post('/consumer', payload);
			const desc = new RTCSessionDescription(data.sdp);
			peer.setRemoteDescription(desc);
		} catch (error) {
			console.error('Error handling negotiation:', error);
		}
	}

	function handleTrackEvent(e) {
		document.getElementById("video").srcObject = e.streams[0];
	}
	useEffect(() => {
		init();
	}, []);
	return (
		<div className="aspect-video w-full rounded-lg overflow-hidden flex justify-center">
			<video autoPlay controls id="video" className="h-full rounded-lg">
				{/* <source src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" type="video/mp4" /> */}
			</video>
		</div>
	)
}

const StreamVideo = ({stream}) => {
	return (
		<div className="w-full h-full flex flex-col items-center justify-center bg-white shadow-md dark:bg-boxdark px-4 py-6 rounded-md space-y-3">
			<HeaderStreamVideo stream={stream} />
			<Video />
		</div>			
	)
}

export default StreamVideo;