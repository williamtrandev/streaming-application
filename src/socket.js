import io from "socket.io-client"; 

let socket;

const connectSocket = () => {
	if (!socket) {
		socket = io("http://localhost:3000"); 
		console.log("Socket initialized:", socket); 
	}
	return socket;
}

export { socket, connectSocket };