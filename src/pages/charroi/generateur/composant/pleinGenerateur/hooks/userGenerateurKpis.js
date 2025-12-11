import { useMemo } from "react";

export const userGenerateurKpis = (data) => {
    const quantite = useMemo(
        () => data.reduce((sum, item) => sum + (item.quantite_litres || 0), 0),
        [data]
    );

    const montantTotalUsd = useMemo(
        () => data.reduce((sum, item) => sum + (item.montant_total_usd || 0), 0),
        [data]
    );

    const montantTotalCdf = useMemo(
    () => data.reduce((sum, item) => sum + (item.montant_total_cdf || 0), 0),
    [data]
  );

return { montantTotalUsd, montantTotalCdf,  quantite };
}