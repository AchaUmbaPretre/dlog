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
          <div className="mouv_vehicule_row">
            <div className="mouv_vehicule_card">
              <span>5</span>
              <span>Bons en attente</span>
            </div>

            <div className="mouv_vehicule_card">
              <span>4</span>
              <span>Véhicules hors site</span>
            </div>

            <div className="mouv_vehicule_card">
              <span>2</span>
              <span>Véhicules disponibles</span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default MouvementVehicule