import { Track } from 'livekit-client';
import '@livekit/components-styles';
import {
	ControlBar,
	CarouselLayout,
	LiveKitRoom,
	ParticipantTile,
	RoomAudioRenderer,
	VideoConference,
	useTracks,
	VideoTrack,
	TrackRefContext
} from '@livekit/components-react';

const MyVideoConference = () => {
	const tracks = useTracks(
		[
			{ source: Track.Source.Camera, withPlaceholder: true },
			{ source: Track.Source.ScreenShare, withPlaceholder: false },
		],
		{ onlySubscribed: false },
	);
	return (
		<CarouselLayout className="h-full overflow-auto" tracks={tracks} orientation="horizontal" >
			<ParticipantTile className="h-full" />
		</CarouselLayout>
	);
}


const VideoPreview = ({ startWithCam, token }) => {
	return (
		<div className="h-[80%] w-full">
			{startWithCam ? <LiveKitRoom
				video={true}
				audio={true}
				token={token}
				serverUrl={import.meta.env.VITE_LIVEKIT_SERVER_URL}
				data-lk-theme="default"
				className='rounded-md !aspect-video relative'
			>
				<MyVideoConference />
				<ControlBar className="absolute bottom-0 left-1/2 -translate-x-1/2" 
					variation='minimal'
				/>
			</LiveKitRoom> : <div className="w-full bg-black h-full"></div>}
		</div>
	)
}

export default VideoPreview;