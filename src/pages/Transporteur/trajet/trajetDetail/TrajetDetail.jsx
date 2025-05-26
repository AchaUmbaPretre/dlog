import { useEffect, useState } from 'react'
import './trajetDetail.scss'
import { getTrajetOne } from '../../../../services/transporteurService'

const TrajetDetail = ({id_trajet}) => {
    const [ data, setData ] = useState([]);

    useEffect(()=> {
        const fetchData = async() => {
            const { data } = await getTrajetOne(id_trajet);
            setData(data)
        }

        fetchData()
    },[id_trajet]);

  return (
    <>
        <div className="trajetDetail">
            
        </div>
    </>
  )
}

export default TrajetDetail