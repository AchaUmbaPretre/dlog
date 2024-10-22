import React, { createContext, useState, useContext } from 'react';

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

export const useMenu = () => useContext(MenuContext);
