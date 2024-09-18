import React, { useEffect, useState } from 'react'
import './allDetail.scss'

const AllDetail = ({idTache}) => {
    const [data, setData] = useState([]);

    useEffect(()=>{
        const fetchData = async() =>{
            try {
                
            } catch (error) {
                console.log(error)
            }
        }

    }, [idTache])

  return (
    <>
        <div className="allDetail">
            
        </div>
    </>
  )
}

export default AllDetail