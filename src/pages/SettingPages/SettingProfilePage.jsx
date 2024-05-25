import ProfileTab from "../../components/settings/ProfileTab";
import SettingTabs from "../../components/settings/SettingTabs";

const SettingProfilePage = () => {

    const fakeStreamer = {
		profile_banner: "https://react-demo.tailadmin.com/assets/cover-01-e8bbef04.png",
		profile_picture: 'https://avatars.githubusercontent.com/u/102520170?v=4',
		name: "William Tran",
		username: "WilliamTran123",
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
        <div className="space-y-5">
            <SettingTabs currentTab={"Profile"} />
            <ProfileTab user={fakeStreamer} />
        </div>
    );
}

export default SettingProfilePage;
