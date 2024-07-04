import { useState, useEffect } from 'react'
import { Modal, Button } from 'antd';
import { useBanViewer } from '../../api/studio';
import { useSelector } from 'react-redux';
import { selectSocket } from '../../redux/slices/socketSlice';
import { useGetBanPermissions } from '../../api/user';

const ModalBanViewer = ({ open, setOpen, username, userId, streamId }) => {
	const [confirmLoading, setConfirmLoading] = useState(false);
	const [isChat, setIsChat] = useState(true);
	const [isWatch, setIsWatch] = useState(true);
	const { mutate: banWatch, isSuccess: isBanSuccess, isError: isBanError } = useBanViewer();
	const { data: banPermissions, isSuccess: isGetPermissionSuccess } = useGetBanPermissions({ userId: userId, streamId: streamId});
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
		setIsChat(false);
	}
	const handleBanWatch = async () => {
		setOpen(false);
		const data = {
			bannedId: userId, 
			streamId: streamId,
			typeBanned: 'watch'
		}
		socket.emit('banned', userId, streamId);
		banWatch(data);
		setIsWatch(false);
	}
	useEffect(() => {
		if (isGetPermissionSuccess && banPermissions) {
			const permissions = banPermissions.permissions;
			setIsWatch(permissions.includes('watch'));
			setIsChat(permissions.includes('chat'));
		}
	}, [isGetPermissionSuccess]);
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
					{isWatch && 
						<Button className='bg-orange-500 hover:!bg-orange-600 !text-white' onClick={handleBanWatch}>Watch</Button>
					}
					{isChat &&
						<OkBtn />
					}
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