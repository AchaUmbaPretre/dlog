import React, { useEffect, useState } from 'react'
import { getVehiculeOne, postSiteVehicule } from '../../../services/charroiService'

const SiteVehicule = ({idVehicule}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  

  const fetchData = async() => {
    try {
      const { data } = await getVehiculeOne(idVehicule)
      setData(data?.data[0])
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(()=> {
    fetchData()
  }, [idVehicule])

  const onFinish = async() => {
    setLoading(true)
    try {
      message.loading({ content: 'En cours...', key: 'submit' });
      await postSiteVehicule({

      })
    } catch (error) {
      message.error({ content: 'Une erreur est survenue.', key: 'submit' });
      console.error('Erreur lors de l\'ajout d affectation:', error);
    }
  }

  return (
    <>
      <div className="site_vehicule">
        <div className="site_vehicule_wrapper">
          {JSON.stringify(data)}
        </div>
      </div>
    </>
  )
}

export default SiteVehicule