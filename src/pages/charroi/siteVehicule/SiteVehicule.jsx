import React, { useEffect, useState } from 'react'
import { getVehiculeOne } from '../../../services/charroiService'

const SiteVehicule = ({idVehicule}) => {
  const [data, setData] = useState([]);

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