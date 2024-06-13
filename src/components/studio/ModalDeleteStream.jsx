import { useState, useEffect } from 'react'
import { Modal } from 'antd';
import { useDeleteStream } from '../../api/studio';
import { toast } from 'react-toastify';

const ModalDeleteStream = ({open, setOpen, title, streamId, refetch }) => {
	const { mutate: deleteStream, isError: isDeleteError, isSuccess: isDeleteSuccess } = useDeleteStream();
	const [confirmLoading, setConfirmLoading] = useState(false);
	const handleOk = async () => {
		setConfirmLoading(true);
		deleteStream(streamId);
	}
	useEffect(() => {
		if (isDeleteError) {
			toast.error("Oops! Something went wrong");
		}
		if (isDeleteSuccess) {
			toast.success("Delete successfully!");
			setConfirmLoading(false);
			setOpen(false);
			refetch();
		}
	}, [isDeleteError, isDeleteSuccess])
	return (
		<Modal
			className='bg-slate-100 dark:bg-slate-600 rounded-lg dark:text-slate-200'
			centered
			open={open}
			okButtonProps={{ className: 'bg-purple-600 hover:!bg-purple-700' }}
			cancelButtonProps={{ className: 'border-purple-600 hover:!border-purple-700 hover:!text-purple-700' }}
			onOk={handleOk}
			closable={false}
			confirmLoading={confirmLoading}
			onCancel={() => setOpen(false)}
		>
			<div className='h-full'>
				<p className="text-lg font-semibold mb-2">Confirm Delete</p>
				<p className="text-sm">Are you sure you want to delete this stream: {title}?</p>
			</div>
		</Modal>
	)
}

export default ModalDeleteStream;