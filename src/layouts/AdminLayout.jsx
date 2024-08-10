import { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import SidebarAdmin from '../components/commons/sidebar/SidebarAdmin';
import { useAuth } from '../contexts/AuthContext';
import HeaderAdmin from '../components/commons/header/HeaderAdmin';
import { useCheckAdminRole } from '../api/admin';
import { ShieldBan } from 'lucide-react';

const AdminLayout = () => {
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const navigate = useNavigate();
	const { auth } = useAuth();
	const { data: adminRole } = useCheckAdminRole(auth?.user?._id);

	useEffect(() => {
		if (!auth) {
			navigate("/admin-login");
		}
	}, [auth]);

	if (adminRole && !adminRole.isAdmin) {
		return (
			<div className="dark:bg-boxdark-2 dark:text-bodydark bg-[#edf2f9]">
				<div className="flex flex-col h-screen overflow-hidden justify-center text-2xl items-center">
					
					You do not have permission to access this page
				</div>
			</div>
		);
	}

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