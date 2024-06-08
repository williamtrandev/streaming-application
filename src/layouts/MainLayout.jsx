import { useState, useContext } from 'react';
import Sidebar from '../components/commons/sidebar/Sidebar';
import Header from '../components/commons/header/Header';
import { Outlet } from 'react-router-dom';
import LoginModal from '../components/auth/LoginModal';
import RegisterModal from '../components/auth/RegisterModal';
import UnfollowModal from '../components/detailStreamer/UnfollowModal';
import CropperModal from '../components/settings/CroperModal';
import ChangePasswordModal from '../components/settings/ChangePasswordModal';
import ChangeUsernameModal from '../components/settings/ChangeUsernameModal';
import { useDispatch } from 'react-redux';
import { initializeSocket } from '../redux/slices/socketSlice';
import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ModalContext } from '../contexts/ModalContext';
import ChangeEmailModal from '../components/settings/ChangeEmailModal';
import ForgotPasswordModal from '../components/auth/ForgotPasswordModal';

const MainLayout = () => {
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [showLoginModal, setShowLoginModal] = useState(false);
	const [showRegisterModal, setShowRegisterModal] = useState(false);
	
	const { 
		showUnfollowModal, unfollowName, handleCloseUnfollowModal, 
		setFollowed, 
		showCropperModal, setShowCropperModal,
		showChangePasswordModal, setShowChangePasswordModal,
		showChangeUsernameModal, setShowChangeUsernameModal,
		showChangeEmailModal, setShowChangeEmailModal,
		showForgotPasswordModal, setShowForgotPasswordModal
	} = useContext(ModalContext);
	
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
			<LoginModal 
				isVisible={showLoginModal} 
				onClose={() => setShowLoginModal(false)}
				openRegisterModal={() => setShowRegisterModal(true)} 
				openForgotPasswordModal={() => setShowForgotPasswordModal(true)}
			/>
			<RegisterModal 
				isVisible={showRegisterModal} 
				onClose={() => setShowRegisterModal(false)}
			/>
			<ForgotPasswordModal
				show={showForgotPasswordModal}
				close={() => setShowForgotPasswordModal(false)}
			/>
			<UnfollowModal 
				show={showUnfollowModal} 
				onClose={handleCloseUnfollowModal}
				onUnfollow={() => {
					setFollowed(false);
					handleCloseUnfollowModal();
				}}
				streamerName={unfollowName} />
			<CropperModal
				show={showCropperModal}
				onClose={() => setShowCropperModal(false)}
			/>
			<ChangePasswordModal 
				show={showChangePasswordModal}
				onClose={() => setShowChangePasswordModal(false)}
			/>
			<ChangeUsernameModal
				show={showChangeUsernameModal}
				onClose={() => setShowChangeUsernameModal(false)}
			/>
			<ChangeEmailModal 
				show={showChangeEmailModal}
				onClose={() => setShowChangeEmailModal(false)}
			/>
		</div>
	);
}

export default MainLayout;