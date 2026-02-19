import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  CalendarOutlined,
  StopOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';

export  const statutConfig = {
    PRESENT: {
      label: "Présent",
      full: "Présent",
      color: "green",
      icon: <CheckCircleOutlined />,
    },
    ABSENT: {
      label: "Absent",
      full: "Absent",
      color: "red",
      icon: <CloseCircleOutlined />,
    },
    ABSENCE_JUSTIFIEE: {
      label: "AJ",
      full: "Absence justifiée",
      color: "orange",
      icon: <ExclamationCircleOutlined />,
    },
    JOUR_FERIE: {
      label: "JF",
      full: "Jour férié",
      color: "purple",
      icon: <CalendarOutlined />,
    },
    JOUR_NON_TRAVAILLE: {
      label: "Jour off",
      full: "Jour non travaillé",
      color: "default",
      icon: <StopOutlined style={{color:'red'}}/>,
    },
    SUPPLEMENTAIRE: {
      label: "SUP",
      full: "Heure supplémentaire",
      color: "blue",
      icon: <ClockCircleOutlined />,
    },
  };