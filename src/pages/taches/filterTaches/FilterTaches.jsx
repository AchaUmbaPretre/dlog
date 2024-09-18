import React, { useEffect, useState } from 'react';
import { Select, DatePicker, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import 'antd/dist/reset.css'; // Assure-toi que le CSS d'Ant Design est bien importé
import './filterTaches.scss';
import { getDepartement } from '../../../services/departementService';
import { getUser } from '../../../services/userService';
import { getClient } from '../../../services/clientService';
import { getTypes } from '../../../services/typeService';
import { getPriorityIcon } from '../../../utils/prioriteIcons';
import { getTache } from '../../../services/tacheService';

const { Option } = Select;
const { RangePicker } = DatePicker;

const colorMapping = {
    'En attente': '#FFA500',
    'En cours': '#1E90FF',
    'Point bloquant': '#FF4500',
    'En attente de validation': '#32CD32',
    'Validé': '#228B22',
    'Budget': '#FFD700',
    'Exécuté': '#A9A9A9',
    1: '#32CD32',
    0: '#FF6347',
};

const FilterTaches = ({ onFilter }) => {
    const [departement, setDepartement] = useState([]);
    const [client, setClient] = useState([]);
    const [statut, setStatut] = useState([]);
    const [priorite, setPriorite] = useState([]);
    const [dateRange, setDateRange] = useState([]);
    const [owners, setOwners] = useState([]);
    const [type, setType] = useState([]);

    // Nouveau: Gérer les valeurs sélectionnées
    const [selectedDepartement, setSelectedDepartement] = useState(null);
    const [selectedClients, setSelectedClients] = useState([]);
    const [selectedStatut, setSelectedStatut] = useState(null);
    const [selectedPriorite, setSelectedPriorite] = useState(null);
    const [selectedOwners, setSelectedOwners] = useState([]);

    const handleFilter = async () => {
        onFilter({
            departement: selectedDepartement,
            client: selectedClients,
            statut: selectedStatut,
            priorite: selectedPriorite,
            dateRange,
            owners: selectedOwners,
        });
        await getTache(onFilter);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [departementData, usersData, clientData, typeData] = await Promise.all([
                    getDepartement(),
                    getUser(),
                    getClient(),
                    getTypes(),
                ]);

                setDepartement(departementData.data);
                setOwners(usersData.data);
                setClient(clientData.data);
                setType(typeData.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="filterTache">
            <div className="filter_row">
                <label>Département:</label>
                <Select
                    showSearch
                    style={{ width: '100%' }}
                    options={departement.map((item) => ({
                        value: item.id_departement,
                        label: item.nom_departement,
                    }))}
                    placeholder="Sélectionnez ..."
                    optionFilterProp="label"
                    onChange={setSelectedDepartement} // Met à jour l'état sélectionné
                />
            </div>
            <div className="filter_row">
                <label>Clients:</label>
                <Select
                    mode="multiple"
                    style={{ width: '100%' }}
                    showSearch
                    options={client.map((item) => ({
                        value: item.id_client,
                        label: item.nom,
                    }))}
                    placeholder="Sélectionnez un client..."
                    optionFilterProp="label"
                    onChange={setSelectedClients} // Met à jour les clients sélectionnés
                />
            </div>
            <div className="filter_row">
                <label>Statut:</label>
                <Select
                    style={{ width: '100%' }}
                    placeholder="Sélectionnez ..."
                    options={type.map((item) => ({
                        value: item.id_type_statut_suivi,
                        label: (
                            <div style={{ color: colorMapping[item.nom_type_statut] }}>
                                {item.nom_type_statut}
                            </div>
                        ),
                    }))}
                    onChange={setSelectedStatut} // Met à jour le statut sélectionné
                />
            </div>
            <div className="filter_row">
                <label>Priorité:</label>
                <Select
                    placeholder="Sélectionnez..."
                    optionFilterProp="label"
                    options={[
                        { value: 1, label: <span>{getPriorityIcon(1)} Très faible</span> },
                        { value: 2, label: <span>{getPriorityIcon(2)} Faible</span> },
                        { value: 3, label: <span>{getPriorityIcon(3)} Moyenne</span> },
                        { value: 4, label: <span>{getPriorityIcon(4)} Haute</span> },
                        { value: 5, label: <span>{getPriorityIcon(5)} Très haute</span> },
                    ]}
                    onChange={setSelectedPriorite} // Met à jour la priorité sélectionnée
                />
            </div>
            <div className="filter_row">
                <label>Date de début:</label>
                <RangePicker
                    style={{ width: '100%' }}
                    value={dateRange}
                    onChange={setDateRange} // Met à jour la plage de dates
                />
            </div>
            <div className="filter_row">
                <label>Owner:</label>
                <Select
                    showSearch
                    mode="multiple"
                    style={{ width: '100%' }}
                    options={owners.map((item) => ({
                        value: item.id_utilisateur,
                        label: `${item.nom}`,
                    }))}
                    placeholder="Sélectionnez..."
                    optionFilterProp="label"
                    onChange={setSelectedOwners} // Met à jour les propriétaires sélectionnés
                />
            </div>
            <Button type="primary" icon={<SearchOutlined />} onClick={handleFilter}>
                Filtrer
            </Button>
        </div>
    );
};

export default FilterTaches;
