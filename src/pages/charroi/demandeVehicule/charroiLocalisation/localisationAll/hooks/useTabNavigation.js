// hooks/useTabNavigation.js
import { useState, useCallback } from 'react';

export const useTabNavigation = (initialTab = 'map') => {
  const [activeSection, setActiveSection] = useState(initialTab);
  const [hoveredTab, setHoveredTab] = useState(null);

  const handleTabChange = useCallback((tabId) => {
    setActiveSection(tabId);
  }, []);

  const handleTabHover = useCallback((tabId) => {
    setHoveredTab(tabId);
  }, []);

  const handleTabLeave = useCallback(() => {
    setHoveredTab(null);
  }, []);

  return {
    activeSection,
    hoveredTab,
    handleTabChange,
    handleTabHover,
    handleTabLeave
  };
};