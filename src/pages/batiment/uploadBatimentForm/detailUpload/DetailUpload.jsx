import React, { useState } from 'react'
import { useEffect } from 'react';
import { getPlansOne } from '../../../../services/batimentService';
import { notification } from 'antd';
import './detailUpload.scss'

const DetailUpload = ({idBatiment}) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);


    useEffect(()=>{
        const fetchData = async() => {
            try {
                const {data} = await getPlansOne(idBatiment)
                setData(data)   
            } catch (error) {
                notification.error({
                    message: 'Erreur de chargement',
                    description: 'Une erreur est survenue lors du chargement des données.',
                  });
            } finally {
                setLoading(false);
              }
        }
        fetchData();
    }, [idBatiment])

  return (
    <div>DetailUpload</div>

  )
}

export default DetailUpload