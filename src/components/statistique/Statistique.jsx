import { useCallback, useEffect, useState } from 'react';
import './statistique.scss';
import StatChart from '../statChart/StatChart';
import { getControleCount } from '../../services/controleService';
import { getTacheCount } from '../../services/tacheService';
import { getClientCount } from '../../services/clientService';
import { getFournisseurCount } from '../../services/fournisseurService';
import StatistiqueItems from '../statistiqueItems/StatistiqueItems';
import { useSelector } from 'react-redux';
import { notifyWarning } from '../../utils/notifyWarning';
import StatisticItems from './statisticItems/StatisticItems';
import StatiCarbItems from '../carburantGen/statiCarbItems/StatiCarbItems';
import StatCarbDepense from '../carburantGen/statCarbDepense/StatCarbDepense';
import StatCarbRepartion from '../carburantGen/statCarbRepartion/StatCarbRepartion';

const Statistique = () => {
    const [loading, setLoading] = useState(true);
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
            <StatiCarbItems/>
{/*             <div className="statistique_rows">
                <StatisticItems loading={loading} role={role} stats={stats} />
           </div> */}
            <div className="statistique_bottom">
{/*                 <div className="statistique_bottom_rows1">
                    <StatCarbDepense />
                </div> */}
                <>
                    <StatCarbDepense />
                </>
{/*                 {
                    role === 'Admin' &&
                    <div className="statistique_bottom_rows2">
                        <StatistiqueItems />
                    </div>
                } */}
                <>
                    <StatCarbRepartion />
                </>
            </div>
        </div>
    );
}

export default Statistique;
