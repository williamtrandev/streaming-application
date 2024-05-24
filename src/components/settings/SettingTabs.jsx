import { Link } from "react-router-dom";

const SettingTabs = ({ currentTab }) => {
    const tabData = [
        { id: 0, label: "Profile", link: "profile" },
        { id: 1, label: "Security", link: "security" },
        { id: 2, label: "Notifications", link: "notifications" },
    ];
    return (
        <div className="space-y-3">
            <div className="text-3xl font-bold">Settings</div>
            <div className="flex border-b border-gray-200 gap-5">
                {tabData.map((tab) => (
                    <Link
                        to={`/settings/${tab.link}`}
                        key={tab.id}
                        className={`px-4 py-2 font-bold text-md md:text-lg ${tab.label === currentTab
                            ? 'border-b-4 border-black-2 text-black-2 dark:border-white dark:text-white'
                            : 'border-b-2 border-transparent text-neutral-600 dark:text-neutral-400 hover:border-neutral-600 dark:hover:border-neutral-400'
                            }`}
                    >
                        {tab.label}
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default SettingTabs;
