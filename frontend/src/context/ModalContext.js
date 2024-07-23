// context/ModalContext.js
import React, { createContext, useContext, useState } from 'react';

const ModalContext = createContext();

export const useModal = () => useContext(ModalContext);

export const ModalProvider = ({ children }) => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  const value = {
    showLoginModal,
    setShowLoginModal,
    showRegisterModal,
    setShowRegisterModal,
  };

  return <ModalContext.Provider value={value}>{children}</ModalContext.Provider>;
};
