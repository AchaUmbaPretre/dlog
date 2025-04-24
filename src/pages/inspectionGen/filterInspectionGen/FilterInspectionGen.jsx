import React, { useEffect, useState } from 'react'
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

        setVehicule(vehiculeData.data)
        setType(typeData.data)
        setStatut(statutData.data)
    }

    useEffect(() => {
        const handleFilter = async () => {
            onFilter({
                id_vehicule: selectedVehicule,
                id_statut_vehicule: selectedStatut,
                id_type_reparation: selectedStatut,
            });
        };
        handleFilter();
    }, []);

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
                        label: item.nom_vehicule,
                    }))}
                    placeholder="Sélectionnez..."
                    optionFilterProp="label"
                    onChange={setSelectedVehicule}
                />
            </div>

            <div className="filter_row">
                <label>Véhicule :</label>
                <Select
                    mode="multiple"
                    showSearch
                    style={{ width: '100%' }}
                    options={vehicule.map((item) => ({
                        value: item.id_vehicule,
                        label: item.nom_vehicule,
                    }))}
                    placeholder="Sélectionnez..."
                    optionFilterProp="label"
                    onChange={setSelectedVehicule}
                />
            </div>

            <div className="filter_row">
                <label>Statut :</label>
                <Select
                    mode="multiple"
                    showSearch
                    style={{ width: '100%' }}
                    options={statut.map((item) => ({
                        value: item.id_vehicule,
                        label: item.nom_vehicule,
                    }))}
                    placeholder="Sélectionnez..."
                    optionFilterProp="label"
                    onChange={setSelectedVehicule}
                />
            </div>
        </div>
    </>
  )
}

export default FilterInspectionGen