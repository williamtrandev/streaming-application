import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import StreamVideo from '../../components/detailStream/StreamVideo';
import ChatBox from '../../components/detailStream/ChatBox';
import { useSelector } from 'react-redux';
import { selectSocket } from '../../redux/slices/socketSlice';
import { useAuth } from '../../contexts/AuthContext';
import { useGetDetailStream } from '../../api/studio';
import Spinner from '../../components/commons/spinner/Spinner';
import { useWriteHistory } from '../../api/history';

const DetailStreamPage = () => {
	const { streamId } = useParams();
	console.log(streamId)
	const { auth } = useAuth();
	const userId = auth?.user?._id;
	const socket = useSelector(selectSocket);
	const { data: detailStreamData, isLoading: isDetailLoading } = useGetDetailStream(streamId);
	useEffect(() => {
		if (socket) {
			socket.emit('joinRoom', streamId, userId);
		}
	}, [socket]);

	const { mutate: writeHistory } = useWriteHistory();
	useEffect(() => {
		if (detailStreamData) {
			writeHistory({ streamId });
		}
	}, [detailStreamData]);

	if (isDetailLoading) {
		return (
			<div className="flex justify-center items-center h-screen">
				<Spinner />
			</div>
		);
	}
	return (
		<div className="space-y-3">
			<div className="h-[calc(100vh-7rem)] md:h-[calc(100vh-8rem)] 2xl:h-[calc(100vh-10rem)]">
				<div className="md:grid md:grid-cols-3 md:gap-2 h-full w-full space-y-3 md:space-y-0">
					<div className="md:col-span-2 w-full h-full md:overflow-auto">
						<StreamVideo streamData={detailStreamData}/>
					</div>
					<div className="h-full w-full overflow-auto">
						<ChatBox streamId={streamId} socket={socket} />
					</div>
				</div>
			</div>
		</div>

	)
}

export default DetailStreamPage;