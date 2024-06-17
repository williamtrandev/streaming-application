import '@livekit/components-styles';
import StreamerVideoControl from './StreamerVideoControl';
import { useState, useEffect } from 'react';
import { LiveKitRoom, ControlBar } from "@livekit/components-react";
import { jwtDecode } from "jwt-decode";
import { useGenerateStreamerToken } from '../../api/studio';

const StreamerVideo = ({ streamId, setIsStream }) => {
	const [streamerToken, setStreamerToken] = useState("");
	const { mutate, isSuccess, data } = useGenerateStreamerToken();
	useEffect(() => {
		const getOrCreateStreamerToken = async () => {
			if (!streamId) return;
			const SESSION_STREAMER_TOKEN_KEY = `${streamId}-streamer-token`;
			const sessionToken = sessionStorage.getItem(SESSION_STREAMER_TOKEN_KEY);

			if (sessionToken) {
				const payload = jwtDecode(sessionToken);

				if (payload.exp) {
					const expiry = new Date(payload.exp * 1000);
					if (expiry < new Date()) {
						sessionStorage.removeItem(SESSION_STREAMER_TOKEN_KEY);
						// const token = await generateStreamerToken(streamId);
						// setStreamerToken(token);
						// sessionStorage.setItem(SESSION_STREAMER_TOKEN_KEY, token);
						mutate({ streamId });
						return;
					}
				}

				setStreamerToken(sessionToken);
			} else {
				mutate({ streamId });
				// const token = await generateStreamerToken(streamId);
				// setStreamerToken(token);
				// sessionStorage.setItem(SESSION_STREAMER_TOKEN_KEY, token);
			}
		};
		getOrCreateStreamerToken();
	}, [streamId]);

	useEffect(() => {
		if (data) {
			const SESSION_STREAMER_TOKEN_KEY = `${streamId}-streamer-token`;
			setStreamerToken(data.token);
			sessionStorage.setItem(SESSION_STREAMER_TOKEN_KEY, data.token);
		}
	}, [isSuccess]);

	return (
		<div className="h-[80vh] w-full">
			{streamerToken && <LiveKitRoom
				token={streamerToken}
				serverUrl={import.meta.env.VITE_LIVEKIT_SERVER_URL}
				data-lk-theme="default"
				className='rounded-md relative'
			>
				<StreamerVideoControl streamId={streamId} setIsStream={setIsStream} />
			</LiveKitRoom>}
		</div>
	)
}

export default StreamerVideo;