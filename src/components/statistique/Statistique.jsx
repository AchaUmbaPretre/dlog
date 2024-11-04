import React, { useEffect, useState } from 'react';
import { FileSyncOutlined, FileDoneOutlined, TeamOutlined } from '@ant-design/icons';
import { Skeleton, notification } from 'antd';
import './statistique.scss';
import StatChart from '../statChart/StatChart';
import CountUp from 'react-countup';
import { getControleCount } from '../../services/controleService';
import { getTacheCount } from '../../services/tacheService';
import { getClientCount } from '../../services/clientService';
import { getFournisseurCount } from '../../services/fournisseurService';
import { useNavigate } from 'react-router-dom';

const Statistique = () => {
    const [data, setData] = useState(null);
    const [tache, setTache] = useState(null);
    const [client, setClient] = useState(null);
    const [fournisseur, setFournisseur] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const handleError = (message) => {
        notification.error({
            message: 'Erreur de chargement',
            description: message,
        });
    };

    const datas = [
        {
          task: 'Complété',
          count: 45,
          color: '#6a8caf', 
        },
        {
          task: 'En cours',
          count: 30,
          color: '#b0b0b0', 
        },
        {
          task: 'En attente',
          count: 15,
          color: '#f4a261',  
        },
        {
          task: 'En retard',
          count: 10,
          color: '#90e0ef',  
        },
      ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [controleData, tacheData, clientData, fournisseurData] = await Promise.all([
                    getControleCount(),
                    getTacheCount(),
                    getClientCount(),
                    getFournisseurCount()
                ]);

                setData(controleData.data[0].nbre_controle);
                setTache(tacheData.data[0].nbre_tache);
                setClient(clientData.data[0].nbre_client);
                setFournisseur(fournisseurData.data[0].nbre_fournisseur);
                setLoading(false);

            } catch (error) {
                handleError('Une erreur est survenue lors du chargement des données.');
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="statistique">
            <div className="statistique_rows">
                {loading ? (
                    <>
                        <div className="statistique_row">
                            <Skeleton active paragraph={{ rows: 1 }} />
                        </div>
                        <div className="statistique_row">
                            <Skeleton active paragraph={{ rows: 1 }} />
                        </div>
                        <div className="statistique_row">
                            <Skeleton active paragraph={{ rows: 1 }} />
                        </div>
                        <div className="statistique_row">
                            <Skeleton active paragraph={{ rows: 1 }} />
                        </div>
                    </>
                ) : (
                    <>
                        <div className="statistique_row" onClick={()=>navigate('/controle')}>
                            <div className="statistique_row_left">
                                <div className="statistique_row_icon" style={{ background: 'rgba(0, 0, 255, 0.137)' }}>
                                    <FileDoneOutlined style={{ color: 'blue' }} />
                                </div>
                            </div>
                            <hr style={{ background: 'rgba(0, 0, 255, 0.137)', width: '4px', height: '30px', border: 'none' }} />
                            <div className="statistique_row_right">
                                <span className="row_title">Total</span>
                                <h2 className="statistique_h2"><CountUp end={data} /></h2>
                                <span className="row_desc">Contrôle de base</span>
                            </div>
                        </div>
                        <div className="statistique_row"  onClick={()=>navigate('/tache')}>
                            <div className="statistique_row_left">
                                <div className="statistique_row_icon" style={{ background: 'rgba(53, 52, 52, 0.137)' }}>
                                    <FileSyncOutlined style={{ color: 'rgba(53, 52, 52, 0.719)' }} />
                                </div>
                            </div>
                            <hr style={{ background: 'rgba(53, 52, 52, 0.137)', width: '4px', height: '30px', border: 'none' }} />
                            <div className="statistique_row_right">
                                <span className="row_title">Total</span>
                                <h2 className="statistique_h2"><CountUp end={tache} /></h2>
                                <span className="row_desc">Tâche</span>
                            </div>
                        </div>
                        <div className="statistique_row" onClick={()=>navigate('/client')}>
                            <div className="statistique_row_left">
                                <div className="statistique_row_icon" style={{ background: '#f079182d' }}>
                                    <TeamOutlined style={{ color: 'orange' }} />
                                </div>
                            </div>
                            <hr style={{ backgroundColor: '#f4a261', width: '5px', height: '30px', border: 'none' }} />
                            <div className="statistique_row_right">
                                <span className="row_title">Total</span>
                                <h2 className="statistique_h2"><CountUp end={client} /></h2>
                                <span className="row_desc">Client</span>
                            </div>
                        </div>
                        <div className="statistique_row" onClick={()=>navigate('/fournisseur')}>
                            <div className="statistique_row_left">
                                <div className="statistique_row_icon" style={{ background: '#90e1ef2a' }}>
                                    <TeamOutlined style={{ color: '#2bd2f0' }} />
                                </div>
                            </div>
                            <hr style={{ backgroundColor: '#90e1ef83', width: '5px', height: '30px', border: 'none' }} />
                            <div className="statistique_row_right">
                                <span className="row_title">Total</span>
                                <h2 className="statistique_h2"><CountUp end={fournisseur} /></h2>
                                <span className="row_desc">Fournisseur</span>
                            </div>
                        </div>
                    </>
                )}
            </div>
            <div className="statistique_bottom">
                <div className="statistique_bottom_rows">
                    <StatChart />
                </div>
            </div>
        </div>
    );
}

export default Statistique;