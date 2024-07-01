import { useState, useEffect } from 'react'
import { Modal, Button } from 'antd';
import { useBanViewer } from '../../api/studio';
import { useSelector } from 'react-redux';
import { selectSocket } from '../../redux/slices/socketSlice';

const ModalBanViewer = ({ open, setOpen, username, userId, streamId }) => {
	const [confirmLoading, setConfirmLoading] = useState(false);
	const { mutate: banWatch, isSuccess: isBanSuccess, isError: isBanError } = useBanViewer();
	const socket = useSelector(selectSocket);
	const handleBanChat = async () => {
		setOpen(false);
		const data = {
			bannedId: userId,
			streamId: streamId,
			typeBanned: 'chat'
		}
		console.log(socket)
		socket.emit('bannedChat', userId, streamId);
		banWatch(data);
	}
	const handleBanWatch = async () => {
		setOpen(false);
		const data = {
			bannedId: userId, 
			streamId: streamId,
			typeBanned: 'watch'
		}
		console.log(socket)
		socket.emit('banned', userId, streamId);
		banWatch(data);
	}
	return (
		<Modal
			className='bg-slate-100 dark:bg-slate-600 rounded-lg dark:text-slate-200'
			centered
			open={open}
			okButtonProps={{ className: 'bg-purple-600 hover:!bg-purple-700' }}
			okText="Chat"
			onOk={handleBanChat}
			closable={false}
			confirmLoading={confirmLoading}
			onCancel={() => setOpen(false)}
			footer={(_, { OkBtn, CancelBtn }) => (
				<>
					<Button className='bg-orange-500 hover:!bg-orange-600 !text-white' onClick={handleBanWatch}>Watch</Button>
					<OkBtn />
					<CancelBtn />
				</>
			)}
		>
			<div className='h-full'>
				<p className="text-lg font-semibold mb-2">Ban Chat/Watch Stream</p>
				<p className="text-sm">Are you sure you want to ban this user: {username}?</p>
			</div>
		</Modal>
	)
}

export default ModalBanViewer;