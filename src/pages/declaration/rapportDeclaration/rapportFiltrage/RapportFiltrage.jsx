import React, { useEffect, useState } from 'react';
import { Select, Button, Skeleton, Space, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import 'antd/dist/reset.css';
import moment from 'moment';
import { getClient, getProvince } from '../../../../services/clientService';

const { Option } = Select;

const RapportFiltrage = ({ onFilter, filtraVille }) => {
    const [province, setProvince] = useState([]);
    const [client, setClient] = useState([]);
    const [selectedVille, setSelectedVille] = useState([]);
    const [selectedClients, setSelectedClients] = useState([]);
    const [selectedMonths, setSelectedMonths] = useState([]);
    const [selectedYear, setSelectedYear] = useState(null);
    const [minMontant, setMinMontant] = useState(null);
    const [maxMontant, setMaxMontant] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [options, setOptions] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);


    const years = Array.from({ length: 10 }, (_, i) => moment().year() - i);
    const months = Array.from({ length: 12 }, (_, i) => moment().month(i).format('MMMM'));

    const handleFilter = () => {
        onFilter({
            ville: selectedVille,
            client: selectedClients,
            montant: { min: minMontant, max: maxMontant },
            dateRange: {
                months: selectedMonths,
                year: selectedYear,
            },
            period: selectedOption,

        });
    };

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const [clientData, provinceData] = await Promise.all([
                    getClient(),
                    getProvince()
                ]);

                setClient(clientData.data);
                setProvince(provinceData.data);
                setOptions(years.map((year) => ({ label: year, value: year })));
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
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
        setOptions(years.map((year) => ({ label: year, value: year })));
        setSelectedOption(null);
    };


    const handleMinMontantChange = (e) => {
        setMinMontant(e.target.value);
    };

    const handleMaxMontantChange = (e) => {
        setMaxMontant(e.target.value);
    };



    return (
        <div className="filterTache" style={{ margin: '10px 0' }}>
            {filtraVille && (
                <div className="filter_row">
                    <label>Ville :</label>
                    {isLoading ? (
                        <Skeleton.Input active={true} />
                    ) : (
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
                    )}
                </div>
            )}

            {!filtraVille && (
                <div className="filter_row">
                    <label>Clients :</label>
                    {isLoading ? (
                        <Skeleton.Input active={true} />
                    ) : (
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
                    )}
                </div>
            )}

            <div className="filter_row">
                <label>Montant :</label>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <Input
                        placeholder="Min"
                        type="number"
                        value={minMontant}
                        onChange={handleMinMontantChange}
                    />
                    <Input
                        placeholder="Max"
                        type="number"
                        value={maxMontant}
                        onChange={handleMaxMontantChange}
                    />
                </div>
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
            </Button>
        </div>
    );
};

export default RapportFiltrage;
