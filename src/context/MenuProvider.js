/* import React, { createContext, useState, useContext } from 'react';

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
 */

import React, { createContext, useState, useContext, useCallback } from 'react';
import { notification } from 'antd';
import { getInspectionGen } from '../services/charroiService';

const MenuContext = createContext();

// Fournisseur de contexte pour englober l'application
export const MenuProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [statistique, setStatistique] = useState(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const fetchDataInsp = useCallback(async (filters, searchValue = '') => {
    setLoading(true);
    try {
      const [inspectionData] = await Promise.all([
        getInspectionGen(searchValue, filters),
      ]);
      setData(inspectionData.data.inspections);
      setStatistique(inspectionData.data.stats);
    } catch (error) {
      notification.error({
        message: 'Erreur de chargement',
        description: 'Une erreur est survenue lors du chargement des données.',
      });
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <MenuContext.Provider
      value={{
        isOpen,
        toggleMenu,
        loading,
        data,
        setData,
        statistique,
        fetchDataInsp
      }}
    >
      {children}
    </MenuContext.Provider>
  );
};

export const useMenu = () => useContext(MenuContext);
