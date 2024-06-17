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
	connectionStateMapping
}