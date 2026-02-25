import { useCallback, useEffect, useState, useMemo } from "react";
import { getPresenceDashboardPerformance } from "../../../../services/presenceService";
import { getSite } from "../../../../services/charroiService";
import { getUser } from "../../../../services/userService";
import { notifySuccess, notifyWarning } from "../../../../utils/notifyWarning";

export const useRapportPerformance = () => {
    const [presences, setPresences] = useState([]);
    const [sites, setSites] = useState([]);
    const [users, setUsers] = useState([]);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        site_id: null,
        date_debut: null,
        date_fin: null
    });

    // Chargement des données de référence (sites et users)
    const loadReferenceData = useCallback(async () => {
        try {
            const [siteResponse, userResponse] = await Promise.all([
                getSite(),
                getUser()
            ]);

            setSites(siteResponse?.data || []);
            setUsers(userResponse?.data || []);
            
        } catch (error) {
            console.error("Erreur chargement données référence", error);
            notifyWarning('Erreur chargement sites/utilisateurs');
        }
    }, []);

    // Chargement des données de performance
    const loadPerformanceData = useCallback(async (params = {}) => {
        setLoading(true);
        setError(null);
        
        try {
            const presenceResponse = await getPresenceDashboardPerformance(params);
            
            // Vérifier la structure de la réponse
            if (presenceResponse?.success === false) {
                throw new Error(presenceResponse.message || "Erreur lors du chargement");
            }
            
            const presenceData = presenceResponse?.data || {};
            
            setData(presenceData);
            setPresences(presenceData.presences || []);
            
            return presenceData;
            
        } catch (error) {
            console.error("Erreur chargement performance", error);
            setError(error.message || "Erreur de chargement");
            notifyWarning('Erreur chargement Performance', 'Chargement depuis le cache local…');
            
            // Données par défaut en cas d'erreur
            const defaultData = {
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
                    evolution_presence: 0,
                    total_heures_sup: 0,
                    employes_absents: 0,
                    absences_justifiees: 0
                },
                performances_sites: [],
                top_performeurs: [],
                agents_probleme: []
            };
            
            setData(defaultData);
            return defaultData;
            
        } finally {
            setLoading(false);
        }
    }, []);

    // Chargement initial complet
    const load = useCallback(async () => {
        setLoading(true);
        setError(null);
        
        try {
            // Appels parallèles aux APIs
            const [siteResponse, userResponse, presenceResponse] = await Promise.all([
                getSite(),
                getUser(),
                getPresenceDashboardPerformance(filters)
            ]);

            // Traitement des réponses
            const sitesData = siteResponse?.data.data || [];
            const usersData = userResponse?.data || [];
            const presenceData = presenceResponse?.data || {};

            setSites(sitesData);
            setUsers(usersData);
            
            setData(presenceData);
            setPresences(presenceData.presences || []);
            
            notifySuccess('Données chargées avec succès');
            
        } catch (error) {
            console.error("Erreur chargement performance", error);
            setError(error.message || "Erreur de chargement");
            notifyWarning('Erreur chargement Performance', 'Chargement depuis le cache local…');
            
            // Données par défaut en cas d'erreur
            const defaultData = {
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
                    evolution_presence: 0,
                    total_heures_sup: 0,
                    employes_absents: 0,
                    absences_justifiees: 0
                },
                performances_sites: [],
                top_performeurs: [],
                agents_probleme: []
            };
            
            setData(defaultData);
            setPresences([]);
            
        } finally {
            setLoading(false);
        }
    }, [filters]);

    // Rechargement avec nouveaux filtres
    const reloadWithParams = useCallback(async (newFilters = {}) => {
        // Mettre à jour les filtres
        setFilters(prev => {
            const updated = { ...prev, ...newFilters };
            return updated;
        });
        
        // Charger les données avec les nouveaux filtres
        setLoading(true);
        setError(null);
        
        try {
            const params = { ...filters, ...newFilters };
            const presenceResponse = await getPresenceDashboardPerformance(params);
            const presenceData = presenceResponse?.data || {};
            
            setData(presenceData);
            setPresences(presenceData.presences || []);
            
            notifySuccess('Données mises à jour');
            return presenceData;
            
        } catch (error) {
            console.error("Erreur rechargement performance", error);
            setError(error.message || "Erreur de rechargement");
            notifyWarning('Erreur rechargement Performance');
            return null;
        } finally {
            setLoading(false);
        }
    }, [filters]);

    // Mise à jour des filtres sans rechargement
    const updateFilters = useCallback((newFilters) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
    }, []);

    // Réinitialiser les filtres
    const resetFilters = useCallback(() => {
        setFilters({
            site_id: null,
            date_debut: null,
            date_fin: null
        });
    }, []);

    // Effet pour charger les données de référence au montage
    useEffect(() => {
        loadReferenceData();
    }, [loadReferenceData]);

    // Effet pour charger les données quand les filtres changent
    useEffect(() => {
        load();
    }, [filters.site_id, filters.date_debut, filters.date_fin]);

    // Données calculées pour faciliter l'utilisation dans les composants
    const computedData = useMemo(() => {
        if (!data) return null;

        // S'assurer que les données ont la bonne structure
        const kpi = data.kpi_globaux || {};
        const sitesData = data.performances_sites || [];
        const top = data.top_performeurs || [];
        const probleme = data.agents_probleme || [];
        const metadata = data.metadata || {};

        // Statistiques supplémentaires
        const stats = {
            totalEmployes: users.length,
            totalSites: sites.length,
            sitesAvecProblemes: sitesData.filter(s => (s.performance || 0) < 75).length,
            topPerformeursCount: top.length,
            agentsProblemeCount: probleme.length,
            
            // Moyennes globales
            moyennePresenceParSite: sitesData.length > 0 
                ? sitesData.reduce((acc, site) => acc + (site.taux_presence || 0), 0) / sitesData.length
                : 0,
            
            meilleurSite: sitesData.length > 0 
                ? sitesData.sort((a, b) => (b.performance || 0) - (a.performance || 0))[0]
                : null,
            pireSite: sitesData.length > 0 
                ? sitesData.sort((a, b) => (a.performance || 0) - (b.performance || 0))[0]
                : null,
            
            // Totaux
            totalPresences: presences.length,
            totalRetards: kpi.total_retards || 0,
            totalHeuresSup: kpi.total_heures_sup || 0,
            employesAbsents: kpi.employes_absents || 0,
            absencesJustifiees: kpi.absences_justifiees || 0,
            
            // Alertes
            niveauAlerte: kpi.taux_presence < 50 ? 'critique' : 
                          kpi.taux_presence < 75 ? 'alerte' : 'normal'
        };

        // Formater les KPIs pour le frontend
        const formattedKpi = {
            tauxPresence: kpi.taux_presence || 0,
            tauxPonctualite: kpi.taux_ponctualite || 0,
            tauxActivite: kpi.taux_activite || 0,
            totalRetards: kpi.total_retards || 0,
            retardMoyen: kpi.retard_moyen || 0,
            evolutionPresence: kpi.evolution_presence || 0,
            totalHeuresSup: kpi.total_heures_sup || 0,
            employesAbsents: kpi.employes_absents || 0,
            absencesJustifiees: kpi.absences_justifiees || 0,
            
            // Indicateurs dérivés
            retardMoyenFormat: `${Math.floor((kpi.retard_moyen || 0) / 60)}h${(kpi.retard_moyen || 0) % 60}`,
            tauxPresenceColor: (kpi.taux_presence || 0) >= 75 ? 'success' : 
                              (kpi.taux_presence || 0) >= 50 ? 'warning' : 'danger'
        };

        return {
            ...data,
            metadata,
            kpi_globaux: formattedKpi,
            performances_sites: sitesData.map(site => ({
                ...site,
                key: site.site_id || Math.random(),
                performanceColor: site.performance >= 75 ? 'green' : 
                                site.performance >= 50 ? 'orange' : 'red',
                tauxPresenceColor: site.taux_presence >= 75 ? 'green' : 
                                  site.taux_presence >= 50 ? 'orange' : 'red'
            })),
            top_performeurs: top.map((emp, index) => ({
                ...emp,
                key: emp.id || index,
                nom: emp.nom || '',
                prenom: emp.prenom || '',
                fullName: `${emp.prenom || ''} ${emp.nom || ''}`.trim()
            })),
            agents_probleme: probleme.map((emp, index) => ({
                ...emp,
                key: emp.id || index,
                nom: emp.nom || '',
                prenom: emp.prenom || '',
                fullName: `${emp.prenom || ''} ${emp.nom || ''}`.trim(),
                retardMoyenFormat: `${Math.floor((emp.retard_moyen || 0) / 60)}h${(emp.retard_moyen || 0) % 60}`
            })),
            stats
        };
    }, [data, users.length, sites.length, presences.length]);

    // Fonction pour exporter les données
    const exportData = useCallback((format = 'json') => {
        if (!data) return null;
        
        if (format === 'json') {
            return JSON.stringify({
                metadata: data.metadata,
                kpi_globaux: data.kpi_globaux,
                performances_sites: data.performances_sites,
                top_performeurs: data.top_performeurs,
                agents_probleme: data.agents_probleme,
                date_export: new Date().toISOString(),
                stats: computedData?.stats
            }, null, 2);
        } else if (format === 'csv') {
            // Exporter les performances des sites en CSV
            if (data.performances_sites?.length > 0) {
                const headers = ['Site', 'Taux Présence (%)', 'Total Retards', 'Retard Moyen (min)', 'Performance (%)'];
                const rows = data.performances_sites.map(site => [
                    site.site_nom,
                    site.taux_presence,
                    site.total_retards,
                    site.retard_moyen,
                    site.performance
                ]);
                
                return [headers, ...rows].map(row => row.join(',')).join('\n');
            }
        }
        return null;
    }, [data, computedData]);

    // Rafraîchir les données
    const refresh = useCallback(() => {
        return load();
    }, [load]);

    return {
        // Données
        data: computedData,
        presences,
        sites,
        users,
        
        // États
        loading,
        error,
        filters,
        
        // Statistiques calculées
        stats: computedData?.stats || {},
        
        // Fonctions principales
        load,
        reload: refresh,
        reloadWithParams,
        updateFilters,
        resetFilters,
        exportData,
        
        // Utilitaires
        hasData: !!computedData && computedData.performances_sites?.length > 0,
        isEmpty: !computedData || computedData.performances_sites?.length === 0,
        hasError: !!error,
        
        // Informations sur la période
        periode: computedData?.metadata?.periode || {
            debut: null,
            fin: null,
            jours_ouvrables: 0
        }
    };
};