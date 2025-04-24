import React, { useEffect } from 'react'
import { getVehicule } from '../../../services/charroiService';

const FilterInspectionGen = ({ onFilter}) => {
    const [selectedStatut, setSelectedStatut] = useState([]);
    const [selectedVehicule, setSelectedVehicule] = useState([]);
    const [selectedType, setSelectedType] = useState([]);

    const [statut, setStatut] = useState([]);
    const [vehicule, setVehicule] = useState([]);
    const [type, setType] = useState([]);

    const fetchDatas = async () => {
        const [vehiculeData] = await Promise.all([
            getVehicule(),
        ])

        selectedVehicule
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