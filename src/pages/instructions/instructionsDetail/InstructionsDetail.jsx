import React, { useEffect, useState } from 'react'
import { getInspectionOne, getInspectionOneV } from '../../../services/batimentService';
import { notification } from 'antd';

const InstructionsDetail = ({idInspection}) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);



    const fetchData = async () => {

        try {
          const { data } = await getInspectionOneV(idInspection);
          setData(data);
          setLoading(false);
        } catch (error) {
          notification.error({
            message: 'Erreur de chargement',
            description: 'Une erreur est survenue lors du chargement des données.',
          });
          setLoading(false);
        }
      };

      useEffect(() => {
        fetchData();
      }, [idInspection]);
  return (
    <>

    </>
  )
}

export default InstructionsDetail