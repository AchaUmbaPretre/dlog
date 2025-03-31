import React from 'react'

const RapportCloture = () => {
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 20,
      });

    

  return (
    <>
        <div className="rapport_facture">
            <h2 className="rapport_h2">RAPPORT CLOTURE</h2>
            <div className="rapport_wrapper_facture">

            </div>
        </div>
    </>
  )
}

export default RapportCloture