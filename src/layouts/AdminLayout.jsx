import { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import SidebarAdmin from '../components/commons/sidebar/SidebarAdmin';
import { useAuth } from '../contexts/AuthContext';
import HeaderAdmin from '../components/commons/header/HeaderAdmin';

const AdminLayout = () => {
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const navigate = useNavigate();
	const { auth } = useAuth();

	useEffect(() => {
		if (!auth) {
			navigate("/admin-login");
		}
	}, [auth]);

	return (
		<div className="dark:bg-boxdark-2 dark:text-bodydark bg-[#edf2f9]">
			<div className="flex h-screen overflow-hidden">
				<SidebarAdmin sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
				<div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
					<HeaderAdmin sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
					<main>
						<div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
							<Outlet />
						</div>
					</main>
				</div>
			</div>
		</div>
	);
}

export default AdminLayout;