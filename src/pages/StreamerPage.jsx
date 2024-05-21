import { useState } from "react";
import { useParams } from "react-router-dom";
import { streams } from "../constants";
import ProfileHeader from "../components/detailStreamer/ProfileHeader";
import HomeTab from "../components/detailStreamer/HomeTab";
import StreamsTab from "../components/detailStreamer/StreamsTab";
import AboutTab from "../components/detailStreamer/AboutTab";

const StreamerPage = () => {
	const { id } = useParams();
	const [activeTab, setActiveTab] = useState(0);

	const tabData = [
		{ id: 0, label: "Home" },
		{ id: 1, label: "Streams" },
		{ id: 2, label: "About" },
	];

	const fakeStreamer = {
		profile_cover: "https://react-demo.tailadmin.com/assets/cover-01-e8bbef04.png",
		avatar: 'https://avatars.githubusercontent.com/u/102520170?v=4',
		name: "William Tran",
		num_followers: 113315,
		about: {
			text: `F8 là cộng đồng học tập và chia sẻ kiến thức lập trình dành cho tất cả mọi người. Các khóa học đều được đầu tư kỹ lưỡng về mặt nội dung, âm thanh và hình ảnh. Học viên có thể học từ con số 0 tới khi trở thành lập trình viên chuyên nghiệp tại đây.

Truy cập ngay https://fullstack.edu.vn/ và học tại đây để làm bài tập, quản lý được tiến độ học và hơn thế nữa!
			
F8 Official
(c) Sơn Đặng
Website: https://fullstack.edu.vn
Fanpage F8: https://www.facebook.com/f8vnofficial/
Facebook cá nhân: https://facebook.com/sondnf8
Nhóm Học Lập Trình Web: https://www.facebook.com/groups/f8off...
Email: contact@fullstack.edu.vn

© Bản quyền thuộc về Channel F8 Official ☞ Do not Reup
© Nghiêm cấm sử dụng video nhằm mục đích thương mại dưới mọi hình thức.
#hoclaptrinh_online #hoc_html_css #hoc_javascript #reactjs`,
			links: [
				{
					title: "link 1",
					link: "/link1/123",
				},
				{
					title: "link 2",
					link: "/link2/456",
				},
			]
		},
	}

	return (
		<div>
			<ProfileHeader streamer={fakeStreamer} />

			<div className="w-full">
				<div className="flex border-b border-gray-200 gap-8">
					{tabData.map((tab) => (
						<button
							key={tab.id}
							onClick={() => setActiveTab(tab.id)}
							className={`px-4 py-2 font-bold text-md md:text-xl ${activeTab === tab.id
								? 'border-b-4 border-black-2 text-black-2 dark:border-white dark:text-white'
								: 'border-b-2 border-transparent text-neutral-600 dark:text-neutral-400 hover:border-neutral-600 dark:hover:border-neutral-400'
								}`}
						>
							{tab.label}
						</button>
					))}
				</div>
				<div className="py-4">
					<div
						key={0}
						className={`${activeTab === 0 ? 'block' : 'hidden'}`}
					>
						<HomeTab currentStream={streams[0]} mostLikedStream={streams} mostViewedStream={streams} />
					</div>
					<div
						key={1}
						className={`${activeTab === 1 ? 'block' : 'hidden'}`}
					>
						<StreamsTab streams={streams} />
					</div>
					<div
						key={2}
						className={`${activeTab === 2 ? 'block' : 'hidden'}`}
					>
						<AboutTab about={fakeStreamer.about} />
					</div>
				</div>
			</div>
		</div>
	);
}

export default StreamerPage
