import { notification } from 'antd';
import React, { useEffect, useState } from 'react'
import { getDeclarationOne } from '../../../services/templateService';

const DeclarationDetail = ({idDeclaration}) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

        const fetchDatas = async () => {
          try {
            const response = await getDeclarationOne(idDeclaration);
            setData(response.data[0]);
          } catch (error) {
            notification.error({
              message: 'Erreur de chargement',
              description: 'Une erreur est survenue lors du chargement des données. Veuillez réessayer plus tard.',
            });
          } finally {
            setLoading(false);
          }
        };
    
    useEffect(() => {
        fetchDatas();
      }, [idDeclaration]);
    

  return (
    <div>DeclarationDetail</div>
  )
}

export default DeclarationDetail