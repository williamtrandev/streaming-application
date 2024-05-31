import React, { useEffect, useState, useRef } from 'react'
import MessageInput from './MessageInput';
import Message from './Message';
import APIClient from '../../utils/APIClient';

const messages = [
	{
		message: "Hey there! How's everything going on your end?"
	},
	{
		message: "Just wanted to say hi and see how you're doing!"
	},
	{
		message: "Hope your day is filled with joy and productivity!"
	},
	{
		message: "Sending positive vibes your way! Keep shining!"
	},
	{
		message: "Remember to take breaks and recharge when you need to!"
	},
	{
		message: "You're awesome, just thought you should know!"
	},
	{
		message: "Don't forget to celebrate even the smallest victories!"
	},
	{
		message: "Life's too short not to smile. 😊"
	},
	{
		message: "You're capable of amazing things. Keep pushing forward!"
	},
	{
		message: "Sending virtual high-fives your way! 🙌"
	}
];

function generateRandomMessage() {
	const randomMessageIndex = Math.floor(Math.random() * messages.length);
	const randomMessage = messages[randomMessageIndex].message;
	const names = ['An', 'Bình', 'Châu', 'Duy', 'Hải', 'Linh', 'Thành', 'Luân', 'Tiên', 'Thủy'];
	const randomIndex = Math.floor(Math.random() * names.length);
	const randomDisplayName = names[randomIndex];
	const currentTimestamp = Math.floor(Date.now() / 1000);

	const oneWeekAgoTimestamp = currentTimestamp - (7 * 24 * 60 * 60); 
	const rangeInSeconds = currentTimestamp - oneWeekAgoTimestamp;

	const randomSeconds = Math.floor(Math.random() * rangeInSeconds);
	const randomCreatedAt = oneWeekAgoTimestamp + randomSeconds;
	const randomPhotoURL = "https://source.unsplash.com/random"; 

	return {
		message: randomMessage,
		displayName: randomDisplayName,
		createdAt: randomCreatedAt,
		photoURL: randomPhotoURL
	};
}

const randomMessages = Array.from({ length: 10 }, () => generateRandomMessage());

const ChatBox = ({ socket, streamId }) => {
	const [msgs, setMsgs] = useState(randomMessages);
	const messagesEndRef = useRef(null);

	const handleMessageSubmit = async (msg) => {
		const newMessage = {
			message: msg,
			displayName: 'Tấn Thành',
			createdAt: Math.floor(Date.now() / 1000),
			photoURL: 'https://avatars.githubusercontent.com/u/102520170?v=4'
		};
		const updatedMsgs = [...msgs, newMessage];
		setMsgs(updatedMsgs);
		const response = await APIClient.post('/chat/message', {
			streamId: streamId,
			userId: '1',
			content: msg,
			duration: 0
		});
		console.log(response.data);
	};
	useEffect(() => {
		scrollToBottom();
	}, [msgs]);
	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	};

	return (
		<div className="w-full h-full bg-white dark:bg-boxdark rounded-md shadow-md space-y-2">
			<div className="font-semibold text-center border-b px-3 pt-3">Stream chat</div>
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
			<div className="px-3">
				<MessageInput onMessageSubmit={handleMessageSubmit} />
			</div>
			
		</div>

	)
}

export default ChatBox;