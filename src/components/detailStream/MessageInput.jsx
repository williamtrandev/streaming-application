import EmojiPicker from "emoji-picker-react";
import { Laugh, SendHorizonal } from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router-dom";

const MessageInput = ({ onMessageSubmit, isBanned=false }) => {
	const { conversationId } = useParams();
	const [inputText, setInputText] = useState("");
	const [showEmojiPicker, setShowEmojiPicker] = useState(false);
	const onEmojiPickerClick = (emojiData) => {
		setInputText((inputValue) => inputValue + emojiData.emoji);
	};

	const submitMessage = (e) => {
		if (inputText.trim() !== '') {
			onMessageSubmit(inputText);
			setInputText("");
		}
	};

	const handleKeyDown = (e) => {
		if (e.key === 'Enter' && inputText.trim() !== '') {
			onMessageSubmit(inputText);
			setInputText("");
		}
	};
	return (
		<div className="w-full h-10 self-end py-3 px-5 flex gap-2 justify-center items-center bg-gray-100 dark:bg-meta-4 rounded-lg">	
			<span className="relative w-full">
				{isBanned ? <div className="cursor-not-allowed text-purple-700">You've been banned from the chat</div>
				: <div className="flex space-x-4">
					<input
						className="w-full bg-transparent text-black focus:outline-none dark:text-white"
						placeholder="Type a message..."
						value={inputText}
						onChange={(e) => setInputText(e.target.value)}
						onKeyDown={handleKeyDown}
					/>
					<span className="flex gap-2">
						<Laugh className="w-5 cursor-pointer text-purple-600 relative"
							onClick={() => setShowEmojiPicker((previous) => !previous)} />
						{showEmojiPicker && (
							<div className="absolute right-0 bottom-10">
								<EmojiPicker className="z-[1000]" onEmojiClick={onEmojiPickerClick} />
							</div>
						)}
						<SendHorizonal className={`w-5 ${inputText !== '' ? 'text-purple-600 cursor-pointer' : 'text-secondary'}`} onClick={submitMessage} />

					</span>
				</div>}
			</span>
		</div>
	);
}

export default MessageInput;