import { Calendar, Copy, Eye, EyeOff, ThumbsDown, ThumbsUp, Timer, Users } from "lucide-react";
import { useEffect, useState, useContext, useRef } from "react";
import { formatNumFollowers, formatNumLikes, formatNumViewers } from "../../utils/formatNumber";
import FollowButton from "../detailStreamer/FollowButton";
import { Link } from "react-router-dom";
import { Track } from 'livekit-client';
import '@livekit/components-styles';
import { LiveKitRoom } from '@livekit/components-react';
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../../contexts/AuthContext";
import { v4 as uuidv4 } from 'uuid';
import StreamerObsVideoControl from "./StreamerObsVideoControl";
import { useGenerateViewerToken, useGetServerUrlAndStreamKey } from "../../api/studio";
import { useUser } from "../../contexts/UserContext";
import { toast } from "react-toastify";

const StreamKey = ({ streamId }) => {
	const { authUsername: username } = useUser();
	const serverUrlRef = useRef(null);
	const streamKeyref = useRef(null);
	const [showStreamKey, setShowStreamKey] = useState(false);

	const [serverUrl, setServerUrl] = useState("");
	const [streamKey, setStreamKey] = useState("");

	const { data: streamKeyData } = useGetServerUrlAndStreamKey(username, streamId);
	useEffect(() => {
		if (streamKeyData) {
			setServerUrl(streamKeyData?.serverUrl);
			setStreamKey(streamKeyData?.streamKey);
		}
	}, [streamKeyData]);

	return (
		<div className="w-full items-center space-y-3 bg-white shadow-md dark:bg-boxdark py-3 px-4 rounded-md">
			<div className="divide-y divide-gray-300 dark:divide-gray-600 px-4 rounded-lg">
				<div className="flex flex-col md:flex-row py-4 gap-2">
					<div className="md:w-[20%]">Server URL</div>
					<div className="flex gap-4">
						<div
							ref={serverUrlRef}
						>
							{serverUrl}
						</div>
						<button
							className="p-1 rounded-md bg-purple-600 text-white"
							onClick={() => {
								if (serverUrlRef.current) {
									navigator.clipboard.writeText(serverUrlRef.current.innerText)
										.then(() => {
											toast.success("Copied to clipboard!");
										})
										.catch((err) => {
											toast.error("Failed to copy: ", err);
										});
								}
							}}
						>
							<Copy size={20} />
						</button>
					</div>
				</div>
				<div className="flex flex-col md:flex-row py-4 gap-2">
					<div className="md:w-[20%]">Stream key</div>
					<div className="flex gap-4">
						<input
							className="bg-transparent pointer-events-none"
							type={showStreamKey ? "text" : "password"}
							ref={streamKeyref}
							value={streamKey}
							readOnly
						/>
						<div className="flex gap-2">
							<button
								className="p-1 rounded-md bg-purple-600 text-white"
								onClick={() => {
									if (streamKeyref.current) {
										navigator.clipboard.writeText(streamKeyref.current.value)
											.then(() => {
												toast.success("Copied to clipboard!");
											})
											.catch((err) => {
												toast.error("Failed to copy: ", err);
											});
									}
								}}
							>
								<Copy size={20} />
							</button>
							<button
								className="p-1 rounded-md bg-neutral-300 dark:bg-neutral-600"
								onClick={() => setShowStreamKey(!showStreamKey)}
							>
								{!showStreamKey && <Eye size={20} />}
								{showStreamKey && <EyeOff size={20} />}
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}


const StreamerObsVideo = ({ streamId }) => {
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
						mutate({ streamId, userId });
						return;
					}
				}
				setViewerToken(sessionToken);
			} else {
				mutate({ streamId, userId });
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
			<LiveKitRoom
				token={viewerToken}
				serverUrl={import.meta.env.VITE_LIVEKIT_SERVER_URL}
				className="flex flex-1 flex-col"
			>
				<div className="flex h-full flex-1">
					<div className="flex-1 flex-col container rounded-lg overflow-hidden">
						<StreamerObsVideoControl streamId={streamId} />
					</div>
				</div>
			</LiveKitRoom>
			<StreamKey streamId={streamId} />
		</div>
	)
}

export default StreamerObsVideo;