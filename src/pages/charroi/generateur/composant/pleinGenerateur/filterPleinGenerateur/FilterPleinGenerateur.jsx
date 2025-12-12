import React, { useEffect, useState } from 'react'
import { getMarqueGenerateur, getModeleGenerateur, getTypeGenerateur } from '../../../../../../services/generateurService';

const FilterPleinGenerateur = () => {
    const [marque, setMarque] = useState([]);
    const [modele, setModele] = useState([]);
    const [types, setTypes] = useState([]);
    const [selectedMarque, setSelectedMarque] = useState([]);
    const [selectedModele, setSelectedModele] = useState([]);
    const [selectedTypes, setSelectedTypes] = useState([]);
    const [dateRange, setDateRange] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async() => {
            try {
                const [ marqueData, modeleData, typeData ] = await Promise.all([
                    getMarqueGenerateur(),
                    getModeleGenerateur(),
                    getTypeGenerateur()
                ])
                
                setMarque(marqueData.data)
                setModele(modeleData.data)
                setTypes(typeData.data)
            } catch (error) {
                notification.error({
                    message: "Erreur lors du chargement",
                    description: err?.response?.data?.message || "Impossible de charger les véhicules.",
                });
            } finally {
                setLoading(false);
            }
        }

        fetchData()
    }, [])

    const marqueOptions = useMemo(
        () => marque.map((item) => ({
            value: item.id_marque_generateur,
            label: item.nom_marque
        })), [marque]
    );

    const modeleOptions = useMemo(
        () => modele.map((item) => ({
            value: item.id_modele_generateur,
            label: item.nom_modele
        })), [modele]
    );

    const typeOptions = useMemo(
        () => modele.map((item) => ({
            value: item.id_type_generateur,
            label: item.nom_type_gen
        })), [modele]
    )

  return (
    <>
        <div className="filterTache" style={{marginBottom:'20px'}}>
            <div className="filter_row">
                <label>Marque :</label>
                {loading ? (
                    <Skeleton.Input active style={{ width: "100%", height: 40 }} />
                ) : (
                <Select
                    mode="multiple"
                    showSearch
                    optionFilterProp="label"
                    style={{ width: "100%" }}
                    options={vehiculeOptions}
                    placeholder="Sélectionnez..."
                    onChange={setSelectedMarque}
                />
                )}
            </div>

            <div className="filter_row">
                <label>Modèle :</label>
                {loading ? (
                    <Skeleton.Input active style={{ width: "100%", height: 40 }} />
                ) : (
                <Select
                    mode="multiple"
                    showSearch
                    optionFilterProp="label"
                    style={{ width: "100%" }}
                    options={modeleOptions}
                    placeholder="Sélectionnez..."
                    onChange={setSelectedModele}
                />
                )}
            </div>

            <div className="filter_row">
                <label>Type :</label>
                {loading ? (
                    <Skeleton.Input active style={{ width: "100%", height: 40 }} />
                ) : (
                <Select
                    mode="multiple"
                    showSearch
                    optionFilterProp="label"
                    style={{ width: "100%" }}
                    options={typeOptions}
                    placeholder="Sélectionnez..."
                    onChange={setSelectedTypes}
                />
                )}
            </div>

        </div>
    </>
  )
}

export default FilterPleinGenerateur