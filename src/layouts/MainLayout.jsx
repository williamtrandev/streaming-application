import { useState, useContext } from 'react';
import Sidebar from '../components/commons/sidebar/Sidebar';
import Header from '../components/commons/header/Header';
import { Outlet } from 'react-router-dom';
import LoginModal from '../components/auth/LoginModal';
import RegisterModal from '../components/auth/RegisterModal';
import { useDispatch } from 'react-redux';
import { initializeSocket } from '../redux/slices/socketSlice';
import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ModalContext } from '../contexts/ModalContext';
import ForgotPasswordModal from '../components/auth/ForgotPasswordModal';

const MainLayout = () => {
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [showLoginModal, setShowLoginModal] = useState(false);
	const [showRegisterModal, setShowRegisterModal] = useState(false);
	
	const { 
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
		</div>
	);
}

export default MainLayout;