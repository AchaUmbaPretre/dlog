import React from 'react'

const RapportCarburant = () => {
  return (
    <>
        <div className="rapport__carburant">
            <div className="rapport__carburant__container">
                <h1 className="rapport__carburant__title">Rapport de gestion du carburant</h1>
                <div className="rapport__resume">
                    <div className="rapport__resume_rows">
                        <div className="rapport__resume_container">
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
                </div>
            </div>
        </div>
    </>
  )
}

export default RapportCarburant