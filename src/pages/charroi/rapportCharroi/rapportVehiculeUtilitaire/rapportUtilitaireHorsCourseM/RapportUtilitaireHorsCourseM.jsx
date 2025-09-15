import React from 'react'

const RapportUtilitaireHorsCourseM = () => {
  return (
    <>
        <div className="rapportUtilitaire_dispo">
            <h2 className="rapport_h2">Moyennes pour les véhicules hors course</h2>
            <div className="rapport_utilitaire_dispo_wrapper">
                <Table
                  columns={columns}
                  dataSource={data}
                  rowKey="id_vehicule"
                  rowClassName={(record, index) => (index % 2 === 0 ? 'odd-row' : 'even-row')}
                  bordered
                  size="small" 
                  loading={loading}
                />
            </div>
        </div>
    </>
  )
}

export default RapportUtilitaireHorsCourseM