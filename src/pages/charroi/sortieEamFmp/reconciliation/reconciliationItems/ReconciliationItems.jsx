import React, { useEffect, useState } from 'react'
import { getReconciliationItem, getReconGlobalItem } from '../../../../../services/sortieEamFmp';

const ReconciliationItems = ({items}) => {
    const [data, setData] = useState([]);

    console.log(items)

    useEffect(()=> {
        const fetchData = async() => {
            try {
                const response = await getReconciliationItem(items);
                setData(response.data)
            } catch (error) {
                console.log(error)
            }
        }

        fetchData();
    }, [items]);

  return (
    <div>ReconciliationItems</div>
  )
}

export default ReconciliationItems