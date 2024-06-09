import { AccessToken } from "livekit-server-sdk";

const generateStreamerToken = async (streamId) => {
	const token = new AccessToken(
		import.meta.env.VITE_LIVEKIT_API_KEY,
		import.meta.env.VITE_LIVEKIT_API_SECRET,
		{
			identity: streamId,
		}
	);
	token.addGrant({
		room: streamId,
		roomJoin: true,
		canPublish: true,
		canPublishData: true,
	});
	return await token.toJwt();
}

const generateViewerToken = async (streamId, userId) => {
	const token = new AccessToken(
		import.meta.env.VITE_LIVEKIT_API_KEY,
		import.meta.env.VITE_LIVEKIT_API_SECRET,
		{
			identity: userId,
		}
	);

	token.addGrant({
		room: streamId,
		roomJoin: true,
		canPublish: false,
		canPublishData: true,
	});
	return await token.toJwt();
}

const connectionStateMapping = (connectionState) => {
	switch (connectionState) {
		case "connected":
			return "Connected!";
		case "connecting":
			return "Connecting...";
		case "disconnected":
			return "Disconnected";
		case "reconnecting":
			return "Reconnecting";
		default:
			return "Unknown";
	}
}

export {
	generateStreamerToken,
	generateViewerToken,
	connectionStateMapping
}