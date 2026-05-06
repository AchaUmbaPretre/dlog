// components/TabNavigation.jsx
import { Badge, Tooltip } from 'antd';
import { ThunderboltOutlined } from '@ant-design/icons';
import { TAB_SECTIONS } from '../config/tabs.config';

const TabNavigation = ({ 
  activeSection, 
  onTabChange, 
  onTabHover, 
  onTabLeave,
  stats,
  filteredCount 
}) => {
  const getBadgeCount = (section) => {
    if (section.id === 'map') return filteredCount;
    if (section.id === 'maintenance') return stats?.alerts || 0;
    return null;
  };

  return (
    <div className="premium-tabs">
      <div className="tabs-container">
        {TAB_SECTIONS.map(section => {
          const badgeCount = getBadgeCount(section);
          
          return (
            <Tooltip 
              key={section.id} 
              title={section.description}
              placement="bottom"
              mouseEnterDelay={0.3}
            >
              <button
                className={`premium-tab ${activeSection === section.id ? 'active' : ''}`}
                onClick={() => onTabChange(section.id)}
                onMouseEnter={() => onTabHover(section.id)}
                onMouseLeave={onTabLeave}
              >
                <div className="tab-icon-wrapper">
                  <span className="tab-icon">{section.icon}</span>
                  {badgeCount !== null && badgeCount > 0 && (
                    <Badge 
                      count={badgeCount} 
                      size="small"
                      style={{ 
                        backgroundColor: section.badgeColor,
                        position: 'absolute',
                        top: -8,
                        right: -12,
                        fontSize: 10,
                        height: 18,
                        minWidth: 18,
                        lineHeight: '18px',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                      }} 
                    />
                  )}
                </div>
                <span className="tab-label">{section.label}</span>
                <div className="tab-underline"></div>
              </button>
            </Tooltip>
          );
        })}
      </div>
      
      <div className="realtime-status">
        <div className="status-dot"></div>
        <span className="status-text">
          {stats?.online || 0} véhicule(s) actif(s)
        </span>
        <div className="status-divider"></div>
        <ThunderboltOutlined className="status-icon" />
        <span className="status-text">Temps réel</span>
      </div>
    </div>
  );
};

export default TabNavigation;