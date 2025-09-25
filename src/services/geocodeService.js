// services/geocodeService.js
import { WarningOutlined } from '@ant-design/icons';
import { Tag } from 'antd';

// --- Zone de geofencing (ex: Kinshasa) ---
export const zoneAutorisee = {
  latMin: -4.6,
  latMax: -4.3,
  lngMin: 15.1,
  lngMax: 15.5,
};

export const getOdometer = (sensors = []) => {
  const odo = sensors.find((s) => s.type === "odometer");
  if (!odo) return null;

  // retirer " km" et convertir en nombre
  const kmString = odo.value || odo.val || "";
  const kmNumber = parseFloat(kmString.replace(/\s?km/i, '').replace(/,/g, ''));
  
  return isNaN(kmNumber) ? null : kmNumber;
};


export const getEngineStatus = (sensors = []) => {
    const engine = sensors.find((s) => s.type === "engine");
    return engine?.value === "On" ? "ON" : "OFF";
  };

export const getBatteryLevel = (sensors = []) => {
    const battery = sensors.find((s) => s.type === "battery");
    return battery ? battery.value : null;
  };

  // --- Fonction pour détecter les alertes ---
export const getAlerts = (record) => {
    let alerts = [];

    // Survitesse
    if (record.speed > 100) {
      alerts.push(<Tag color="red" icon={<WarningOutlined />}>Survitesse</Tag>);
    }

    // Hors ligne
    if (record.online === "offline") {
      alerts.push(<Tag color="volcano" icon={<WarningOutlined />}>Perte Signal</Tag>);
    }

    // Geofencing
    if (
      record.lat < zoneAutorisee.latMin ||
      record.lat > zoneAutorisee.latMax ||
      record.lng < zoneAutorisee.lngMin ||
      record.lng > zoneAutorisee.lngMax
    ) {
      alerts.push(<Tag color="orange" icon={<WarningOutlined />}>Hors Zone</Tag>);
    }

    // Batterie faible
    const battery = getBatteryLevel(record.sensors);
    if (battery !== null && battery < 20) {
      alerts.push(<Tag color="blue" icon={<WarningOutlined />}>Batterie Faible</Tag>);
    }

    return alerts.length > 0 ? alerts : <Tag color="default">Aucune</Tag>;
  };
