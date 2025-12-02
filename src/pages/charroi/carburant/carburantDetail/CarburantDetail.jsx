import React, { useEffect, useState } from 'react'
import { notification, Collapse, Select, Skeleton, Alert } from 'antd';
import './carburantDetail.scss';
import { getCarburantOne } from '../../../../services/carburantService';

const CarburantDetail = ({id_vehicule, idCarburant}) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false)

    const fetchData = async()=> {
        try {
            const { data } = await getCarburantOne(id_vehicule, idCarburant)
            setData(data)
        } catch (error) {
            notification.error({
            message: 'Erreur de chargement',
            description: 'Une erreur est survenue lors du chargement des données.',
        });
        } finally {
            setLoading(false)
        }
    }

    useEffect(()=>{
        fetchData()
    }, [idCarburant])

  return (
    <div>CarburantDetail</div>
  )
}

export default CarburantDetail