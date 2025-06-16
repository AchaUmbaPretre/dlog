import { useEffect, useState } from 'react'
import './listCroquis.scss'
import { getPlans } from '../../../services/batimentService'
import { notification, Input, Select } from 'antd';
import config from '../../../config';
import { FileTextOutlined, CalendarOutlined } from '@ant-design/icons';
import { getBatiment } from '../../../services/typeService';

const { Search } = Input;

const ListCroquis = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const DOMAIN = config.REACT_APP_SERVER_DOMAIN;
    const [searchValue, setSearchValue] = useState('');
    const [batiment, setBatiment] = useState([]);
    const [selectedBatiment, setSelectedBatiment] = useState([]);


useEffect(() => {
    const fetchData = async () => {
        try {
            const [ planData, batimentData ] = await Promise.all([
                getPlans(),
                getBatiment()
            ])
            setData(planData.data)
            setBatiment(batimentData.data)
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
                <div className="list_croquis_top">
                    <h2 className="list_croquis_h2">Liste des croquis</h2>
                </div>
                <div className="list_croquis_row_filter">
                    <div className="list_croquis_left">
                        <Search placeholder="Recherche..." 
                            enterButton 
                            onChange={(e) => setSearchValue(e.target.value)}
                        />
                    </div>
                    <div className="list_croquis_right">
                        <Select
                            mode="multiple"
                            showSearch
                            style={{ width: '100%' }}
                            options={batiment.map((item) => ({
                                value: item.id_batiment,
                                label: item.nom_batiment,
                            }))}
                            placeholder="Sélectionnez un batiment ..."
                            optionFilterProp="label"
                            onChange={setSelectedBatiment}
                        />
                    </div>
                </div>
                <div className="list_croquis_bottom">
                    <div className="list_croquis_rows">
                    { data?.map((dd) => (
                        <div className="list_croquis_row">
                            <div className="list_croquis_title_row">
                                <h1 className="list_croquis_h1"><FileTextOutlined /> Croquis {dd.nom_document}</h1>
                                <span className="list_span_croquis"><strong style={{color:'black'}}><CalendarOutlined style={{color:'blue'}} /> Date : </strong>{new Date(dd.date_ajout).toLocaleDateString()}</span>
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