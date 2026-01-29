import { createContext, useState, useContext, useCallback } from 'react';
import { notification } from 'antd';
import { getInspectionGen } from '../services/charroiService';
import { useSelector } from 'react-redux';
import { getMenusAllOne } from '../services/permissionService';

const MenuContext = createContext();

export const MenuProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const [data, setData] = useState([]);
  const [statistique, setStatistique] = useState(null);
  const [dataPermission, setDataPermission] = useState([]);
  const userId = useSelector((state) => state.user?.currentUser?.id_utilisateur);

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

  const fetchMenu = useCallback(async () => {
    if (!userId) return;

    setIsLoading(true);

    try {
      const response = await getMenusAllOne(userId);
      setDataPermission(response.data);
      localStorage.setItem('SidebarMenu', JSON.stringify(response.data));
    } catch (error) {
      const status = error?.response?.status;

      let message = 'Une erreur inattendue est survenue.';
      let description = 'Veuillez réessayer ultérieurement.';

      if (!error.response) {
        // réseau coupé / serveur HS
        message = 'Serveur indisponible';
        description = 'Le serveur est momentanément indisponible. Réessayez dans quelques instants.';
      } else if ([502, 503, 504].includes(status)) {
        message = 'Service temporairement indisponible';
        description = 'Le service rencontre un problème technique.';
      }

      notification.warning({
        message,
        description,
      });

      // Fallback cache
      const cached = localStorage.getItem('SidebarMenu');
      if (cached) {
        setDataPermission(JSON.parse(cached));
      }
    } finally {
      setIsLoading(false);
    }
  }, [userId]);


  return (
    <MenuContext.Provider
      value={{
        isOpen,
        toggleMenu,
        loading,
        data,
        setData,
        statistique,
        fetchDataInsp,
        dataPermission,
        fetchMenu,
        isLoading,
        setIsLoading
      }}
    >
      {children}
    </MenuContext.Provider>
  );
};

export const useMenu = () => useContext(MenuContext);