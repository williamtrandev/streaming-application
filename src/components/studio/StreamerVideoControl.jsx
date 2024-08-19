import { useLocalParticipant, useParticipants } from "@livekit/components-react";
import { Track, createLocalTracks, createLocalScreenTracks, createLocalVideoTrack } from "livekit-client";
import { useCallback, useEffect, useRef, useState } from "react";
import { useStartStream } from "../../api/studio";
import { toast } from "react-toastify";
import ModalEndStream from "./ModalEndStream";
import { ReceiptRussianRuble, ScreenShare, ScreenShareOff, Users, WandSparkles, OctagonAlert, X } from "lucide-react";
import { formatNumViewers } from "../../utils/formatNumber";
import { useSelector } from "react-redux";
import { selectSocket } from "../../redux/slices/socketSlice";
import { useUser } from "../../contexts/UserContext";
import { Popover, Tooltip } from "antd";
import VirtualCamera from "./VirtualCamera";
import { hinata, william } from "../../assets";
import { useBlocker } from "react-router-dom";
import { Modal } from "antd";
import CryptoJS from 'crypto-js';


const Content = ({ selectedCharacter, onSelectCharacter }) => (
    <div className="flex gap-3 items-center justify-center">
		<div className="flex flex-col gap-2 items-center justify-center">
			<img
			src={william}
			alt=""
			className={`w-15 h-15 rounded-lg cursor-pointer object-cover ${selectedCharacter === 'william' ? 'border-4 border-blue-700' : ''}`}
			onClick={() => onSelectCharacter('william')} 
			/>
			William
		</div>
		<div className="flex flex-col gap-2 items-center justify-center">
			<img
			src={hinata}
			alt=""
			className={`w-15 h-15 rounded-lg cursor-pointer object-cover ${selectedCharacter === 'hinata' ? 'border-4 border-blue-700' : ''}`}
			onClick={() => onSelectCharacter('hinata')}
			/>
				Hinata
		</div>
    </div>
);
const StreamerVideoControl = ({ streamId, setIsStream }) => {
	const { setIsLiveStreaming, setGlobalStreamId, setGlobalEgressId } = useUser();
	const [videoTrack, setVideoTrack] = useState();
	const [audioTrack, setAudioTrack] = useState();
	const [canvasTrack, setCanvasTrack] = useState();
	const [screenTrack, setScreenTrack] = useState();
	const [isScreenSharing, setIsScreenSharing] = useState(false);
	const [isPublishing, setIsPublishing] = useState(false);
	const [isUnpublishing, setIsUnpublishing] = useState(false);
	const [egressId, setEgressId] = useState(null);
	const previewVideoEl = useRef(null);
	const { localParticipant } = useLocalParticipant();
	const { mutate: startStream, isSuccess: isStartStreamSuccess, isError: isStartStreamError, data: startStreamData } = useStartStream();
	const socket = useSelector(selectSocket);
	const [open, setOpen] = useState(false);
	const [numViewers, setNumViewers] = useState(0);
	const [startTime, setStartTime] = useState(null);
	const [currentTime, setCurrentTime] = useState(Date.now());
	const [isCosplay, setIsCosplay] = useState(false);
	const [canvasStream, setCanvasStream] = useState(null);
	const [selectedCharacter, setSelectedCharacter] = useState(null);
	const [showWarnPopUp, setShowWarnPopUp] = useState(false);
	const [isStreamEnd, setIsStreamEnd] = useState(false);
	const [recordedChunks, setRecordedChunks] = useState([]);
	const [isRecording, setIsRecording] = useState(true);

	const handleSelectCharacter = useCallback((character) => {
		if (selectedCharacter === character) {
			setIsCosplay(false);
			setSelectedCharacter(null);
		} else {
			setSelectedCharacter(character);
			setIsCosplay(true);
		}
	}, [selectedCharacter]);
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
			if(canvasTrack) {
				localParticipant.publishTrack(canvasTrack);
			}
			startStream(streamId);
			setIsPublishing(true);
		}
	}, [audioTrack, isPublishing, localParticipant, videoTrack, egressId]);
	const getElapsedTime = (start, end) => {
		const elapsed = end - start;
		const seconds = Math.floor((elapsed / 1000) % 60);
		const minutes = Math.floor((elapsed / (1000 * 60)) % 60);
		const hours = Math.floor((elapsed / (1000 * 60 * 60)) % 24);

		return `${hours > 0 ? `${hours}h ` : ''}${minutes}m ${seconds}s`;
	};
	const createTracks = async () => {
		const tracks = await createLocalTracks({ audio: true, video: true });
		tracks.forEach((track) => {
			switch (track.kind) {
				case Track.Kind.Video: {
					if (previewVideoEl?.current) {
						track.attach(previewVideoEl.current);
						// setupHolistic.current();
						// inferenceLoop.current();
						// animate.current();
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
	const startScreenShare = async () => {
		if (localParticipant) {
			try {
				const screenTracks = await createLocalScreenTracks();
				const screenTrackLocal = screenTracks[0];
				if(screenTrackLocal) {
					localParticipant.publishTrack(screenTrackLocal);
					setScreenTrack(screenTrackLocal);
					screenTrackLocal.mediaStreamTrack.onended = () => {
						console.log('Screen share stopped by the user');
						stopScreenShare();
					};
					if (previewVideoEl?.current) {
						screenTrackLocal.attach(previewVideoEl.current);
						localParticipant.unpublishTrack(videoTrack);
						videoTrack?.stop();
						setIsScreenSharing(true);
					}
				}
			} catch (error) {
				console.error("Error starting screen share:", error);
			}
		}
	};

	const blocker = useBlocker(
		({ currentLocation, nextLocation }) =>
			isPublishing &&
			currentLocation.pathname !== nextLocation.pathname
	);

	useEffect(() => {
		if (blocker) {
			setShowWarnPopUp(blocker.state === "blocked");
		}
	}, [blocker]);

	const stopScreenShare = async () => {
		if (localParticipant) {
			if(screenTrack) {
				localParticipant.unpublishTrack(screenTrack);
				screenTrack.stop();
			}
			setIsScreenSharing(false);
			const tracks = await createLocalTracks({ audio: true, video: true });
			var videoTrackLocal;
			var audioTrackLocal;
			tracks.forEach((track) => {
				switch (track.kind) {
					case Track.Kind.Video: {
						if (previewVideoEl?.current) {
							track.attach(previewVideoEl.current);
						}
						videoTrackLocal = track;
						break;
					}
					case Track.Kind.Audio: {
						audioTrackLocal = track;
						break;
					}
				}
			});
			if (videoTrackLocal) {
				localParticipant.publishTrack(videoTrackLocal);
			}
			if (audioTrackLocal) {
				localParticipant.publishTrack(audioTrackLocal);
			}
		}
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
			if (startStreamData) {
				setIsLiveStreaming(true);
				setGlobalStreamId(streamId);
				setGlobalEgressId(startStreamData.egressId);
				setEgressId(startStreamData.egressId);
				socket.emit('startStream', { streamId: streamId, egressId: startStreamData.egressId });
			}
		}
		if (isStartStreamError) {
			toast.error("Starting streaming failed");
		}
	}, [isStartStreamSuccess, isStartStreamError])

	
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
			socket.emit('endStream');
		};
	}, [streamId]);
	
	useEffect(() => {
		const handleTracks = async () => {
			if (isCosplay == null) return;
			if (!localParticipant) return;
			if (!canvasStream) return;

			if (isCosplay) {
				if (videoTrack) {
					localParticipant.unpublishTrack(videoTrack);
					videoTrack.stop();
				}
				const track = canvasStream.getTracks()[0];
				setCanvasTrack(track);
				localParticipant.publishTrack(track);
			} else {
				localParticipant.unpublishTrack(canvasTrack);
				const tracks = await createLocalTracks({ audio: true, video: true });
				// Cập nhật logic khi tạo và publish các tracks
				let videoTrackLocal = null;
				let audioTrackLocal = null;
				tracks.forEach((track) => {
					switch (track.kind) {
						case Track.Kind.Video: {
							if (previewVideoEl?.current) {
								track.attach(previewVideoEl.current);
							}
							videoTrackLocal = track;
							break;
						}
						case Track.Kind.Audio: {
							audioTrackLocal = track;
							break;
						}
					}
				});

				if (videoTrackLocal) {
					localParticipant.publishTrack(videoTrackLocal);
				}
				if (audioTrackLocal) {
					localParticipant.publishTrack(audioTrackLocal);
				}
			}
		};

		handleTracks();
	}, [isCosplay, localParticipant, canvasStream]);
	useEffect(() => {
		if (isStreamEnd && localParticipant) {
			// Unpublish video and camera tracks
			if (videoTrack) {
				localParticipant.unpublishTrack(videoTrack);
				videoTrack.stop();
				setVideoTrack(null); // Xóa track video khỏi state
			}
			if (canvasTrack) {
				localParticipant.unpublishTrack(canvasTrack);
				canvasTrack.stop();
				setCanvasTrack(null); // Xóa track canvas khỏi state
			}
			if (audioTrack) {
				localParticipant.unpublishTrack(audioTrack);
				audioTrack.stop();
				setAudioTrack(null); // Xóa track audio khỏi state
			}
		}
	}, [isStreamEnd, localParticipant, videoTrack, canvasTrack, audioTrack]);
	const mediaRecorderRef = useRef(null);
	const intervalIdRef = useRef(null);

	const defaultOptions = {
		host: 'identify-ap-southeast-1.acrcloud.com',
		endpoint: '/v1/identify',
		signature_version: '1',
		data_type: 'audio',
		secure: true,
		access_key: '3e59aaa51fb94b8fcf436c46501acbc7',
		access_secret: '8eFLthoPQVTu1hXv7YxdhhrO0TqErySybPM8ok82'
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
			const result = await response.json();
			console.log(result);
		} catch (error) {
			setError('Error: ' + error.message);
		}
	};

	const startRecording = async () => {
		try {
			// const stream = audioTrack.mediaStream;
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
			}, 20000); // 20 seconds interval
		} catch (error) {
			setError('Error: ' + error.message);
		}
	};
	useEffect(() => {
		if(audioTrack) {
			startRecording();
		}
	}, [audioTrack])
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
							disabled={isStreamEnd}
						>
							{isStreamEnd ? "Stream ended" : "Start stream"}
						</button>
					)}
				</div>
			</div>
			{isCosplay ? 
				<VirtualCamera selectedCharacter={selectedCharacter} setCanvasStream={setCanvasStream} /> 
				: 
				<div className="aspect-video rounded-lg overflow-hidden">
					<video ref={previewVideoEl} width="100%" height="100%" className="rounded-lg"/>
				</div>
			}
			<div className="flex w-full justify-center items-center gap-4">
				{!selectedCharacter &&
					<Tooltip title={!isScreenSharing ? "Start Screen Share" : "Stop Screen Share"}>
						<div className="rounded-full w-10 h-10 bg-purple-500 flex items-center justify-center cursor-pointer">
							{!isScreenSharing 
								? <ScreenShare className="w-5 h-5" onClick={startScreenShare} />
								: <ScreenShareOff className="w-5 h-5" onClick={stopScreenShare} />
							}
						</div>
					</Tooltip>
				}
				{!isScreenSharing && 
					<Tooltip title="Cosplay">
						<Popover 
							content={<Content selectedCharacter={selectedCharacter} onSelectCharacter={handleSelectCharacter} />} 
							title="Select a character" 
							trigger="click"
						>
							<div className="rounded-full w-10 h-10 bg-purple-500 flex items-center justify-center cursor-pointer">
								<WandSparkles className="w-5 h-5" />
							</div>
						</Popover>
					</Tooltip>
				}
			</div>
			<ModalEndStream open={open} setOpen={setOpen} streamId={streamId} egressId={egressId} 
				setIsStreaming={setIsPublishing} setIsStreamEnd={setIsStreamEnd} 
			/>
			<Modal
				className='bg-slate-100 dark:bg-slate-600 rounded-lg dark:text-slate-200'
				centered
				open={showWarnPopUp}
				okText={"End stream and leave"}
				onCancel={() => setShowWarnPopUp(false)}
				closeIcon={<X className="dark:text-slate-200" />}
				footer={null}
			>
				<div className="flex gap-3">
					<OctagonAlert size={32} className="text-yellow-500" />
					<div className='h-full'>
						<p className="text-lg font-semibold mb-2">Your stream still live!</p>
						<p className="">You must stop streaming before leaving this page.</p>
					</div>
				</div>
			</Modal>
		</div>
	)
}

export default StreamerVideoControl;