import React from 'react'
import './rapportCarburant.scss';

const RapportCarburant = () => {

  return (
    <>
        <div className="rapport__carburant">
            <div className="rapport__carburant__container">
                <h1 className="rapport__carburant__title">Rapport de gestion du carburant</h1>
                <div className="rapport__carburant__wrapper">
                    <div className="rapport__resume">
                        <h2 className="rapport_title">Résume</h2>
                        <div className="rapport__resume_rows">
                            <div className="rapport__resume_container"></div>
                            <div className="rapport__resume_row">
                                <span className="rapport_carburant_desc">Total des pleins enregistrés</span>
                                <strong>50</strong>
                            </div>

                            <div className="rapport__resume_row">
                                <span className="rapport_carburant_desc">Cout total en CDF</span>
                                <strong>50.000</strong>
                            </div>

                            <div className="rapport__resume_row">
                                <span className="rapport_carburant_desc">Cout total en $</span>
                                <strong>50</strong>
                            </div>
                            
                            <div className="rapport__resume_row">
                                <span className="rapport_carburant_desc">Consom. total</span>
                                <strong>12.000L</strong>
                            </div>

                            <div className="rapport__resume_row">
                                <span className="rapport_carburant_desc">Consom. moyenne</span>
                                <strong>28,5 L/100km</strong>
                            </div>
                        </div>
                    </div>

                    <div className="rapport__carburant_graphique">
                        <h2 className="rapport_title">Graphiques</h2>
                        <div className="rapport_graphique_rows">
                            <div className="rapport_graphique_row">
                                <h3 className="rapport__soustitle">Consommation par vehicule</h3>
                            </div>

                            <div className="rapport_graphique_row">
                                <h3 className="rapport__soustitle">Evolution du cout par semaine</h3>
                            </div>

                            <div className="rapport_graphique_row">
                                <h3 className="rapport__soustitle">Repartition du carburant par cat. vehicule</h3>
                            </div>
                        </div>
                    </div>

                    <div className="rapport__detail_vehicule">
                        <h2 className="rapport_title">Détail par véhicule</h2>
                    </div>
                </div>
            </div>
        </div>
    </>
  )
}

export default RapportCarburant