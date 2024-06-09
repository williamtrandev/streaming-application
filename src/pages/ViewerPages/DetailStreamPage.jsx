import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import StreamVideo from '../../components/detailStream/StreamVideo';
import ChatBox from '../../components/detailStream/ChatBox';
import { useSelector } from 'react-redux';
import { selectSocket } from '../../redux/slices/socketSlice';
import { useAuth } from '../../contexts/AuthContext';
import { useGetDetailStreamAndToken } from '../../api/studio';
import Spinner from '../../components/commons/spinner/Spinner';

const DetailStreamPage = () => {
	const { streamId } = useParams();
	console.log(streamId)
	const { auth } = useAuth();
	const userId = auth?.user?.userId;
	const socket = useSelector(selectSocket);
	const { data: detailStreamData, isLoading: isDetailLoading } = useGetDetailStreamAndToken(streamId);
	useEffect(() => {
		if (socket) {
			socket.emit('joinRoom', streamId, userId);
		}
	}, [socket]);

	const fakeStream = {
		title: 'Test Stream', 																								
		user: {
			profile_picture: "https://img.nimo.tv/t/1629511737952/202308101691689784491_1629511737952_avatar.png/w120_l0/img.webp",
			name: "Thanh Chan",
			num_followers: 100
		},
		num_viewers: 70000,
		description: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum. Nam quam nunc, blandit vel, luctus pulvinar, hendrerit id, lorem. Maecenas nec odio et ante tincidunt tempus. Donec vitae sapien ut libero venenatis faucibus. Nullam quis ante. Etiam sit amet orci eget eros faucibus tincidunt. Duis leo. Sed fringilla mauris sit amet nibh. Donec sodales sagittis magna. Sed consequat, leo eget bibendum sodales, augue velit cursus nunc,",
		num_likes: 12340,
		num_dislikes: 1000,
	};
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