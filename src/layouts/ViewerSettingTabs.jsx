import { NavLink, Outlet } from "react-router-dom";

const ViewerSettingTabs = () => {
    return (
        <div className="space-y-5">
            <div className="text-2xl font-bold">Settings</div>
            <div className="sticky top-18 z-99 flex border-b
                bg-[#edf2f9] dark:bg-boxdark-2
                border-gray-300 dark:border-gray-600 gap-5"
            >
                <NavLink
                    to={"/settings/profile"}
                    className={({ isActive }) =>
                        `px-4 py-2 font-bold text-md md:text-lg ${isActive
                            ? 'border-b-4 border-black text-black dark:border-white dark:text-white'
                            : 'border-b-2 border-transparent text-neutral-600 dark:text-neutral-400 hover:border-neutral-600 dark:hover:border-neutral-400'
                        }`}
                >
                    Profile
                </NavLink>
                <NavLink
                    to={"/settings/security"}
                    className={({ isActive }) =>
                        `px-4 py-2 font-bold text-md md:text-lg ${isActive
                            ? 'border-b-4 border-black text-black dark:border-white dark:text-white'
                            : 'border-b-2 border-transparent text-neutral-600 dark:text-neutral-400 hover:border-neutral-600 dark:hover:border-neutral-400'
                        }`}
                >
                    Security
                </NavLink>
            </div>
            <Outlet />
        </div>
    );
}

export default ViewerSettingTabs;
