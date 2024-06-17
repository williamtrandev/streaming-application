import { useState, useEffect } from 'react'
import { Modal } from 'antd';
import { useEndStream } from '../../api/studio';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const ModalEndStream = ({ open, setOpen, streamId, egressId }) => {
	const navigate = useNavigate();
	const { mutate: endStream, isError: isEndError, isSuccess: isEndSuccess } = useEndStream();
	const [confirmLoading, setConfirmLoading] = useState(false);
	const handleOk = async () => {
		if(egressId) {
			setConfirmLoading(true);
			endStream({ streamId, egressId });
			navigate(`/studio/manager`);
		}
	}
	useEffect(() => {
		if (isEndError) {
			toast.error("Oops! Something went wrong");
		}
		if (isEndSuccess) {
			toast.success("End successfully!");
			setConfirmLoading(false);
			setOpen(false);
		}
	}, [isEndError, isEndSuccess])
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
				<p className="text-lg font-semibold mb-2">Confirm End Stream</p>
				<p className="text-sm">Are you sure you want to end this stream?</p>
			</div>
		</Modal>
	)
}

export default ModalEndStream;