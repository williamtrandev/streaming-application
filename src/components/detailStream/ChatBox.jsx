import React, { useEffect, useState, useRef } from 'react'
import MessageInput from './MessageInput';
import Message from './Message';
import { useSendMessage, useGetMessages } from '../../api/chat';
import { useAuth } from '../../contexts/AuthContext';
import { useUser } from '../../contexts/UserContext';

const ChatBox = ({ streamId, socket, streamFinished, isStreamer=false }) => {

	const [msgs, setMsgs] = useState([]);
	const messagesEndRef = useRef(null);
	const { auth } = useAuth();
	const { authFullname, authProfilePicture } = useUser();
	const userId = auth?.user?._id;
	const { mutate: sendMessage, isError, isSuccess, error, data } = useSendMessage();

	const { data: messagesData } = useGetMessages(streamId);
	useEffect(() => {
		if (messagesData) {
			console.log(messagesData);
			setMsgs(messagesData.messages);
		}
	}, [messagesData]);
	useEffect(() => {
		if (socket) {
			socket.on('newMessage', (data) => {
				setMsgs((prevMsgs) => {
					const newMessage = {
						content: data?.content,
						user: data?.user,
						createdAt: new Date(Date.now()).toISOString(),
						isStreamer: data?.isStreamer
					};
					return [...prevMsgs, newMessage];
				});
				console.log(msgs)
			});

			return () => {
				socket.off('newMessage');
			};
		}
	}, [socket]);
	const handleMessageSubmit = async (msg) => {
		const baseMsg = {
			streamId: streamId,
			content: msg,
			duration: '0',
			isStreamer: isStreamer,
		}
		const msgSend = {
			userId: userId, 
			...baseMsg
		}
		const msgSendSocket = {
			...baseMsg,
			user: {
				fullname: authFullname,
				profilePicture: authProfilePicture
			},
		}
		sendMessage(msgSend);
		socket.emit("sendMessage", msgSendSocket);
	};
	useEffect(() => {
		scrollToBottom();
	}, [msgs]);
	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	};
	
	return (
		<div className="w-full h-full bg-white dark:bg-boxdark rounded-md shadow-md space-y-2">
			<div className="font-semibold text-center border-b px-3 pt-3">Live chat</div>
			<div className="flex flex-col gap-4 pl-3 overflow-auto h-[calc(100%-6.55rem)]">
				{msgs.map((message, index) => {
					return (
						<div key={index}>
							<div className="flex items-center justify-start">
								<div className="break-words p-2 text-sm">
									<Message msg={message}/>
								</div>
							</div>
						</div>
					);
				})}
				<div ref={messagesEndRef}></div>
			</div>
			{(userId && !streamFinished) &&
				<div className="px-3">
					<MessageInput onMessageSubmit={handleMessageSubmit} />
				</div>
			}
		</div>

	)
}

export default ChatBox;