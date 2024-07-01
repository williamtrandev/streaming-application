import { formatRelative, parseISO } from 'date-fns';
import { Atom, Crown } from 'lucide-react';
import ModalBanViewer from './ModalBanViewer';
import { useState } from 'react';

function formatDate(date) {
	let formattedDate = '';

	if (date) {
		formattedDate = formatRelative(parseISO(date), new Date());

		formattedDate =
			formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
	}

	return formattedDate;
}
const Message = ({msg, isMod=false, streamId}) => {
	const { content, user, createdAt, isStreamer } = msg;
	const [open, setOpen] = useState(false);
	return (
		<>
			<div className={`space-y-2 ${isStreamer ? 'text-purple-700' : ''}`}>
				<div className="flex items-center space-x-3">
					{isMod && !isStreamer ? <img
						src={user?.profilePictureS3} alt=""
						className="w-6 h-6 rounded-full cursor-pointer"
						onClick={() => setOpen(true)}
					/> : <img
						src={user?.profilePictureS3} alt=""
						className="w-6 h-6 rounded-full"
					/>}
					
					<div className="flex space-x-2 items-center">
						<p className='font-bold'>{user?.fullname}</p>
						{isStreamer && <Crown className="w-4 h-4"/>}
						<p className='text-xs'>
							{formatDate(createdAt)}
						</p>
					</div>
				</div>
				<p className='text-md'>{content}</p>
			</div>
			<ModalBanViewer 
				open={open} 
				setOpen={setOpen} 
				userId={user._id} 
				username={user.fullname} 
				streamId={streamId} 
			/>
		</>
	);
}
export default Message;
