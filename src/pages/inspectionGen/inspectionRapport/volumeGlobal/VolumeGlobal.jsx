import React, { useEffect, useState } from 'react'
import { getRapportInspectionRep } from '../../../../services/rapportService';

const VolumeGlobal = () => {
    const [data, setData] = useState([]);

    const fetchData = () => {
        try {
            const { data } = await getRapportInspectionRep()
            setData(data)
        } catch (error) {
            console.log(error)
        }
    };

    useEffect(()=> {
        fetchData();
    }, [])

    

  return (
    <>
        <div className="volumeGlobal">

        </div>
    </>
  )
}

export default VolumeGlobal