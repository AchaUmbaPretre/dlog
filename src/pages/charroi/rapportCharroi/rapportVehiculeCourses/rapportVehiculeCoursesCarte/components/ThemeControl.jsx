import React, { useState } from 'react';
import { 
  SunOutlined, 
  MoonOutlined, 
  GlobalOutlined, 
  EnvironmentOutlined
} from '@ant-design/icons';
import { Tooltip, Dropdown, Menu } from 'antd';

export const ThemeControl = ({ currentTheme, onThemeChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const themes = [
    { key: 'light', label: 'Clair', icon: <SunOutlined />, color: '#f59e0b' },
    { key: 'dark', label: 'Sombre', icon: <MoonOutlined />, color: '#8b5cf6' },
    { key: 'satellite', label: 'Satellite', icon: <GlobalOutlined />, color: '#10b981' },
    { key: 'streets', label: 'Rues', icon: <EnvironmentOutlined />, color: '#3b82f6' }
  ];
  
  const currentThemeConfig = themes.find(t => t.key === currentTheme) || themes[0];
  
  const menu = (
    <Menu className="theme-menu">
      {themes.map(theme => (
        <Menu.Item 
          key={theme.key}
          onClick={() => onThemeChange(theme.key)}
          className={currentTheme === theme.key ? 'active' : ''}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ color: theme.color, fontSize: 16 }}>{theme.icon}</div>
            <span>{theme.label}</span>
            {currentTheme === theme.key && (
              <span style={{ marginLeft: 'auto', color: theme.color }}>✓</span>
            )}
          </div>
        </Menu.Item>
      ))}
    </Menu>
  );
  
  return (
    <Dropdown 
      overlay={menu} 
      placement="bottomRight" 
      trigger={['click']}
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <Tooltip title="Changer le style de carte">
        <button className="theme-btn" style={{ borderColor: currentThemeConfig.color }}>
          {currentThemeConfig.icon}
        </button>
      </Tooltip>
    </Dropdown>
  );
};