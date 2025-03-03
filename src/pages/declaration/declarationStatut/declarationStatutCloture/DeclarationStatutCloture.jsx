import React, { useState } from 'react'
import { getAnnee, getMois } from '../../../../services/templateService';

const DeclarationStatutCloture = () => {
        const [mois, setMois] = useState([]);
        const [annee, setAnnee] = useState([]);
        const [selectedMois, setSelectedMois] = useState([]);
        const [selectedAnnees, setSelectedAnnees] = useState([]);

        const fetchMoisParAnnee = async (annee) => {

            try {
                const response = await getMois(annee);
                const res = await getAnnee();

                setAnnee(res)
                setMois((prev) => ({
                    ...prev,
                    [annee]: response.data,
                }));
            } catch (error) {
                console.error("Erreur lors du chargement des mois :", error);
            }
        };

  return (
    <>
        <div className="declaration_statut">

        </div>
    </>
  )
}

export default DeclarationStatutCloture