import React, { useEffect } from 'react'
import { getStatutVehicule, getTypeReparation, getVehicule } from '../../../services/charroiService';

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
                id_vehicule: selectedDepartement,
                id_statut_vehicule: selectedClients,
                id_type_reparation: selectedStatut,
            });
        };
        handleFilter();
    }, []);

  return (
    <div>FilterInspectionGen</div>
  )
}

export default FilterInspectionGen