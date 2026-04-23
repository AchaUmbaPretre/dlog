import React, { useCallback, useEffect, useState } from 'react'
import { notification } from "antd";
import { getVehicule } from '../../../../services/charroiService'
import { getGeofenceVehiculeById } from '../../../../services/geofenceService';

const GeofencesVehicule = ({closeModal, fetchDatas, idGeofence}) => {
  const [vehicule, setVehicule] = useState([])
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const { data } = await getVehicule();
      setVehicule(data?.data);
    } catch (error) {
      notification.error({
        message: "Erreur de chargement",
        description: "Une erreur est survenue lors du chargement des données.",
      });
    } finally {
      setLoading(false)
    }
  }, [idGeofence]);

  const fetchDataAll = useCallback(async () => {
    try {
      const { data } = await getGeofenceVehiculeById(idGeofence);
      setData(data)
    } catch (error) {
      notification.error({
        message: "Erreur de chargement",
        description: "Une erreur est survenue lors du chargement des données.",
      });
    } finally {
      setLoading(false)
    }
  }, [idGeofence])

  useEffect(()=> {
    fetchData();
    fetchDataAll();
  }, [idGeofence])

  console.log(vehicule)

  return (
    <div>GeofencesVehicule</div>
  )
}

export default GeofencesVehicule