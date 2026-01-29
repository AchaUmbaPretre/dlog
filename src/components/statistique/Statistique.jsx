import { useCallback, useEffect, useState } from 'react';
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
import StatistiqueItems from '../statistiqueItems/StatistiqueItems';
import { useSelector } from 'react-redux';
import { notifyWarning } from '../../utils/notifyWarning';

const Statistique = () => {
    const [data, setData] = useState(null);
    const [tache, setTache] = useState(null);
    const [client, setClient] = useState(null);
    const [fournisseur, setFournisseur] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const role = useSelector((state) => state.user?.currentUser.role);
    const userId = useSelector((state) => state.user?.currentUser?.id_utilisateur);
    const [stats, setStats] = useState({
        controle: null,
        tache: null,
        client: null,
        fournisseur: null,
    });

    const CACHE_KEY = 'statistiquesCache';
    const loadFromCache = useCallback(() => {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) return JSON.parse(cached);
        return null;
    }, []);

    const saveToCache = useCallback((data) => {
        localStorage.setItem(CACHE_KEY, JSON.stringify(data));
    }, []);

    const fetchData = useCallback(async () => {
        try {
            const [controleData, tacheData, clientData, fournisseurData] = await Promise.all([
                getControleCount(),
                getTacheCount(userId),
                getClientCount(),
                getFournisseurCount(),
            ]);

            const newStats = {
                controle: controleData.data[0]?.nbre_controle ?? 0,
                tache: tacheData.data[0]?.nbre_tache ?? 0,
                client: clientData.data[0]?.nbre_client ?? 0,
                fournisseur: fournisseurData.data[0]?.nbre_fournisseur ?? 0,
            };

            setStats(newStats);
            saveToCache(newStats);

        } catch (error) {
            console.error('Erreur fetchData:', error);

            notifyWarning('Erreur de chargement', 'Chargement depuis le cache local…');

            const cached = loadFromCache();
            if (cached) {
                setStats(cached);
            } else {
                setStats({ controle: 0, tache: 0, client: 0, fournisseur: 0 });
            }
        }
    }, [userId, loadFromCache, saveToCache]);

    // Retry automatique si nécessaire
    const retryFetch = useCallback(async (retries = 2) => {
        setLoading(true);
        for (let i = 0; i <= retries; i++) {
            try {
                await fetchData();
                break;
            } catch (err) {
                if (i === retries) console.error('Echec fetch après retries', err);
                else await new Promise(r => setTimeout(r, 2000));
            }
        }
        setLoading(false);
    }, [fetchData]);

    useEffect(() => {
        retryFetch();
    }, [retryFetch]);

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
                    {
                        role === 'Admin' &&
                        <div className="statistique_row static_bleu" style={{ borderColor: '#3A5FCD' }} onClick={() => navigate('/controle')}>
                            <div className="statistique_row_left">
                                <div className="statistique_row_icon" style={{ backgroundColor: '#3A5FCD1A' }}>
                                    <FileDoneOutlined style={{ color: '#3A5FCD' }} />
                                </div>
                            </div>
                            <hr style={{ backgroundColor: '#3A5FCD', width: '4px', height: '30px', border: 'none' }} />
                            <div className="statistique_row_right">
                                <span className="row_title">Total</span>
                                <h2 className="statistique_h2"><CountUp end={stats.controle} /></h2>
                                <span className="row_desc">Ctrl de base</span>
                            </div>
                        </div>
                    }
                        <div className="statistique_row static_gris" style={{ borderColor: '#707070' }} onClick={() => navigate('/tache')}>
                            <div className="statistique_row_left">
                                <div className="statistique_row_icon" style={{ backgroundColor: '#7070701A' }}>
                                    <FileSyncOutlined style={{ color: '#707070' }} />
                                </div>
                            </div>
                            <hr style={{ backgroundColor: '#707070', width: '4px', height: '30px', border: 'none' }} />
                            <div className="statistique_row_right">
                                <span className="row_title">Total</span>
                                <h2 className="statistique_h2"><CountUp end={stats.tache} /></h2>
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
                                <h2 className="statistique_h2"><CountUp end={stats.client} /></h2>
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
                                <h2 className="statistique_h2"><CountUp end={stats.fournisseur} /></h2>
                                <span className="row_desc">Fournisseur</span>
                            </div>
                        </div>
                    </>
                )}
            </div>
            <div className="statistique_bottom">
                <div className="statistique_bottom_rows1">
                    <StatChart />
                </div>
                {
                    role === 'Admin' &&
                    <div className="statistique_bottom_rows2">
                        <StatistiqueItems />
                    </div>
                }
            </div>
        </div>
    );
}

export default Statistique;
