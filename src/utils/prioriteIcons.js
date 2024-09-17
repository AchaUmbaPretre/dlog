import { StarFilled, StarTwoTone, StarOutlined } from '@ant-design/icons';
import { Tag } from 'antd';

/* export const getPriorityIcon = (priority) => {
    switch (priority) {
        case 1:
            return <StarFilled style={{ color: '#d9534f' }} />;
        case 2:
            return <StarTwoTone twoToneColor="#f0ad4e" />;
        case 3:
            return <StarOutlined style={{ color: '#5bc0de' }} />;
        case 4:
            return <StarOutlined style={{ color: '#5cb85c' }} />;
        case 5:
            return <StarOutlined style={{ color: '#0275d8' }} />;
        default:
            return <StarOutlined />;
    }
}; */

export const getPriorityIcon = (priority) => {
    switch (priority) {
      case 1:
        return '🟢'; // Icone pour Très faible
      case 2:
        return '🟡'; // Icone pour Faible
      case 3:
        return '🟠'; // Icone pour Moyenne
      case 4:
        return '🔴'; // Icone pour Haute
      case 5:
        return '⚫'; // Icone pour Très haute
      default:
        return '⚪'; // Icone par défaut
    }
  };

export const getPriorityColor = (priority) => {
    switch (priority) {
      case 1:
        return 'green';
      case 2:
        return 'lime';
      case 3:
        return 'orange';
      case 4:
        return 'red';
      case 5:
        return 'magenta';
      default:
        return 'gray';
    }
  };


export const getPriorityTag = (priority) => {
    const icon = getPriorityIcon(priority);
    
    const colorMap = {
        1: 'default',   
        2: 'blue',      
        3: 'yellow',    
        4: 'orange',    
        5: 'red'   
    };

    const priorityTextMap = {
        1: 'Très faible',
        2: 'Faible',
        3: 'Moyenne',
        4: 'Haute',
        5: 'Très haute'
    };
    
    const color = colorMap[priority] || 'default';
    
    const priorityText = priorityTextMap[priority] || 'Inconnue';
    
    return (
        <Tag icon={icon} color={color}>
            {priorityText}
        </Tag>
    );
};

export const getPriorityLabel = (priority) => {
    switch (priority) {
      case 1:
        return 'Très faible';
      case 2:
        return 'Faible';
      case 3:
        return 'Moyenne';
      case 4:
        return 'Haute';
      case 5:
        return 'Très haute';
      default:
        return 'Non définie';
    }
  };