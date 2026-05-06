// hooks/useDrawer.js
import { useState, useCallback } from 'react';

export const useDrawer = () => {
  const [drawerVisible, setDrawerVisible] = useState(false);

  const openDrawer = useCallback(() => {
    setDrawerVisible(true);
  }, []);

  const closeDrawer = useCallback(() => {
    setDrawerVisible(false);
  }, []);

  return {
    drawerVisible,
    openDrawer,
    closeDrawer
  };
};