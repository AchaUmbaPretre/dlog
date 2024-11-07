import React, { useEffect, useState } from 'react';
import { Select, DatePicker, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import 'antd/dist/reset.css';
import { getClient, getProvince } from '../../../services/clientService';
import { getBatiment } from '../../../services/typeService';
import dayjs from 'dayjs';

const { Option } = Select;
const { RangePicker } = DatePicker;

const DeclarationFiltre = ({ onFilter }) => {
    const [province, setProvince] = useState([]);
    const [client, setClient] = useState([]);
    const [batiment, setBatiment] = useState([]);
    const [selectedVille, setSelectedVille] = useState([]);
    const [selectedClients, setSelectedClients] = useState([]);
    const [selectedBatiment, setSelectedBatiment] = useState([]);
    const [selectedPeriods, setSelectedPeriods] = useState([]);

    const handleFilter = () => {
        const formattedPeriods = selectedPeriods.map(date => ({
            month: dayjs(date).format('MM'),
            year: dayjs(date).format('YYYY')
        }));
        
        onFilter({
            ville: selectedVille,
            client: selectedClients,
            batiment: selectedBatiment,
            periods: formattedPeriods        
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
                setProvince(provinceData.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="filterTache" style={{ margin: '10px 0' }}>
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
                    placeholder="Sélectionnez..."
                    optionFilterProp="label"
                    onChange={setSelectedVille}
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
                <label>Bâtiment :</label>
                <Select
                    mode="multiple"
                    style={{ width: '100%' }}
                    showSearch
                    options={batiment.map((item) => ({
                        value: item.id_batiment,
                        label: item.nom_batiment,
                    }))}
                    placeholder="Sélectionnez un bâtiment..."
                    optionFilterProp="label"
                    onChange={setSelectedBatiment}
                />
            </div>

            <div className="filter_row">
                <label>Périodes :</label>
                <DatePicker
                    picker="month"
                    format="YYYY-MM-DD"
                    style={{ width: '100%' }}
                    placeholder="Sélectionnez les mois..."
                    onChange={setSelectedPeriods}
                />
            </div>
            
            <Button type="primary" icon={<SearchOutlined />} onClick={handleFilter}>
                Filtrer
            </Button>
        </div>
    );
};

export default DeclarationFiltre;
