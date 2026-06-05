import './statistique.scss';
import StatiCarbItems from '../carburantGen/statiCarbItems/StatiCarbItems';
import StatCarbDepense from '../carburantGen/statCarbDepense/StatCarbDepense';
import StatCarbRepartion from '../carburantGen/statCarbRepartion/StatCarbRepartion';
import { useDashboardCarburant } from '../carburantGen/hooks/useDashboardCarburant';
import RavitaillementRecent from '../carburantGen/ravitaillementRecent/RavitaillementRecent';
import CarbTopConsom from '../carburantGen/carbTopConsom/CarbTopConsom';
import Statfournisseur from '../carburantGen/statfournisseur/Statfournisseur';

const Statistique = () => {
    const {
        loading,
        data,
        error,
        periode,
        dateRange,
        updatePeriode,
        updateDateRange,
        refresh
    } = useDashboardCarburant();

    // Vérification des fonctions
    console.log('Statistique props:', {
        loading,
        hasData: !!data,
        periode,
        hasUpdatePeriode: typeof updatePeriode === 'function',
        hasUpdateDateRange: typeof updateDateRange === 'function',
        hasRefresh: typeof refresh === 'function'
    });

    if (error) {
        return (
            <div className="statistique">
                <div className="error-state">
                    <h3>Erreur de chargement des données</h3>
                    <p>{error}</p>
                    <button onClick={refresh}>Réessayer</button>
                </div>
            </div>
        );
    }

    return (
        <div className="statistique">
            <StatiCarbItems data={data} loading={loading} />
            <div className="statistique_bottom">
                <StatCarbDepense 
                    data={data}
                    loading={loading}
                    periode={periode}
                    updatePeriode={updatePeriode}
                    updateDateRange={updateDateRange}
                    refresh={refresh}
                />
                <StatCarbRepartion 
                    data={data}
                    loading={loading}
                />
            </div>

            <div className="statistique_bottom statistic_bottom_v2">
                <RavitaillementRecent
                    data={data?.ravaillementsRecents}
                    loading={loading}
                />

                <CarbTopConsom
                    data={data?.topVehicules}
                    loading={loading}
                />

                <Statfournisseur
                    data={data?.topFournisseurs}
                    loading={loading}
                />
            </div>
        </div>
    );
}

export default Statistique;