// hooks/useMapControls.js
import { useState, useCallback } from 'react';

export const useMapControls = () => {
  const [showTrails, setShowTrails] = useState(true);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [currentStyle, setCurrentStyle] = useState('streets');

  const toggleTrails = useCallback(() => {
    setShowTrails(prev => !prev);
  }, []);

  const toggleHeatmap = useCallback(() => {
    setShowHeatmap(prev => !prev);
  }, []);

  const handleStyleChange = useCallback((style, mapRef) => {
    setCurrentStyle(style);
    if (mapRef?.current) {
      mapRef.current.changeStyle(style);
    }
  }, []);

  return {
    showTrails,
    showHeatmap,
    currentStyle,
    toggleTrails,
    toggleHeatmap,
    handleStyleChange
  };
};