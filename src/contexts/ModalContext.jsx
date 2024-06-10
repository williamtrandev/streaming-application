import React, { createContext, useState } from 'react';
import useSwitchMode from "../hooks/useSwitchMode";

export const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
    const [showUnfollowModal, setShowUnfollowModal] = useState(false);
    const [unfollowId, setUnfollowId] = useState("");
    const [unfollowName, setUnfollowName] = useState("");
    const [followed, setFollowed] = useState(false);

    const [colorMode, setColorMode] = useSwitchMode();

    const [showCropperModal, setShowCropperModal] = useState(false);
    const [src, setSrc] = useState(null);

    const [showVerifyEmailModal, setShowVerifyEmailModal] = useState(false);
    const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);

    const [showChangeUsernameModal, setShowChangeUsernameModal] = useState(false);

    const [showChangeEmailModal, setShowChangeEmailModal] = useState(false);

    const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);

    const handleShowUnfollowModal = (id, name) => {
        setUnfollowId(id);
        setUnfollowName(name);
        setShowUnfollowModal(true);
    };

    const handleCloseUnfollowModal = () => {
        setShowUnfollowModal(false);
        setUnfollowName("");
        setUnfollowId("");
    };

    return (
        <ModalContext.Provider 
            value={{ 
                showUnfollowModal, unfollowId, unfollowName, handleShowUnfollowModal, handleCloseUnfollowModal,
                followed, setFollowed, 
                colorMode, setColorMode,
                showCropperModal, setShowCropperModal, src, setSrc, 
                showChangePasswordModal, setShowChangePasswordModal,
                showVerifyEmailModal, setShowVerifyEmailModal,
                showChangeUsernameModal, setShowChangeUsernameModal,
                showChangeEmailModal, setShowChangeEmailModal,
                showForgotPasswordModal, setShowForgotPasswordModal
            }}
        >
            {children}
        </ModalContext.Provider>
    );
};
