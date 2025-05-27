import { useState } from 'react'
import { getDemandeVehiculeOne } from '../../../../services/charroiService';

const DemandeVehiculeDetail = ({id_demande_vehicule}) => {
    const [ data, setData] = useState([]);

    const fetchData = async() => {
        try {
            const [detailData] = await Promise.all([
                getDemandeVehiculeOne(id_demande_vehicule)
            ])
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
    }, [])

  return (
    <>
        
    </>
  )
}

export default DemandeVehiculeDetail