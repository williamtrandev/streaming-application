import React, { createContext, useState } from 'react';
import useSwitchMode from "../hooks/useSwitchMode";

export const ModalContext = createContext();

export const ModalProvider = ({ children }) => {

    const [colorMode, setColorMode] = useSwitchMode();

    const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);

    return (
        <ModalContext.Provider 
            value={{ 
                colorMode, setColorMode,
                showForgotPasswordModal, setShowForgotPasswordModal
            }}
        >
            {children}
        </ModalContext.Provider>
    );
};
