import { useState, useContext } from 'react';
import Sidebar from '../components/commons/sidebar/Sidebar';
import Header from '../components/commons/header/Header';
import { Outlet } from 'react-router-dom';
import LoginModal from '../components/auth/LoginModal';
import RegisterModal from '../components/auth/RegisterModal';
import { UnfollowModalContext, UnfollowModalProvider } from '../components/detailStreamer/UnfollowModalContext';
import UnfollowModal from '../components/detailStreamer/UnfollowModal';

const MainLayout = () => {
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [showLoginModal, setShowLoginModal] = useState(false);
	const [showRegisterModal, setShowRegisterModal] = useState(false);
	const { showUnfollowModal, unfollowName, handleCloseUnfollowModal, setFollowed } = useContext(UnfollowModalContext);

	return (
		<div className="dark:bg-boxdark-2 dark:text-bodydark bg-[#edf2f9]">
			<div className="flex h-screen overflow-hidden">
				<Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
				<div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
					<Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}
						setShowLoginModal={setShowLoginModal} />
					<main>
						<div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
							<Outlet />
						</div>
					</main>
				</div>
			</div>
			<LoginModal isVisible={showLoginModal} onClose={setShowLoginModal}
				openRegisterModal={setShowRegisterModal} />
			<RegisterModal isVisible={showRegisterModal} onClose={setShowRegisterModal} />
			<UnfollowModal 
				show={showUnfollowModal} 
				onClose={handleCloseUnfollowModal}
				onUnfollow={() => {
					setFollowed(false);
					handleCloseUnfollowModal();
				}} 
				streamerName={unfollowName} />
		</div>
	);
}

export default () => (
	<UnfollowModalProvider>
		<MainLayout />
	</UnfollowModalProvider>
);