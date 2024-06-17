import React, { createContext, useState } from 'react';
import useSwitchMode from "../hooks/useSwitchMode";

export const ModalContext = createContext();

export const ModalProvider = ({ children }) => {

    const [colorMode, setColorMode] = useSwitchMode();

    return (
        <ModalContext.Provider 
            value={{ 
                colorMode, setColorMode,
            }}
        >
            {children}
        </ModalContext.Provider>
    );
};
