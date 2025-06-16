import { useEffect, useState } from 'react'
import './listCroquis.scss'
import { getPlans } from '../../../services/batimentService'
import { notification } from 'antd';
import config from '../../../config';

const ListCroquis = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const DOMAIN = config.REACT_APP_SERVER_DOMAIN;


useEffect(() => {
    const fetchData = async () => {
        try {
            const { data } = await getPlans();
            setData(data)
        } catch (error) {
            notification.error({
                message: 'Erreur de chargement',
                description: 'Une erreur est survenue lors du chargement des données.',
            });
        } finally {
            setLoading(false)
        }
    }
    fetchData()
}, [])

  return (
    <>
        <div className="list_croquis">
            <div className="list_croquis_wrapper">
                <div className="list_croquis_top"></div>
                <div className="list_croquis_bottom">
                    <div className="list_croquis_rows">
                    { data?.map((dd) => (
                        <div className="list_croquis_row">
                            <div className="list_croquis_title_row">
                                <h1 className="list_croquis_h1">Croquis {dd.nom_document}</h1>
                                <span className="list_span_croquis"><strong>Date : </strong>{new Date(dd.date_ajout).toLocaleDateString()}</span>
                            </div>
                            <img src={`${DOMAIN}/${dd.chemin_document}`} alt={dd.nom_document} className="list_croquis_img" />
                        </div>
                    ))}
                    </div>
                </div>
            </div>
        </div>
    </>
  )
}

export default ListCroquis