import React from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import StreamerVideo from '../../components/studio/StreamerVideo';
import ChatBox from '../../components/detailStream/ChatBox';
import { useSelector } from 'react-redux';
import { selectSocket } from '../../redux/slices/socketSlice';
import { useAuth } from '../../contexts/AuthContext';
import { useEffect } from 'react';
import StreamerObsVideo from '../../components/studio/StreamerObsVideo';
import { useEndStream } from '../../api/studio';
import { toast } from 'react-toastify';

const StreamPage = () => {
	const { streamId } = useParams();
	const navigate = useNavigate();
	const { auth } = useAuth();
	const userId = auth?.user?._id;
	const { mutate: endStream, isError: isEndError, isSuccess: isEndSuccess } = useEndStream();

	const streamWithObs = sessionStorage.getItem("streamWithObs");
	console.log(streamWithObs);

	const socket = useSelector(selectSocket);
	useEffect(() => {
		if (socket) {
			socket.emit('joinRoom', streamId, userId);
		}
		const handleBannedStream = (banStreamId, banEgressId) => {
			if (streamId == banStreamId) {
				endStream({ streamId: banStreamId, egressId: banEgressId });
				toast.warning("Your stream has been banned");
				socket.emit('endStream');
				navigate(`/studio/manager`);
			}
		}
		socket.on('clientBannedStream', handleBannedStream);
	}, [socket]);
	return (
		<div className="h-[calc(100vh-7rem)] md:h-[calc(100vh-8rem)] 2xl:h-[calc(100vh-10rem)]">
			<div className="md:grid md:grid-cols-3 md:gap-5 h-full w-full space-y-3 md:space-y-0">
				<div className="md:col-span-2 w-full h-full md:overflow-auto flex flex-col items-center gap-5">
					{streamWithObs == 'true' && <StreamerObsVideo streamId={streamId} />}
					{streamWithObs == 'false' && <StreamerVideo streamId={streamId} />}
				</div>
				<div className="h-full w-full overflow-auto">
					<ChatBox streamId={streamId} socket={socket} isStreamer={true} />
				</div>
			</div>
		</div>
	)
}

export default StreamPage;