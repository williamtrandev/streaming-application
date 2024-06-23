import { Calendar, ThumbsDown, ThumbsUp, Timer, Users } from "lucide-react";
import { useEffect, useState, useContext } from "react";
import { formatNumFollowers, formatNumLikes, formatNumViewers } from "../../utils/formatNumber";
import FollowButton from "../detailStreamer/FollowButton";
import { Link } from "react-router-dom";
import { Track } from 'livekit-client';
import '@livekit/components-styles';
import { LiveKitRoom } from '@livekit/components-react';
import { jwtDecode } from "jwt-decode";
import StreamVideoControl from "./StreamVideoControl";
import { useAuth } from "../../contexts/AuthContext";
import { v4 as uuidv4 } from 'uuid';
import { useGenerateViewerToken } from "../../api/studio";
import { useLikeStream, useWriteHistory } from "../../api/history";
import { toast } from "react-toastify";
import { useGetNumLikesAndDislikes } from "../../api/stream";

const Streamer = ({ user }) => {
	return (
		<div className="w-full items-center bg-white shadow-md dark:bg-boxdark py-3 px-4 rounded-md">
			<div className="w-full md:flex md:justify-between">
				<Link
					to={`/@${user?._id}`}
					className="flex gap-3"
				>
					<img src={user?.profilePicture} alt="pp" className="rounded-full w-[3rem] h-[3rem] object-cover" />
					<div>
						<div className="text-lg font-bold">{user?.fullname}</div>
						<div>{formatNumFollowers(user?.numFollowers)} followers</div>
					</div>
				</Link>

				<div className="flex items-center ml-15 mt-1 md:ml-4 md:mt-0">
					<FollowButton streamerId={user._id} streamerName={user.fullname} />
				</div>
			</div>
		</div>
	);
}

const StreamDescription = ({ stream }) => {
	const { auth } = useAuth();
	const [isExpanded, setIsExpanded] = useState(false);
	const [liked, setLiked] = useState(null);
	const [numLikes, setNumLikes] = useState(0);
	const [numDislikes, setNumDislikes] = useState(0);

	const { mutate: writeHistory, data: historyData, error: historyError, isError: isHistoryError, isSuccess: isHistorySuccess } = useWriteHistory();
	const { data: likesAndDislikesData } = useGetNumLikesAndDislikes(stream._id);
	const { mutate: likeStream, data: likeData, error: likeError, isError: isLikeError, isSuccess: isLikeSuccess } = useLikeStream();

	useEffect(() => {
		if (likesAndDislikesData) {
			setNumLikes(likesAndDislikesData.numLikes);
			setNumDislikes(likesAndDislikesData.numDislikes);
		}
	}, [likesAndDislikesData]);

	useEffect(() => {
		if (stream && auth) {
			writeHistory({ streamId: stream._id });
		}
	}, [stream]);

	useEffect(() => {
		if (historyData) {
			setLiked(historyData.history.liked);
		}
	}, [isHistorySuccess]);

	useEffect(() => {
		const errorMessage = historyError?.response?.data?.message;
		toast.error(errorMessage);
	}, [isHistoryError]);

	useEffect(() => {
		if (likeData) {
			setLiked(likeData.liked);
			setNumLikes((prev) => prev + likeData.addLike);
			setNumDislikes((prev) => prev + likeData.addDislike);
		}
	}, [isLikeSuccess]);

	useEffect(() => {
		const errorMessage = likeError?.response?.data?.message;
		toast.error(errorMessage);
	}, [isLikeError]);

	return (
		<div className="w-full items-center space-y-3 bg-white shadow-md dark:bg-boxdark py-3 px-4 rounded-md">
			<h3 className="font-bold text-2xl w-full">{stream?.title}</h3>
			<div className="flex justify-between">
				<div className="space-y-1">
					<div className="flex gap-2">
						{/* <Timer className="w-[1rem]" />
						<span>09:02:20</span> */}
						<Calendar className="w-[1rem]" />
						<span>{stream?.dateStream && new Date(stream?.dateStream).toLocaleString()}</span>
					</div>
					<div className="flex gap-2">
						<Users className="w-[1rem]" />
						<span>{formatNumViewers(stream?.numViewers)}</span>
					</div>
				</div>
				<div className="flex divide-x-2 divide-white dark:divide-boxdark mb-4 text-xs md:text-base">
					<button
						className="px-2 py-1 md:px-4 md:py-2 rounded-l-full flex gap-2 items-center
						bg-neutral-300 dark:bg-black hover:bg-purple-600 dark:hover:bg-purple-500 hover:text-white"
						onClick={() => {
							if (!auth) {
								toast.error("You must be logged in to like this stream");
								return;
							}
							if (liked == true) {
								likeStream({ streamId: stream._id, liked: null });
								return;
							}
							likeStream({ streamId: stream._id, liked: true });
						}}
					>
						<ThumbsUp size={20} className={`${liked == true ? "text-pink-600" : ""}`} />
						{formatNumLikes(numLikes)}
					</button>
					<button 
						className="px-2 py-1 md:px-4 md:py-2 rounded-r-full flex gap-2 items-center
							bg-neutral-300 dark:bg-black hover:bg-purple-600 dark:hover:bg-purple-500 hover:text-white"
						onClick={() => {
							if (!auth) {
								toast.error("You must be logged in to dislike this stream");
								return;
							}
							if (liked == false) {
								likeStream({ streamId: stream._id, liked: null });
							}
							likeStream({ streamId: stream._id, liked: false });
						}}
					>
						<ThumbsDown size={20} className={`${liked == false ? "text-pink-600" : ""}`} />
						{formatNumLikes(numDislikes)}
					</button>
				</div>
			</div>
			<div className={isExpanded ? "flex flex-col gap-4" : ""}>
				{isExpanded ? stream?.description : `${stream?.description?.substring(0, 200)}...`}
				{
					stream?.description?.length > 200 &&
					<button
						className="px-1 rounded-lg bg-neutral-200 dark:bg-neutral-700
							hover:bg-neutral-300 dark:hover:bg-neutral-600 w-fit text-start"
						onClick={() => setIsExpanded(!isExpanded)}
					>
						{isExpanded ? "Show less" : "More"}
					</button>
				}
			</div>
		</div>
	)
}


const StreamVideo = ({ streamData }) => {
	const streamId = streamData?.stream?._id;
	const [viewerToken, setViewerToken] = useState("");
	const { auth } = useAuth();
	const userId = auth?.user?._id || uuidv4();
	const { mutate, isSuccess, data } = useGenerateViewerToken();
	useEffect(() => {
		if (!streamId) return;
		const getOrCreateViewerToken = async () => {
			const SESSION_VIEWER_TOKEN_KEY = `${streamId}-viewer-token`;
			const sessionToken = sessionStorage.getItem(SESSION_VIEWER_TOKEN_KEY);

			if (sessionToken) {
				const payload = jwtDecode(sessionToken);

				if (payload.exp) {
					const expiry = new Date(payload.exp * 1000);
					if (expiry < new Date()) {
						sessionStorage.removeItem(SESSION_VIEWER_TOKEN_KEY);
						// const token = await generateViewerToken(streamId, userId);
						// setViewerToken(token);
						// sessionStorage.setItem(SESSION_VIEWER_TOKEN_KEY, token);
						mutate({ streamId });
						return;
					}
				}
				setViewerToken(sessionToken);
			} else {
				mutate({ streamId });
				// const token = await generateViewerToken(streamId, userId);
				// setViewerToken(token);
				// sessionStorage.setItem(SESSION_VIEWER_TOKEN_KEY, token);
			}
		};
		getOrCreateViewerToken();
	}, [streamId]);

	useEffect(() => {
		if (data) {
			const SESSION_VIEWER_TOKEN_KEY = `${streamId}-viewer-token`;
			setViewerToken(data.token);
			sessionStorage.setItem(SESSION_VIEWER_TOKEN_KEY, data.token);
		}
	}, [isSuccess]);

	return (
		<div className="w-full flex flex-col items-center space-y-3">
			<Streamer user={streamData?.stream?.user} />
			<LiveKitRoom
				token={viewerToken}
				serverUrl={import.meta.env.VITE_LIVEKIT_SERVER_URL}
				className="flex flex-1 flex-col"
			>
				<div className="flex h-full flex-1">
					<div className="flex-1 flex-col container  rounded-lg overflow-hidden">
						<StreamVideoControl streamId={streamId} />
					</div>
				</div>
			</LiveKitRoom>
			<StreamDescription stream={streamData?.stream} />
		</div>
	)
}

export default StreamVideo;