import React, { useEffect, useState } from 'react'
import { getTemplateOne } from '../../../services/templateService';
import { notification } from 'antd';

const TemplateDetail = ({idTemplate}) => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);


    const fetchData = async () => {
        try {
          const { data } = await getTemplateOne(idTemplate);
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
      }, [idTemplate]);

  return (
    <>
        <div className="template_detail">
            
        </div>
    </>
  )
}

export default TemplateDetail