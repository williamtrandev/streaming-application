import { useState, useEffect } from 'react';
import Header from '../components/commons/header/Header';
import { Outlet, useNavigate } from 'react-router-dom';
import LoginModal from '../components/auth/LoginModal';
import RegisterModal from '../components/auth/RegisterModal';
import SidebarStudio from '../components/commons/sidebar/SidebarStudio';
import { useAuth } from '../contexts/AuthContext';

const StudioLayout = () => {
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [showLoginModal, setShowLoginModal] = useState(false);
	const [showRegisterModal, setShowRegisterModal] = useState(false);
	const navigate = useNavigate();
	const { auth } = useAuth();

	useEffect(() => {
		if (!auth) {
			navigate("/");
		}
	}, [auth]);

	return (
		<div className="dark:bg-boxdark-2 dark:text-bodydark bg-[#edf2f9]">
			<div className="flex h-screen overflow-hidden">
				<SidebarStudio sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
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
		</div>
	);
}

export default StudioLayout;