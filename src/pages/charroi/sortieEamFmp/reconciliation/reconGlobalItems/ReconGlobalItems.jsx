import React, { useEffect, useState } from 'react'
import { getReconGlobalItem } from '../../../../../services/sortieEamFmp';

const ReconGlobalItems = () => {
    const [data, setData] = useState([]);
    
    useEffect(()=> {
            const fetchData = async() => {
                try {
                    const response = await getReconGlobalItem();
                    setData(response.data)
                } catch (error) {
                    console.log(error)
                }
            }
    
            fetchData();
    }, []);

  return (
    <div>ReconGlobalItems</div>
  )
}

export default ReconGlobalItems