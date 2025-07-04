import { Tag } from 'antd';
import {  ClockCircleOutlined, ExportOutlined, UndoOutlined, ReloadOutlined, PlayCircleOutlined, DeleteOutlined, ShoppingOutlined, SettingOutlined, SyncOutlined, ExclamationCircleOutlined, CloseCircleOutlined, FileWordOutlined,CarOutlined, StopOutlined, ToolOutlined, FileExcelOutlined, FileImageOutlined, FileTextOutlined, FilePdfOutlined, HourglassOutlined, WarningOutlined, CheckSquareOutlined, CheckCircleOutlined, DollarOutlined, RocketOutlined } from '@ant-design/icons'


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

export const icons = [
    { id: 'danger', label: 'Danger', icon: '⚠️' },
    { id: 'arrow', label: 'Flèche', icon: '➡️' },
    { id: 'hammer', label: 'Marteau', icon: '🔨' },
    { id: 'water', label: 'Goutte d’eau', icon: '💧' },
];

  export const colorMapping = {
    'En attente': '#FFA500',
    'En cours': '#1E90FF', 
    'Point bloquant': '#FF4500', 
    'En attente de validation': '#32CD32',
    'Validé': '#228B22',
    'Budget': '#FFD700',
    'Exécuté': '#A9A9A9',
    1: '#32CD32',
    0: '#FF6347'
};

export const statusIcons = {
  'En attente': {
    icon: <ClockCircleOutlined />,
    color: 'orange',
  },
  'En cours': {
    icon: <HourglassOutlined />,
    color: 'blue',
  },
  'Point bloquant': {
    icon: <WarningOutlined />,
    color: 'volcano',
  },
  'En attente de validation': {
    icon: <CheckSquareOutlined />,
    color: 'purple',
  },
  'Validé': {
    icon: <CheckCircleOutlined />,
    color: 'green',
  },
  'Budget': {
    icon: <DollarOutlined />,
    color: 'gold',
  },
  'Budget validé': {
    icon: <CheckCircleOutlined />,
    color: 'lime',
  },
  'Prête à exécution': {
    icon: <PlayCircleOutlined />,
    color: 'geekblue',
  },
  'Executé': {
    icon: <RocketOutlined />,
    color: 'cyan',
  },
  'Opérationnel': {
    icon: <CarOutlined />,
    color: 'green',
  },
  'En réparation': {
    icon: <ToolOutlined />,
    color: 'orange',
  },
  'Réparé': {
    icon: <ToolOutlined />,
    color: 'cyan',
  },
  'Immobile': {
    icon: <StopOutlined />,
    color: 'red',
  },
  'Annulé': {
    icon: <CloseCircleOutlined />,
    color: 'red',
  },
  'Retourné': {
    icon: <UndoOutlined />,
    color: 'magenta',
  },
  'Sortie': {
    icon: <ExportOutlined />,
    color: 'volcano',
  },
};

export const getTagProps = (type) => {
  switch (type) {
    case 'PDF':
      return { icon: <FilePdfOutlined />, color: 'red' };
    case 'Word':
      return { icon: <FileWordOutlined />, color: 'blue' };
    case 'Excel':
      return { icon: <FileExcelOutlined />, color: 'green' };
    case 'Image':
      return { icon: <FileImageOutlined />, color: 'orange' };
    default:
      return { icon: <FileTextOutlined />, color: 'default' };
  }
};

export const evaluationStatusMap = {

  'OK (R)': {
    color: 'green',
    icon: <CheckCircleOutlined />,
  },
  'PARTIEL (R)': {
    color: 'orange',
    icon: <ExclamationCircleOutlined />,
  },
  'NON EFFECTUE (R)': {
    color: 'red',
    icon: <CloseCircleOutlined />,
  },
  'RECIDIVE (R)': {
    color: 'volcano',
    icon: <WarningOutlined />,
  },
};

export const statutIcons = (type) => {
  let color = 'default';
  let icon = null;

  switch (type) {
    case 'En attente':
      color = 'orange';
      icon = <ClockCircleOutlined />;
      break;
    case 'En cours':
      color = 'blue';
      icon = <SyncOutlined spin />;
      break;
    case 'Terminé':
      color = 'green';
      icon = <CheckCircleOutlined />;
      break;
    case 'Réparé':
      color = 'cyan';
      icon = <ToolOutlined />;
      break;
    case 'Annulé':
      color = 'red';
      icon = <CloseCircleOutlined />;
      break;
    default:
      color = 'default';
      icon = null;
  }

  return { color, icon };
};

export const getInspectionIcon = (category) => {
  switch (category) {
    case 'Réparation':
      return { icon: <ToolOutlined spin />, color: 'geekblue' };
    case 'Remplacement':
      return { icon: <ReloadOutlined spin/>, color: 'volcano' };
    case 'Suppression':
      return { icon: <DeleteOutlined/>, color: 'red' };
    case 'Remplacement occasion':
      return { icon: <ShoppingOutlined />, color: 'orange' };
    case 'Réglage':
      return { icon: <SettingOutlined spin />, color: 'cyan' };
    default:
      return { icon: <ToolOutlined spin />, color: 'default' };
  }
}