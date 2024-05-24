import { ThumbsDown, ThumbsUp, Users } from "lucide-react";
import axios from 'axios';
import { useEffect, useState, useContext } from "react";
import { formatNumFollowers, formatNumLikes, formatNumViewers } from "../../utils/formatNumber";
import FollowButton from "../detailStreamer/FollowButton";
import FollowedButton from "../detailStreamer/FollowedButton";
import { Link } from "react-router-dom";
import { ModalContext } from "../../layouts/ModalContext";

const Streamer = ({ user }) => {
	const { handleShowUnfollowModal, followed, setFollowed } = useContext(ModalContext);
	return (
		<div className="w-full items-center bg-white shadow-md dark:bg-boxdark py-3 px-4 rounded-md">
			<div className="w-full md:flex md:justify-between">
				<Link 
					to={`/${user.id}`}
					className="flex gap-3"
				>
					<img src={user.profile_picture} alt="" className="rounded-full w-[3rem] h-[3rem] object-cover" />
					<div>
						<div className="text-lg font-bold">{user.name}</div>
						<div>{formatNumFollowers(user.num_followers)} followers</div>
					</div>
				</Link>

				<div className="flex items-center ml-15 mt-1 md:ml-4 md:mt-0">
					{!followed && <FollowButton onClick={() => setFollowed(true)} />}
                    {followed && <FollowedButton
                        onUnfollowClick={handleShowUnfollowModal}
                        streamerName={user.name} />}
				</div>
			</div>
		</div>
	);
}

const StreamDescription = ({ stream }) => {
	const [isExpanded, setIsExpanded] = useState(false);
	return (
		<div className="w-full items-center space-y-3 bg-white shadow-md dark:bg-boxdark py-3 px-4 rounded-md">
			<h3 className="font-bold text-2xl w-full">{stream.title}</h3>
			<div className="flex justify-between">
				<div className="flex space-x-2">
					<Users className="w-[1rem]" />
					<span>{formatNumViewers(stream.num_viewers)}</span>
				</div>
				<div className="flex divide-x-2 divide-white dark:divide-boxdark mb-4 text-xs md:text-base">
					<button className="px-2 py-1 md:px-4 md:py-2 rounded-l-full flex gap-2 items-center
						bg-neutral-300 dark:bg-black hover:bg-purple-600 dark:hover:bg-purple-500 hover:text-white">
						<ThumbsUp size={20} />
						{formatNumLikes(stream.num_likes)}
					</button>
					<button className="px-2 py-1 md:px-4 md:py-2 rounded-r-full flex gap-2 items-center
						bg-neutral-300 dark:bg-black hover:bg-purple-600 dark:hover:bg-purple-500 hover:text-white">
						<ThumbsDown size={20} />
						{formatNumLikes(stream.num_dislikes)}
					</button>
				</div>
			</div>
			<div className={isExpanded ? "flex flex-col gap-4" : ""}>
				{isExpanded ? stream.description : `${stream.description.substring(0, 200)}...`}
				<button
					className="px-1 rounded-lg bg-neutral-200 dark:bg-neutral-700
						hover:bg-neutral-300 dark:hover:bg-neutral-600 w-fit text-start"
					onClick={() => setIsExpanded(!isExpanded)}
				>
					{isExpanded ? "Show less" : "More"}
				</button>
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

const StreamVideo = ({ stream }) => {
	return (
		<div className="w-full flex flex-col items-center space-y-3">
			<Streamer user={stream.user} />
			<Video />
			<StreamDescription stream={stream} />
		</div>
	)
}

export default StreamVideo;