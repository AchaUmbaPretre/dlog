import { useCallback, useEffect, useState } from "react";
import { notifyWarning } from "../../../../utils/notifyWarning";
import { getPresenceDashboardPerformance } from "../../../../services/presenceService";
import { getSite } from "../../../../services/charroiService";
import { getUser } from "../../../../services/userService";

export const useRapportPerformance = () => {
    const [presences, setPresences] = useState([]);
    const [sites, setSites] = useState([]);
    const [users, setUsers] = useState([]);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);

    const load = useCallback(async () => {
        setLoading(true);
        try {
            // Appels parallèles aux APIs
            const [siteResponse, userResponse, presenceResponse] = await Promise.all([
                getSite(),
                getUser(),
                getPresenceDashboardPerformance()
            ]);

            // Traitement des réponses
            const sitesData = siteResponse?.data || [];
            const usersData = userResponse?.data || [];
            
            // La réponse de getPresenceDashboardPerformance peut avoir une structure différente
            // car elle retourne déjà les données formatées pour le dashboard
            const presenceData = presenceResponse?.data || {};

            setSites(sitesData);
            setUsers(usersData);
            
            // Si presenceResponse contient déjà les données structurées
            if (presenceData && typeof presenceData === 'object') {
                setData(presenceData);
                // Si vous avez besoin des présences brutes, les extraire de la réponse
                setPresences(presenceData.presences || []);
            } else {
                setPresences(presenceData);
            }

        } catch (error) {
            console.error("Erreur chargement performance", error);
            notifyWarning('Erreur chargement Performance', 'Chargement depuis le cache local…');
            
            // En cas d'erreur, initialiser avec des données vides
            setData({
                metadata: {
                    periode: {
                        debut: new Date().toISOString().split('T')[0],
                        fin: new Date().toISOString().split('T')[0],
                        jours_ouvrables: 0
                    }
                },
                kpi_globaux: {
                    taux_presence: 0,
                    taux_ponctualite: 0,
                    taux_activite: 0,
                    total_retards: 0,
                    retard_moyen: 0,
                    evolution_presence: 0
                },
                performances_sites: [],
                top_performeurs: [],
                agents_probleme: []
            });
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        load();
    }, [load]);

    // Fonction pour recharger avec des paramètres spécifiques
    const reloadWithParams = useCallback(async (params = {}) => {
        setLoading(true);
        try {
            const presenceResponse = await getPresenceDashboardPerformance(params);
            const presenceData = presenceResponse?.data || {};
            
            setData(presenceData);
            setPresences(presenceData.presences || []);
            
        } catch (error) {
            console.error("Erreur rechargement performance", error);
            notifyWarning('Erreur rechargement Performance');
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        data,           // Données formatées pour le dashboard
        presences,      // Liste brute des présences
        sites,          // Liste des sites
        users,          // Liste des utilisateurs
        loading,        // État de chargement
        reload: load,   // Fonction de rechargement
        reloadWithParams // Rechargement avec paramètres (date, site, etc.)
    };
};