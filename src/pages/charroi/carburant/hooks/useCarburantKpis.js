import { useMemo } from "react";

export const useCarburantKpis = (data) => {
  const totalKmActuel = useMemo(
    () => data.reduce((sum, item) => sum + (item.compteur_km || 0), 0),
    [data]
  );
  const totalConsommation = useMemo(
    () => data.reduce((sum, item) => sum + (item.consommation || 0), 0),
    [data]
  );
  const distanceMoyenne = useMemo(() => {
    if (!data || data.length === 0) return 0;
    const totalDistance = data.reduce((sum, item) => sum + (item.distance || 0), 0);
    return totalDistance / data.length;
  }, [data]);
  const montantTotalUsd = useMemo(
    () => data.reduce((sum, item) => sum + (item.montant_total_usd || 0), 0),
    [data]
  );

  return { totalKmActuel, totalConsommation, distanceMoyenne, montantTotalUsd };
}