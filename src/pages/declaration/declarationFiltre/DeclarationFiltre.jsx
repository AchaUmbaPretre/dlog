import React, { useEffect, useState } from 'react';
import { Select, DatePicker, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import 'antd/dist/reset.css';
import { getUser } from '../../../services/userService';
import { getClient, getProvince } from '../../../services/clientService';
import { getTypes } from '../../../services/typeService';
import { getPriorityIcon } from '../../../utils/prioriteIcons';

const { Option } = Select;
const { RangePicker } = DatePicker;

const DeclarationFiltre = ({ onFilter }) => {
    const [province, setProvince] = useState([]);
    const [client, setClient] = useState([]);
    const [dateRange, setDateRange] = useState([]);
    const [owners, setOwners] = useState([]);
    const [type, setType] = useState([]);
    const [selectedDepartement, setSelectedDepartement] = useState('');
    const [selectedClients, setSelectedClients] = useState('');
    const [selectedStatut, setSelectedStatut] = useState('');
    const [selectedPriorite, setSelectedPriorite] = useState('');
    const [selectedOwners, setSelectedOwners] = useState('');

    const handleFilter = async () => {
        onFilter({
            departement: selectedDepartement,
            client: selectedClients,
            statut: selectedStatut,
            priorite: selectedPriorite,
            dateRange,
            owners: selectedOwners,
        });
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [usersData, clientData, typeData, provinceData] = await Promise.all([
                    getUser(),
                    getClient(),
                    getTypes(),
                    getProvince()
                ]);

                setOwners(usersData.data);
                setClient(clientData.data);
                setType(typeData.data);
                setProvince(provinceData.data)
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="filterTache" style={{margin:'10px 0'}}>
            <div className="filter_row">
                <label>Ville :</label>
                <Select
                    mode="multiple"
                    showSearch
                    style={{ width: '100%' }}
                    options={province.map((item) => ({
                        value: item.id,
                        label: item.name,
                    }))}
                    placeholder="Sélectionnez ..."
                    optionFilterProp="label"
                    onChange={setSelectedDepartement}
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
                    onChange={setSelectedClients}
                />
            </div>
            <div className="filter_row">
                <label>Batiment :</label>
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
                <label>Priorité:</label>
                <Select
                    mode="multiple"
                    placeholder="Sélectionnez..."
                    optionFilterProp="label"
                    options={[
                        { value: 1, label: <span>{getPriorityIcon(1)} Très faible</span> },
                        { value: 2, label: <span>{getPriorityIcon(2)} Faible</span> },
                        { value: 3, label: <span>{getPriorityIcon(3)} Moyenne</span> },
                        { value: 4, label: <span>{getPriorityIcon(4)} Haute</span> },
                        { value: 5, label: <span>{getPriorityIcon(5)} Très haute</span> },
                    ]}
                    onChange={setSelectedPriorite}
                />
            </div>
            <div className="filter_row">
                <label>Periode :</label>
                <DatePicker
                    picker="month"
                    placeholder="Sélectionnez le mois"
                    format="YYYY-MM-DD"
                    style={{ width: '100%' }}
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

export default DeclarationFiltre;
