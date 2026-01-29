import { useEffect, useState, useCallback } from 'react';
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

const CACHE_KEY = 'statistiquesCache';

const Statistique = () => {
    const [stats, setStats] = useState({
        controle: null,
        tache: null,
        client: null,
        fournisseur: null,
    });
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();
    const role = useSelector((state) => state.user?.currentUser?.role);
    const userId = useSelector((state) => state.user?.currentUser?.id_utilisateur);

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

    // Mapping dynamique des statistiques
    const rows = [
        {
            key: 'controle',
            title: 'Ctrl de base',
            color: '#3A5FCD',
            icon: <FileDoneOutlined />,
            path: '/controle',
            adminOnly: true,
        },
        {
            key: 'tache',
            title: 'Tâche',
            color: '#707070',
            icon: <FileSyncOutlined />,
            path: '/tache',
        },
        {
            key: 'client',
            title: 'Client',
            color: '#FF8C42',
            icon: <TeamOutlined />,
            path: '/client',
        },
        {
            key: 'fournisseur',
            title: 'Fournisseur',
            color: '#2BA4C6',
            icon: <TeamOutlined />,
            path: '/fournisseur',
        },
    ];

    return (
        <div className="statistique">
            <div className="statistique_rows">
                {loading ? (
                    rows.map((row) => (
                        <Skeleton key={row.key} active paragraph={{ rows: 1 }} />
                    ))
                ) : (
                    rows.map((row) => {
                        if (row.adminOnly && role !== 'Admin') return null;
                        return (
                            <div
                                key={row.key}
                                className={`statistique_row`}
                                style={{ borderColor: row.color }}
                                onClick={() => navigate(row.path)}
                            >
                                <div className="statistique_row_left">
                                    <div
                                        className="statistique_row_icon"
                                        style={{ backgroundColor: `${row.color}1A` }}
                                    >
                                        {row.icon}
                                    </div>
                                </div>
                                <hr
                                    style={{
                                        backgroundColor: row.color,
                                        width: '4px',
                                        height: '30px',
                                        border: 'none',
                                    }}
                                />
                                <div className="statistique_row_right">
                                    <span className="row_title">Total</span>
                                    <h2 className="statistique_h2">
                                        <CountUp end={stats[row.key] ?? 0} />
                                    </h2>
                                    <span className="row_desc">{row.title}</span>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            <div className="statistique_bottom">
                <div className="statistique_bottom_rows1">
                    <StatChart />
                </div>
                {role === 'Admin' && (
                    <div className="statistique_bottom_rows2">
                        <StatistiqueItems />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Statistique;
