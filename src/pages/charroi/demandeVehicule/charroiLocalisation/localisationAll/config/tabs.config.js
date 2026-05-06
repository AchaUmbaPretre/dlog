// config/tabs.config.js
import { 
  EnvironmentOutlined, 
  CarOutlined, 
  ToolOutlined, 
  BarChartOutlined 
} from '@ant-design/icons';

export const TAB_SECTIONS = [
  { 
    id: 'map', 
    label: 'Carte', 
    icon: <EnvironmentOutlined />, 
    description: 'Visualisation géographique',
    badgeKey: 'filteredVehicles',
    badgeColor: '#1890ff'
  },
  { 
    id: 'driving', 
    label: 'Conduite', 
    icon: <CarOutlined />, 
    description: 'Analyse comportementale',
    badgeKey: null,
    badgeColor: '#52c41a'
  },
  { 
    id: 'maintenance', 
    label: 'Maintenance', 
    icon: <ToolOutlined />, 
    description: 'Suivi préventif',
    badgeKey: 'alerts',
    badgeColor: '#faad14'
  },
  { 
    id: 'reports', 
    label: 'Rapports', 
    icon: <BarChartOutlined />, 
    description: 'Statistiques avancées',
    badgeKey: null,
    badgeColor: null
  }
];