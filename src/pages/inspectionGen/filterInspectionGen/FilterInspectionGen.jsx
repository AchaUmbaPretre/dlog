import { useEffect, useState } from 'react'
import { getStatutVehicule, getTypeReparation, getVehicule } from '../../../services/charroiService';
import { Select } from 'antd';

const FilterInspectionGen = ({ onFilter}) => {
    const [selectedStatut, setSelectedStatut] = useState([]);
    const [selectedVehicule, setSelectedVehicule] = useState([]);
    const [selectedType, setSelectedType] = useState([]);

    const [statut, setStatut] = useState([]);
    const [vehicule, setVehicule] = useState([]);
    const [type, setType] = useState([]);

    const fetchDatas = async () => {
        const [vehiculeData, typeData, statutData] = await Promise.all([
            getVehicule(),
            getTypeReparation(),
            getStatutVehicule()
        ])

        setVehicule(vehiculeData.data.data)
        setType(typeData.data.data)
        setStatut(statutData.data)
    }

    useEffect(()=> {
        fetchDatas()
    }, [])

    useEffect(() => {
        const handleFilter = async () => {
            onFilter({
                id_vehicule: selectedVehicule,
                id_statut_vehicule: selectedStatut,
                id_type_reparation: selectedType,
            });
        };

        handleFilter();
    }, [selectedStatut, selectedType, selectedVehicule]);

  return (
    <>
        <div className="filterTache" style={{ margin: '10px 0' }}>
            <div className="filter_row">
                <label>Véhicule :</label>
                <Select
                    mode="multiple"
                    showSearch
                    style={{ width: '100%' }}
                    options={vehicule.map((item) => ({
                        value: item.id_vehicule,
                        label: `${item.immatriculation} / ${item.nom_marque} / ${item.modele}`,
                    }))}
                    placeholder="Sélectionnez..."
                    optionFilterProp="label"
                    onChange={setSelectedVehicule}
                />
            </div>
            <div className="filter_row">
                <label>Etat du véhicule :</label>
                <Select
                    mode="multiple"
                    showSearch
                    style={{ width: '100%' }}
                    options={statut.map((item) => ({
                        value: item.id_statut_vehicule,
                        label: item.nom_statut_vehicule
                    }))}
                    placeholder="Sélectionnez..."
                    optionFilterProp="label"
                    onChange={setSelectedStatut}
                />
            </div>

            <div className="filter_row">
                <label>Type réparation :</label>
                <Select
                    mode="multiple"
                    showSearch
                    style={{ width: '100%' }}
                    options={type.map((item) => ({
                        value: item.id_type_reparation,
                        label: item.type_rep,
                    }))}
                    placeholder="Sélectionnez..."
                    optionFilterProp="label"
                    onChange={setSelectedType}
                />
            </div>
        </div>
    </>
  )
}

export default FilterInspectionGen