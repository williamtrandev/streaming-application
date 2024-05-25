import React, { createContext, useState } from 'react';
import useSwitchMode from "../hooks/useSwitchMode";

export const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
    const [showUnfollowModal, setShowUnfollowModal] = useState(false);
    const [unfollowName, setUnfollowName] = useState("");
    const [followed, setFollowed] = useState(false);
    const [colorMode, setColorMode] = useSwitchMode();
    const [showCropperModal, setShowCropperModal] = useState(false);
    const [src, setSrc] = useState(null);
    const [preview, setPreview] = useState(null);
    const [settingProfilePicture, setSettingProfilePicture] = useState(null);

    const handleShowUnfollowModal = (name) => {
        setUnfollowName(name);
        setShowUnfollowModal(true);
    };

    const handleCloseUnfollowModal = () => {
        setShowUnfollowModal(false);
        setUnfollowName("");
    };

    return (
        <ModalContext.Provider 
            value={{ 
                showUnfollowModal, unfollowName, handleShowUnfollowModal, handleCloseUnfollowModal,
                followed, setFollowed, 
                colorMode, setColorMode,
                showCropperModal, setShowCropperModal, src, setSrc, preview, setPreview, settingProfilePicture, setSettingProfilePicture
            }}
        >
            {children}
        </ModalContext.Provider>
    );
};