import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import StreamVideo from '../../components/detailStream/StreamVideo';
import ChatBox from '../../components/detailStream/ChatBox';
import { useSelector } from 'react-redux';
import { selectSocket } from '../../redux/slices/socketSlice';
import { useAuth } from '../../contexts/AuthContext';
import { useGetDetailStream } from '../../api/studio';
import Spinner from '../../components/commons/spinner/Spinner';
import RecordStreamVideo from '../../components/detailStream/RecordStreamVideo';
import { useIsBanned } from '../../api/user';
import { banned } from '../../assets';
import { toast } from 'react-toastify';

const DetailStreamPage = () => {
	const { streamId } = useParams();
	console.log(streamId)
	const { auth } = useAuth();
	const userId = auth?.user?._id;
	const socket = useSelector(selectSocket);
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
			<div className="h-[calc(100vh-7rem)] md:h-[calc(100vh-8rem)] 2xl:h-[calc(100vh-10rem)]">
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
					<div className="h-full w-full overflow-auto">
						<ChatBox streamId={streamId} socket={socket} streamerId={detailStreamData.stream.user._id}/>
					</div>
				</div>
			</div>
		</div>
	)
}

export default DetailStreamPage;