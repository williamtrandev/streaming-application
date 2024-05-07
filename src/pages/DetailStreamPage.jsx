import { useParams } from 'react-router-dom';
import SectionWrapper from '../components/commons/SectionWrapper';
import StreamVideo from '../components/detailStream/StreamVideo';
import ChatBox from '../components/detailStream/ChatBox';
const DetailStreamPage = () => {
	const { id } = useParams();
	const fakeStream = {
		title: 'Test Stream', 	
		user: {
			avatar: "https://img.nimo.tv/t/1629511737952/202308101691689784491_1629511737952_avatar.png/w120_l0/img.webp",
			name: "Thanh Chan",
			num_followers: 100
		},
		num_viewers: 70000,
	}
	return (
		<div className="h-[calc(100vh-7rem)] md:h-[calc(100vh-8rem)] 2xl:h-[calc(100vh-10rem)]">
			<div className="flex items-center w-full space-x-5 h-full">
				<div className="md:w-[70%] sm:w-full h-full">
					<StreamVideo stream={fakeStream}/>
				</div>
				<div className="md:w-[30%] md:flex hidden h-full">
					<ChatBox />
				</div>
			</div>
		</div>
	)
}

export default DetailStreamPage;