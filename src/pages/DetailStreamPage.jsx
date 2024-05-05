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
		<SectionWrapper>
			<div className="flex w-full space-x-5">
				<div className="w-[70%]">
					<StreamVideo stream={fakeStream}/>
				</div>
				<div className="w-[30%] flex">
					<ChatBox />
				</div>
			</div>
		</SectionWrapper>
	)
}

export default DetailStreamPage;