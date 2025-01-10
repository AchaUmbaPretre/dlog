import React, { useEffect, useState } from 'react';
import { Select, DatePicker, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import 'antd/dist/reset.css';
import { getClient, getProvince } from '../../../services/clientService';
import { getBatiment } from '../../../services/typeService';
import moment from 'moment';

const { Option } = Select;

const DeclarationFiltre = ({ onFilter, visible }) => {
    const [province, setProvince] = useState([]);
    const [client, setClient] = useState([]);
    const [dateRange, setDateRange] = useState(null);
    const [batiment, setBatiment] = useState([]);
    const [selectedVille, setSelectedVille] = useState([]);
    const [selectedClients, setSelectedClients] = useState([]);
    const [selectedBatiment, setSelectedBatiment] = useState([]);
    const [selectedMonths, setSelectedMonths] = useState([]);


    const handleMonthChange = (values) => {
        setSelectedMonths(values);
    };

    const handleSort = () => {
        // Trier les mois sélectionnés
        const sortedMonths = [...selectedMonths].sort();
        setSelectedMonths(sortedMonths);
    };

    // Générer la liste des mois de l'année
    const months = moment.months(); // Cela retourne un tableau des mois en texte (ex: "January", "February", etc.)

    
    const handleFilter = () => {
        onFilter({
            ville: selectedVille,
            client: selectedClients,
            batiment: selectedBatiment,
            dateRange        
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
                        label: item.capital,
                    }))}
                    placeholder="Sélectionnez..."
                    optionFilterProp="label"
                    onChange={setSelectedVille}
                />
            </div>
            { !visible &&
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
            }

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
                <label>Période :</label>
                <Select
                    mode="multiple"
                    placeholder="Sélectionnez les mois"
                    value={selectedMonths}
                    onChange={handleMonthChange}
                    style={{ width: '100%' }}
                >
                {months.map((month, index) => (
                    <Option key={index} value={month}>{month}</Option>
                ))}
            </Select>
            </div>
            <Button style={{padding:'10px', marginTop:'20px'}} type="primary" icon={<SearchOutlined />} onClick={handleFilter}>
            </Button>
        </div>
    );
};

export default DeclarationFiltre;
