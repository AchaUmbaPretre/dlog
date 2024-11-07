import React, { useEffect, useState } from 'react';
import { Select, DatePicker, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import 'antd/dist/reset.css';
import { getClient, getProvince } from '../../../services/clientService';
import { getBatiment, getTypes } from '../../../services/typeService';
import { getPriorityIcon } from '../../../utils/prioriteIcons';

const { Option } = Select;
const { RangePicker } = DatePicker;

const DeclarationFiltre = ({ onFilter }) => {
    const [province, setProvince] = useState([]);
    const [client, setClient] = useState([]);
    const [dateRange, setDateRange] = useState([]);
    const [batiment, setBatiment] = useState([]);
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
                const [batimentData, clientData, provinceData] = await Promise.all([
                    getBatiment(),
                    getClient(),
                    getProvince()
                ]);

                setBatiment(batimentData.data);
                setClient(clientData.data);
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
                <label>Clients :</label>
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
                    options={batiment.map((item) => ({
                        value: item.id_batiment,
                        label: item.nom_batiment,
                    }))}
                    placeholder="Sélectionnez un client..."
                    optionFilterProp="label"
                    onChange={setSelectedClients} // Met à jour les clients sélectionnés
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
            <Button type="primary" icon={<SearchOutlined />} onClick={handleFilter}>
                Filtrer
            </Button>
        </div>
    );
};

export default DeclarationFiltre;
