import { useLocalParticipant, useParticipants } from "@livekit/components-react";
import { Track, createLocalTracks, createLocalScreenTracks, createLocalVideoTrack } from "livekit-client";
import { useCallback, useEffect, useRef, useState } from "react";
import { useStartStream } from "../../api/studio";
import { toast } from "react-toastify";
import ModalEndStream from "./ModalEndStream";
import { ScreenShare, ScreenShareOff, Users } from "lucide-react";
import { formatNumViewers } from "../../utils/formatNumber";
import { useSelector } from "react-redux";
import { selectSocket } from "../../redux/slices/socketSlice";
import { useUser } from "../../contexts/UserContext";
import { VRM, VRMLoaderPlugin } from "@pixiv/three-vrm";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Holistic } from "@mediapipe/holistic";
import { Vector3 } from "three";
import { animateVRM } from "./ringing";
import useResizeObserver from "use-resize-observer";
import { lightmode, model } from "../../assets";


const StreamerVideoControl = ({ streamId, setIsStream }) => {
	const { setIsLiveStreaming, setGlobalStreamId, setGlobalEgressId } = useUser(); 
	const [videoTrack, setVideoTrack] = useState();
	const [audioTrack, setAudioTrack] = useState();
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
	const [canvasStream, setCavasStream] = useState(null);
	const canvasRef = useRef(null);
	const resizeRef = useRef(null);
	const sceneRef = useRef(null);
	const clockRef = useRef(new THREE.Clock());
	const vrmRef = useRef(null);
	const rendererRef = useRef(null);
	const cameraRef = useRef(null);
	const canvasStreamRef = useRef(null);
	const loader = useRef(new GLTFLoader());
	const holistic = useRef(
		new Holistic({
			locateFile: (file) => {
				return `https://cdn.jsdelivr.net/npm/@mediapipe/holistic@0.5.1675471629/${file}`;
			},
		})
	);
	const size = useResizeObserver({ ref: resizeRef });

	const inferenceLoop = useRef(async () => {
		try {
			await holistic.current.send({ image: previewVideoEl.current });
		} catch (e) {
			console.error("Error in holistic:", e);
			// Reset holistic
			holistic.current = new Holistic({
				locateFile: (file) => {
					return `https://cdn.jsdelivr.net/npm/@mediapipe/holistic@0.5.1675471629/${file}`;
				},
			});
			setupHolistic.current();
		}
		setTimeout(inferenceLoop.current, 1000 / 30);
	});

	const animate = useRef(() => {
		requestAnimationFrame(animate.current);
		if (vrmRef.current) {
			vrmRef.current.update(clockRef.current.getDelta());
		}
		rendererRef.current?.render(sceneRef.current, cameraRef.current);
	});

	const setupThreeJS = useCallback(() => {
		if (!canvasRef.current) return; // Shouldn't ever happen
		if (sceneRef.current) return; // Already setup
		if (!size.width || !size.height) return;

		loader.current.register((parser) => {
			return new VRMLoaderPlugin(parser);
		});

		sceneRef.current = new THREE.Scene();
		rendererRef.current = new THREE.WebGLRenderer({
			canvas: canvasRef.current,
		});
		cameraRef.current = new THREE.PerspectiveCamera(
			45,
			size.width / size.height,
			0.1,
			1000
		);
		cameraRef.current.position.z = 1;
		cameraRef.current.position.y = 1;
		cameraRef.current.rotation.set(0.0, 0, 0.0);
		const light = new THREE.AmbientLight(0xffffff); // soft white light
		sceneRef.current.add(light);

		loader.current.load(model, (gltf) => {
			const vrm = gltf.userData.vrm;
			vrmRef.current = vrm;
			sceneRef.current?.add(vrm.scene);
			const target = new THREE.Vector3(0, 0, 0);
			vrm.humanoid.humanBones.head.node.getWorldPosition(target);
			cameraRef.current.position.y = target.y;
			var bgTexture = new THREE.TextureLoader().load(lightmode);
			var material = new THREE.SpriteMaterial({
				map: bgTexture,
				color: 0xffffff,
			});
			var sprite = new THREE.Sprite(material);
			sprite.scale.set(10, 7, 7);
			sprite.position.set(0, 1, -5);
			sceneRef.current?.add(sprite);
		});
	}, [size.height, size.width]);

	useEffect(() => {
		if (!canvasRef.current) return;
		if (!cameraRef.current) return;
		if (!size.width || !size.height) return;
		canvasRef.current.width = size.width + 1; // prevent pixel line on right
		canvasRef.current.height = size.height;
		rendererRef.current?.setSize(size.width, size.height);
		cameraRef.current.aspect = size.width / size.height;
		cameraRef.current.updateProjectionMatrix();
	}, [size, size.height, size.width]);

	useEffect(() => {
		console.log("CANVASS", canvasStream)

		if (!canvasRef.current) return;
		if (canvasStreamRef.current) return;
		canvasStreamRef.current = canvasRef.current.captureStream(60);
		setCavasStream(canvasStreamRef.current);
	}, [setCavasStream]);

	const setupHolistic = useRef(() => {
		holistic.current.setOptions({
			refineFaceLandmarks: true,
		});
		holistic.current.onResults((results) => {
			if (!vrmRef.current) return;
			animateVRM(vrmRef.current, results, previewVideoEl.current);
		});
	});
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
			socket.emit('endStream');
		};
	}, [streamId]);
	useEffect(() => {
		createLocalVideoTrack({
			facingMode: "environment",
			resolution: { width: 320, height: 240, frameRate: 10 },
		}).then((t) => {
			t.attach(previewVideoEl.current);
			setupHolistic.current();
			inferenceLoop.current();
			animate.current();
		});
	}, []);
	useEffect(setupThreeJS, [setupThreeJS]);
	
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
			<div className="aspect-video rounded-lg overflow-hidden" ref={resizeRef}>
				<canvas
					width={size.width}
					height={size.height}
					className="h-full w-full"
					ref={canvasRef}
				/>
				<video ref={previewVideoEl} width="100%" height="100%" className="rounded-lg"/>
			</div>
			<div className="flex w-full justify-center items-center gap-4">
				<div className="rounded-full w-10 h-10 bg-purple-500 flex items-center justify-center cursor-pointer">
					{!isScreenSharing 
						? <ScreenShare className="w-5 h-5" onClick={startScreenShare} />
						: <ScreenShareOff className="w-5 h-5" onClick={stopScreenShare} />
					}
				</div>
				<div className="rounded-full w-10 h-10 bg-purple-500 flex items-center justify-center cursor-pointer">
					{!isScreenSharing
						? <ScreenShare className="w-5 h-5" onClick={startScreenShare} />
						: <ScreenShareOff className="w-5 h-5" onClick={stopScreenShare} />
					}
				</div>
			</div>
			<ModalEndStream open={open} setOpen={setOpen} streamId={streamId} egressId={egressId} />
		</div>
	)
}

export default StreamerVideoControl