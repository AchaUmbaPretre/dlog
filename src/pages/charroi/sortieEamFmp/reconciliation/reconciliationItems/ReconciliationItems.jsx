import React, { useEffect, useState } from 'react'
import { getReconGlobalItem } from '../../../../../services/sortieEamFmp';

const ReconciliationItems = (item) => {
    const [data, setData] = useState([]);

    useEffect(()=> {
        const fetchData = async() => {
            try {
                const response = await getReconGlobalItem(item);
                setData(response.data)
            } catch (error) {
                console.log(error)
            }
        }

        fetchData();
    }, []);

  return (
    <div>ReconciliationItems</div>
  )
}

export default ReconciliationItems