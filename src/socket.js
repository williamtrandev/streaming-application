import io from "socket.io-client"; 

let socket;

const connectSocket = () => {
	if (!socket) {
		socket = io(import.meta.env.VITE_SOCKET_HOST); 
		console.log("Socket initialized:", socket); 
	}
	return socket;
}

export { socket, connectSocket };