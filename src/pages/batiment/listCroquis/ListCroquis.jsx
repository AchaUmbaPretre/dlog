import { useEffect, useState } from 'react'
import './listCroquis.scss'
import { getPlans } from '../../../services/batimentService'

const ListCroquis = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);

useEffect(() => {
    const fetchData = async () => {
        try {
            const { data } = await getPlans();
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
    fetchData()
}, [])

  return (
    <>
        <div className="list_croquis">
            <div className="list_croquis_wrapper">
                CROQUIS
            </div>
        </div>
    </>
  )
}

export default ListCroquis