import { Select } from 'antd';
import './mouvementVehicule.scss'
import { useState } from 'react';
import MouvementFilter from './mouvementFilter/MouvementFilter';
const { Option } = Select;


const MouvementVehicule = () => {


  return (
    <>
      <div className="mouvement_vehicule">
        <div className="mouv_vehicule_wrapper">
          <MouvementFilter/>
        </div>
      </div>
    </>
  )
}

export default MouvementVehicule