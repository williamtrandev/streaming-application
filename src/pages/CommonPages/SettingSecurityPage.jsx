import EmailSetting from "../../components/settings/EmailSetting";
import PasswordSetting from "../../components/settings/PasswordSetting";

const SettingSecurityPage = () => {
    return (
        <div className="space-y-6">
            {/* <div className="text-xl">Security</div> */}
            <div
                className="px-4 md:px-6 rounded-lg
                    bg-white drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none 
                    divide-y divide-gray-300 dark:divide-gray-600"
            >
                <EmailSetting />
                <PasswordSetting />
            </div>
        </div>
    );
}

export default SettingSecurityPage;
