import { Tag } from 'antd';
import {
  CalendarOutlined,
  MedicineBoxOutlined,
  StarOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';

export const renderTypeConge = (type) => {
  const map = {
    ANNUEL: {
      color: 'blue',
      icon: <CalendarOutlined />,
      label: 'Congé annuel'
    },
    MALADIE: {
      color: 'orange',
      icon: <MedicineBoxOutlined />,
      label: 'Congé maladie'
    },
    EXCEPTIONNEL: {
      color: 'purple',
      icon: <StarOutlined />,
      label: 'Congé exceptionnel'
    }
  };

  const conf = map[type];

  return conf ? (
    <Tag color={conf.color} icon={conf.icon}>
      {conf.label}
    </Tag>
  ) : (
    <Tag>-</Tag>
  );
};

export const renderStatutConge = (statut) => {
  const map = {
    EN_ATTENTE: {
      color: 'gold',
      icon: <ClockCircleOutlined />,
      label: 'En attente'
    },
    VALIDE: {
      color: 'green',
      icon: <CheckCircleOutlined />,
      label: 'Validé'
    },
    REFUSE: {
      color: 'red',
      icon: <CloseCircleOutlined />,
      label: 'Refusé'
    }
  };

  const conf = map[statut];

  return conf ? (
    <Tag color={conf.color} icon={conf.icon}>
      {conf.label}
    </Tag>
  ) : (
    <Tag>-</Tag>
  );
};
