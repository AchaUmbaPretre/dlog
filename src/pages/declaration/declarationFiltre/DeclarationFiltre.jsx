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
    const [selectedMonths, setSelectedMonths] = useState([]);
    const [selectedYear, setSelectedYear] = useState(null);

    const years = Array.from({ length: 10 }, (_, i) => moment().year() - i);
    const months = Array.from({ length: 12 }, (_, index) => index + 1);

    const handleFilter = () => {
        onFilter({
            ville: selectedVille,
            client: selectedClients,
            batiment: selectedBatiment,
            dateRange: {
                months: selectedMonths,
                year: selectedYear,
            },
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

    const handleMonthChange = (months) => {
        setSelectedMonths(months);
    };

    // Gérer les changements de l'année sélectionnée
    const handleYearChange = (year) => {
        setSelectedYear(year);
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
            
            { !visible && (
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
                    <div style={{ display: 'flex', gap: '1rem' }}>
                {/* Sélection des mois */}
                <Select
                    mode="multiple"
                    placeholder="Sélectionnez les mois"
                    value={selectedMonths}
                    onChange={handleMonthChange}
                    style={{ width: '60%' }}
                    showSearch
                    optionFilterProp="children"
                >
                    {months.map((month) => (
                        <Option key={month} value={month}>
                            {moment().month(month - 1).format('MMMM')} {/* Affiche le mois en texte */}
                        </Option>
                    ))}
                </Select>

                {/* Sélection de l'année */}
                <Select
                    placeholder="Sélectionnez l'année"
                    value={selectedYear}
                    onChange={handleYearChange}
                    style={{ width: '40%' }}
                    showSearch
                    optionFilterProp="children"
                >
                    {years.map((year) => (
                        <Option key={year} value={year}>
                            {year}
                        </Option>
                    ))}
                </Select>
                    </div>
                </div>
            <Button style={{padding:'10px', marginTop:'20px'}} type="primary" icon={<SearchOutlined />} onClick={handleFilter}>
            </Button>
        </div>
    );
};

export default DeclarationFiltre;
