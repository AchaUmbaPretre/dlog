import React, { useEffect, useState } from 'react';
import { Select, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import 'antd/dist/reset.css';
import { getClient, getProvince } from '../../../services/clientService';
import { getBatiment } from '../../../services/typeService';
import moment from 'moment';

const { Option } = Select;

const DeclarationFiltre = ({ onFilter, visible }) => {
    const [province, setProvince] = useState([]);
    const [client, setClient] = useState([]);
    const [batiment, setBatiment] = useState([]);
    const [selectedVille, setSelectedVille] = useState([]);
    const [selectedClients, setSelectedClients] = useState([]);
    const [selectedBatiment, setSelectedBatiment] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);
    const [options, setOptions] = useState([]);

    const years = Array.from({ length: 10 }, (_, i) => moment().year() - i);
    const months = Array.from({ length: 12 }, (_, i) => moment().month(i).format('MMMM'));

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
                setOptions(years.map((year) => ({ label: year, value: year }))); // Initialiser avec les années
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, []);

    const handleOptionChange = (value) => {
        setSelectedOption(value);

        // Si une année est sélectionnée, basculer vers les mois
        if (years.includes(value)) {
            const monthsOptions = months.map((month, index) => ({
                label: `${month} ${value}`,
                value: `${value}-${index + 1}`, // Associe l'année et le mois (ex: 2025-1)
            }));
            setOptions(monthsOptions);
        }
    };

    const handleBackToYears = () => {
        // Retourner à la sélection des années
        setOptions(years.map((year) => ({ label: year, value: year })));
        setSelectedOption(null);
    };

    const handleFilter = () => {
        onFilter({
            ville: selectedVille,
            client: selectedClients,
            batiment: selectedBatiment,
            period: selectedOption,
        });
    };

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

            {!visible && (
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
            )}

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
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <Select
                        style={{ width: '100%' }}
                        placeholder="Sélectionnez une année ou un mois"
                        options={options}
                        value={selectedOption}
                        onChange={handleOptionChange}
                    />
                    {years.includes(selectedOption) && (
                        <Button type="link" onClick={handleBackToYears}>
                            Retour à la sélection des années
                        </Button>
                    )}
                </div>
            </div>

            <Button
                style={{ padding: '10px', marginTop: '20px' }}
                type="primary"
                icon={<SearchOutlined />}
                onClick={handleFilter}
            >
                Filtrer
            </Button>
        </div>
    );
};

export default DeclarationFiltre;
