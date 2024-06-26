import { useLocalParticipant, useParticipants } from "@livekit/components-react";
import { Track, createLocalTracks } from "livekit-client";
import { useCallback, useEffect, useRef, useState } from "react";
import { useStartStream } from "../../api/studio";
import { toast } from "react-toastify";
import ModalEndStream from "./ModalEndStream";
import { Users } from "lucide-react";
import { formatNumViewers } from "../../utils/formatNumber";
import { useSelector } from "react-redux";
import { selectSocket } from "../../redux/slices/socketSlice";

const StreamerVideoControl = ({ streamId, setIsStream }) => {
	const [videoTrack, setVideoTrack] = useState();
	const [audioTrack, setAudioTrack] = useState();
	const [isPublishing, setIsPublishing] = useState(false);
	const [isUnpublishing, setIsUnpublishing] = useState(false);
	const [egressId, setEgressId] = useState(null);
	const previewVideoEl = useRef(null);
	const { localParticipant } = useLocalParticipant();
	const { mutate: startStream, isSuccess: isStartStreamSuccess, isError: isStartStreamError, data: startStreamData } = useStartStream();
	const socket = useSelector(selectSocket);
	const [open, setOpen] = useState(false);
	const [numViewers, setNumViewers] = useState(0);
	const createTracks = async () => {
		const tracks = await createLocalTracks({ audio: true, video: true });
		tracks.forEach((track) => {
			switch (track.kind) {
				case Track.Kind.Video: {
					if (previewVideoEl?.current) {
						track.attach(previewVideoEl.current);
					}
					setVideoTrack(track);
					break;
				}
				case Track.Kind.Audio: {
					setAudioTrack(track);
					break;
				}
			}
		});
	};

	useEffect(() => {
		createTracks();
	}, []);

	useEffect(() => {
		return () => {
			console.log("Stopping tracks:", { videoTrack, audioTrack });
			videoTrack?.stop();
			audioTrack?.stop();
		};
	}, [videoTrack, audioTrack]);

	useEffect(() => {
		if (isStartStreamSuccess) {
			console.log(startStreamData)
			if (startStreamData && startStreamData.egressId) {
				setEgressId(startStreamData.egressId);
			} 
		}	
		if(isStartStreamError) {
			toast.error("Starting streaming failed");
		}
	}, [isStartStreamSuccess, isStartStreamError]) 

	const togglePublishing = useCallback(async () => {
		if (isPublishing && localParticipant) {
			console.log(egressId);
			// if (egressId) {
			// 	setOpen(true);
			// } 
			setOpen(true);

		} else if (localParticipant) {
			if (videoTrack) {
				localParticipant.publishTrack(videoTrack);
			}
			if (audioTrack) {
				localParticipant.publishTrack(audioTrack);
			}
			startStream(streamId);
			setIsPublishing(true);
		}
	}, [audioTrack, isPublishing, localParticipant, videoTrack, egressId]);
	const [startTime, setStartTime] = useState(null);
	const [currentTime, setCurrentTime] = useState(Date.now());

	useEffect(() => {
		let timer;
		if (isPublishing && !isUnpublishing) {
			setStartTime(Date.now());
			timer = setInterval(() => {
				setCurrentTime(Date.now());
			}, 1000);
		} else {
			clearInterval(timer);
			setStartTime(null);
		}
		return () => clearInterval(timer);
	}, [isPublishing, isUnpublishing]);

	const getElapsedTime = (start, end) => {
		const elapsed = end - start;
		const seconds = Math.floor((elapsed / 1000) % 60);
		const minutes = Math.floor((elapsed / (1000 * 60)) % 60);
		const hours = Math.floor((elapsed / (1000 * 60 * 60)) % 24);

		return `${hours > 0 ? `${hours}h ` : ''}${minutes}m ${seconds}s`;
	};
	useEffect(() => {
		socket.emit('joinRoom', streamId);
		socket.on('updateViewers', (data) => {
			if (data.streamId === streamId) {
				console.log(data)
				setNumViewers(data.viewers);
			}
		});

		return () => {
			socket.emit('leaveStream', streamId);
		};
	}, [streamId]);
	return (
		<div className="flex flex-col justify-center gap-4 px-4 py-2 h-full bg-meta-4 rounded-lg">
			<div className="flex items-center justify-between">
				<div className="flex gap-[5px] text-lg font-bold">
					{isPublishing && !isUnpublishing ? (
						<div className="flex items-center gap-1">
							<span className="relative mr-1 flex h-3 w-3">
								<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
								<span className="relative inline-flex h-3 w-3 rounded-full bg-red-500"></span>
							</span>
							<div>LIVE 
								<span className="ml-3 italic text-purple-500">
									{getElapsedTime(startTime, currentTime)}
								</span>
							</div>
						</div>
					) : (
						"Ready to stream"
					)}
				</div>
				<div className="flex gap-2 items-center space-x-3">
					<div className="flex items-center space-x-2">
						<Users className="w-5 h-5 ml-3 italic text-purple-500" />
						<p>{formatNumViewers(numViewers)}</p>
					</div>

					{isPublishing ? (
						<button
							className="bg-red-600 hover:bg-red-700 p-2 rounded-lg"
							onClick={togglePublishing}
							disabled={isUnpublishing}
						>
							{isUnpublishing ? "Stopping..." : "Stop stream"}
						</button>
					) : (
						<button
							onClick={togglePublishing}
							className="animate-pulse p-2 bg-purple-600 rounded-lg"
						>
							Start stream
						</button>
					)}
				</div>
			</div>
			<div className="aspect-video rounded-lg overflow-hidden">
				<video ref={previewVideoEl} width="100%" height="100%" />
			</div>
			<ModalEndStream open={open} setOpen={setOpen} streamId={streamId} egressId={egressId} />
		</div>
	)
}

export default StreamerVideoControl