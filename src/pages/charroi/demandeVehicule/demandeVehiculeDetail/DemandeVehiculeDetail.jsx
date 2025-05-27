import { useEffect, useState } from 'react'
import { getDemandeVehiculeOne } from '../../../../services/charroiService';
import { notification } from 'antd';

const DemandeVehiculeDetail = ({id_demande_vehicule}) => {
    const [ data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchData = async() => {
        try {
            const [detailData] = await Promise.all([
                getDemandeVehiculeOne(id_demande_vehicule)
            ])

            setData(detailData.data)
        } catch (error) {
            notification.error({
                message: 'Erreur de chargement',
                description: 'Une erreur est survenue lors du chargement des données.',
            });
        } finally {
          setLoading(false);
        }
    }

    useEffect(() => {
        fetchData()
    }, [id_demande_vehicule])

  return (
    <>
        
    </>
  )
}

export default DemandeVehiculeDetail