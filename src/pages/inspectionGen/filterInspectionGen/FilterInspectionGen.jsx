import { useEffect, useState } from 'react'
import { getStatutVehicule, getTypeReparation, getVehicule } from '../../../services/charroiService';
import { Select, Skeleton, notification } from 'antd';

const FilterInspectionGen = ({ onFilter}) => {
    const [selectedStatut, setSelectedStatut] = useState([]);
    const [selectedVehicule, setSelectedVehicule] = useState([]);
    const [selectedType, setSelectedType] = useState([]);
    const [statut, setStatut] = useState([]);
    const [vehicule, setVehicule] = useState([]);
    const [type, setType] = useState([]);
    const [isLoadings, setIsLoadings] = useState(false);

    const fetchDatas = async () => {
        try {
            setIsLoadings(true)
            const [vehiculeData, typeData, statutData] = await Promise.all([
                getVehicule(),
                getTypeReparation(),
                getStatutVehicule()
            ])

            setVehicule(vehiculeData.data.data)
            setType(typeData.data.data)
            setStatut(statutData.data)
        } catch (error) {
            notification.error({
                message: 'Erreur de chargement',
                description: 'Une erreur est survenue lors du chargement des données.',
            });
        } finally {
            setIsLoadings(false);
        }
    }

    useEffect(()=> {
        fetchDatas()
    }, []);

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
                { isLoadings? <Skeleton.Input active={true} /> : 
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
                }
            </div>
            <div className="filter_row">
                <label>Etat du véhicule :</label>
                { isLoadings ? <Skeleton.Input active={true} /> : 
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
                }
            </div>

            <div className="filter_row">
                <label>Type réparation :</label>
                { isLoadings ? <Skeleton.Input active={true} /> : 
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
                }
            </div>
        </div>
    </>
  )
}

export default FilterInspectionGen