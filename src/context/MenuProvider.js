import React, { createContext, useState, useContext } from 'react';

// Créez un contexte pour l'état ouvert
const MenuContext = createContext();

// Fournisseur de contexte pour englober l'application
export const MenuProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <MenuContext.Provider value={{ isOpen, toggleMenu }}>
      {children}
    </MenuContext.Provider>
  );
};

// Hook pour utiliser le contexte plus facilement
export const useMenu = () => useContext(MenuContext);
