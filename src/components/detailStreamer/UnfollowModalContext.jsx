import React, { createContext, useState } from 'react';
import useSwitchMode from "../../hooks/useSwitchMode";

export const UnfollowModalContext = createContext();

export const UnfollowModalProvider = ({ children }) => {
    const [showUnfollowModal, setShowUnfollowModal] = useState(false);
    const [unfollowName, setUnfollowName] = useState("");
    const [followed, setFollowed] = useState(false);
    const [colorMode, setColorMode] = useSwitchMode();

    const handleShowUnfollowModal = (name) => {
        setUnfollowName(name);
        setShowUnfollowModal(true);
    };

    const handleCloseUnfollowModal = () => {
        setShowUnfollowModal(false);
        setUnfollowName("");
    };

    return (
        <UnfollowModalContext.Provider 
            value={{ 
                showUnfollowModal, unfollowName, handleShowUnfollowModal, handleCloseUnfollowModal,
                followed, setFollowed, colorMode, setColorMode
            }}
        >
            {children}
        </UnfollowModalContext.Provider>
    );
};
