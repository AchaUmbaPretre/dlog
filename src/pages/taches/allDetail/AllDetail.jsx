import React, { useEffect, useState } from 'react'
import './allDetail.scss'
import { getAllTache } from '../../../services/tacheService';

const AllDetail = ({idTache}) => {
    const [data, setData] = useState([]);

    useEffect(()=>{
        const fetchData = async() =>{
            try {
                const res = await Promise.all(
                    idTache.map(id =>
                        getAllTache(id)
                    )
                )
                const flattenedData = res.flat();
                setData(flattenedData)
            } catch (error) {
                console.log(error)
            }
        }
        fetchData();

    }, [idTache])

  return (
    <>
        <div className="allDetail">
            
        </div>
    </>
  )
}

export default AllDetail