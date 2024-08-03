import React from 'react'
import { useState, useEffect, useRef } from "react";
import EmailAdminSetting from '../../components/admin/EmailAdminSetting';
import { useGetAdminSettings } from '../../api/admin';
import PasswordAdminSetting from '../../components/admin/PasswordAdminSetting';
import UsernameAdminSetting from '../../components/admin/UsernameAdminSetting';

const SettingsAdminPage = () => {
    const [authUsername, setAuthUsername] = useState("");
    const [authEmail, setAuthEmail] = useState("");

    const { data: userData } = useGetAdminSettings();
    useEffect(() => {
        if (userData) {
            setAuthEmail(userData.email);
            setAuthUsername(userData.username);
        }
    }, [userData]);

    useEffect(() => {
        document.title = "Admin - Settings";
    }, []);

    return (
        <div className="space-y-6">
            <div className="text-xl font-bold">Settings</div>
            <div
                className="px-4 md:px-6 rounded-lg
                    bg-white drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none 
                    divide-y divide-gray-300 dark:divide-gray-600"
            >
                <UsernameAdminSetting authUsername={authUsername} setAuthUsername={setAuthUsername} />
                <EmailAdminSetting authEmail={authEmail} setAuthEmail={setAuthEmail} />
                <PasswordAdminSetting authUsername={authUsername} />
            </div>
        </div>
    );
}

export default SettingsAdminPage
