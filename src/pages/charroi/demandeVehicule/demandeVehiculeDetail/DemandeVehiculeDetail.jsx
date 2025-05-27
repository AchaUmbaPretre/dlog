import { useState } from 'react'
import { getDemandeVehiculeOne } from '../../../../services/charroiService';

const DemandeVehiculeDetail = ({id_demande}) => {
    const [ data, setData] = useState([]);

    const fetchData = async() => {
        try {
            const [detailData] = await Promise.all([
                getDemandeVehiculeOne()
            ])
        } catch (error) {
            
        }
    }

  return (
    <>
        
    </>
  )
}

export default DemandeVehiculeDetail