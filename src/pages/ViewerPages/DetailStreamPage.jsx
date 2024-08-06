import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import StreamVideo from '../../components/detailStream/StreamVideo';
import ChatBox from '../../components/detailStream/ChatBox';
import { useSelector } from 'react-redux';
import { selectSocket } from '../../redux/slices/socketSlice';
import { useAuth } from '../../contexts/AuthContext';
import { useGetDetailStream } from '../../api/studio';
import Spinner from '../../components/commons/spinner/Spinner';
import RecordStreamVideo from '../../components/detailStream/RecordStreamVideo';
import { appName } from '../../constants';
import { useIsBanned } from '../../api/user';
import { banned } from '../../assets';
import { toast } from 'react-toastify';
import { FloatButton } from 'antd';
import { CommentOutlined } from '@ant-design/icons';

const DetailStreamPage = () => {
	const { streamId } = useParams();
	console.log(streamId)
	const { auth } = useAuth();
	const userId = auth?.user?._id;
	const socket = useSelector(selectSocket);
	const [isChatVisible, setIsChatVisible] = useState(false);
	const [isChatIconVisible, setIsChatIconVisible] = useState(true);
	const { data: detailStreamData, isLoading: isDetailLoading } = useGetDetailStream(streamId);
	const { data: dataBanned } = useIsBanned({ userId: userId, streamId: streamId, typeBanned: 'watch' });
	useEffect(() => {
		if (socket) {
			socket.emit('joinRoom', streamId, userId);
			socket.on('clientBanned', () => {
				toast.warning('You have been banned');
				setTimeout(() => {
					window.location.reload();
				}, 2000);
			});
		}
	}, [socket]);
	useEffect(() => {
		if (detailStreamData) {
			document.title = `${detailStreamData.stream.title} - ${appName}`;
		}
	}, [detailStreamData]);

	if (isDetailLoading) {
		return (
			<div className="flex justify-center items-center h-[calc(100vh-5rem)]">
				<Spinner />
			</div>
		);
	}
	if (dataBanned && dataBanned.isBanned) {
		return (
			<div className="flex flex-col justify-center items-center h-[calc(100vh-5rem)] gap-5">
				<img src={banned} alt="" className="!h-[70%]" />
				<p className="text-2xl font-bold">You have been banned</p>
			</div>
		);
	}
	return (
		<div className="space-y-3">
			<div className="md:h-[calc(100vh-8rem)] 2xl:h-[calc(100vh-10rem)]">
				<div className="md:grid md:grid-cols-3 md:gap-2 h-full w-full space-y-3 md:space-y-0">
					<div className="md:col-span-2 w-full h-full md:overflow-auto">
						{detailStreamData ? (
							detailStreamData.stream.finished ? (
								detailStreamData.stream.rerun ? (
									<RecordStreamVideo streamData={detailStreamData} />
								) : (
									<div className="flex justify-center items-center h-full">
										<p>This stream has ended.</p>
									</div>
								)
							) : (
								<StreamVideo streamData={detailStreamData} />
							)
						) : (
							<div className="flex justify-center items-center h-full">
								<p>No stream data available.</p>
							</div>
						)}
					</div>
					<div className={`h-full w-full overflow-auto ${isChatVisible ?
						'fixed bottom-0 right-0 !h-[400px] dark:shadow-white dark:shadow-2xl shadow-black' :
						'hidden'
						} md:!block md:h-auto md:shadow-none`}
					>
						<ChatBox
							streamId={streamId}
							socket={socket}
							streamerId={detailStreamData.stream.user._id}
							isFinished={detailStreamData.stream.finished}
						/>
						<div className="absolute right-5 top-2 cursor-pointer md:hidden w-6 h-6 flex items-center justify-center rounded-full dark:bg-purple-600"
							onClick={() => {
								setIsChatVisible(false);
								setIsChatIconVisible(true);
							}}
						>X</div>
					</div>
				</div>
			</div>
			<FloatButton
				className={`flex items-center justify-center ${isChatIconVisible ? 'block' : 'hidden'} md:hidden`}
				icon={<CommentOutlined />}
				onClick={() => {
					setIsChatVisible(true);
					setIsChatIconVisible(false);
				}}
			/>
		</div>
	)
}

export default DetailStreamPage;