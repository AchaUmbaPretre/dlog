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
                        <Skeleton active paragraph={{ rows: 1 }} />
                        <Skeleton active paragraph={{ rows: 1 }} />
                        <Skeleton active paragraph={{ rows: 1 }} />
                        <Skeleton active paragraph={{ rows: 1 }} />
                    </>
                ) : (
                    <>
                        <div className="statistique_row static_bleu" style={{ borderColor: '#3A5FCD' }} onClick={() => navigate('/controle')}>
                            <div className="statistique_row_left">
                                <div className="statistique_row_icon" style={{ backgroundColor: '#3A5FCD1A' }}>
                                    <FileDoneOutlined style={{ color: '#3A5FCD' }} />
                                </div>
                            </div>
                            <hr style={{ backgroundColor: '#3A5FCD', width: '4px', height: '30px', border: 'none' }} />
                            <div className="statistique_row_right">
                                <span className="row_title">Total</span>
                                <h2 className="statistique_h2"><CountUp end={data} /></h2>
                                <span className="row_desc">Ctrl de base</span>
                            </div>
                        </div>
                        <div className="statistique_row static_gris" style={{ borderColor: '#707070' }} onClick={() => navigate('/tache')}>
                            <div className="statistique_row_left">
                                <div className="statistique_row_icon" style={{ backgroundColor: '#7070701A' }}>
                                    <FileSyncOutlined style={{ color: '#707070' }} />
                                </div>
                            </div>
                            <hr style={{ backgroundColor: '#707070', width: '4px', height: '30px', border: 'none' }} />
                            <div className="statistique_row_right">
                                <span className="row_title">Total</span>
                                <h2 className="statistique_h2"><CountUp end={tache} /></h2>
                                <span className="row_desc">Tâche</span>
                            </div>
                        </div>
                        <div className="statistique_row static_orange" style={{ borderColor: '#FF8C42' }} onClick={() => navigate('/client')}>
                            <div className="statistique_row_left">
                                <div className="statistique_row_icon" style={{ backgroundColor: '#FF8C421A' }}>
                                    <TeamOutlined style={{ color: '#FF8C42' }} />
                                </div>
                            </div>
                            <hr style={{ backgroundColor: '#FF8C42', width: '5px', height: '30px', border: 'none' }} />
                            <div className="statistique_row_right">
                                <span className="row_title">Total</span>
                                <h2 className="statistique_h2"><CountUp end={client} /></h2>
                                <span className="row_desc">Client</span>
                            </div>
                        </div>
                        <div className="statistique_row static_cyan" style={{ borderColor: '#2BA4C6' }} onClick={() => navigate('/fournisseur')}>
                            <div className="statistique_row_left">
                                <div className="statistique_row_icon" style={{ backgroundColor: '#2BA4C61A' }}>
                                    <TeamOutlined style={{ color: '#2BA4C6' }} />
                                </div>
                            </div>
                            <hr style={{ backgroundColor: '#2BA4C6', width: '5px', height: '30px', border: 'none' }} />
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
