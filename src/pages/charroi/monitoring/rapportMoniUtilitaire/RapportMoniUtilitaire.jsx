import React, { useEffect, useState } from 'react'
import './rapportMoniUtilitaire.scss'
import { getFalcon } from '../../../../services/rapportService';
import { notification } from 'antd';

const RapportMoniUtilitaire = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);


        const fetchData = async () => {
        try {
            const falconData = await getFalcon();
            const items = falconData.data[0].items || [];
            setData(items);
            setLoading(false);
        } catch (error) {
            console.error("Erreur fetchData:", error);
            notification.error({
            message: 'Erreur de chargement',
            description: 'Impossible de charger les données véhicules.',
            });
            setLoading(false);
        }
        };
    
        useEffect(() => {
            fetchData();
        }, []);

  return (
    <div>RapportMoniUtilitaire</div>
  )
}

export default RapportMoniUtilitaire