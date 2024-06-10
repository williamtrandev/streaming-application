import { useLocalParticipant } from "@livekit/components-react";
import { Track, createLocalTracks } from "livekit-client";
import { useCallback, useEffect, useRef, useState } from "react";

const StreamerVideoControl = ({ streamId, setIsStream }) => {
	const [videoTrack, setVideoTrack] = useState();
	const [audioTrack, setAudioTrack] = useState();
	const [isPublishing, setIsPublishing] = useState(false);
	const [isUnpublishing, setIsUnpublishing] = useState(false);
	const previewVideoEl = useRef(null);

	const { localParticipant } = useLocalParticipant();

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

	const togglePublishing = useCallback(async () => {
		if (isPublishing && localParticipant) {
			setIsUnpublishing(true);

			if (videoTrack) {
				console.log(localParticipant)
				localParticipant.unpublishTrack(videoTrack);
			}
			if (audioTrack) {
				localParticipant.unpublishTrack(audioTrack);
			}

			await createTracks();

			setTimeout(() => {
				setIsUnpublishing(false);
			}, 2000);
		} else if (localParticipant) {
			if (videoTrack) {
				void localParticipant.publishTrack(videoTrack);
			}
			if (audioTrack) {
				void localParticipant.publishTrack(audioTrack);
			}
		}

		setIsPublishing((prev) => !prev);
	}, [audioTrack, isPublishing, localParticipant, videoTrack]);

	return (
		<div className="flex flex-col gap-4 px-4 py-2 max-h-[80vh] bg-meta-4 rounded-lg">
			<div className="flex items-center justify-between">
				<div className="flex gap-[5px] text-lg font-bold">
					{isPublishing && !isUnpublishing ? (
						<div className="flex items-center gap-1">
							<span className="relative mr-1 flex h-3 w-3">
								<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
								<span className="relative inline-flex h-3 w-3 rounded-full bg-red-500"></span>
							</span>
							LIVE
						</div>
					) : (
						"Ready to stream"
					)}{" "}
					with id{" "}
					<div className="italic text-purple-500 dark:text-purple-300">
						{streamId}
					</div>
				</div>
				<div className="flex gap-2">
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
		</div>
	)
}

export default StreamerVideoControl