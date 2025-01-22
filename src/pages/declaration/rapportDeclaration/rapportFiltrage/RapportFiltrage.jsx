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

    const years = Array.from({ length: 10 }, (_, i) => moment().year() - i);
    const months = Array.from({ length: 12 }, (_, index) => index + 1);

    const handleFilter = () => {
        onFilter({
            ville: selectedVille,
            client: selectedClients,
            montant: { min: minMontant, max: maxMontant },
            dateRange: {
                months: selectedMonths,
                year: selectedYear,
            },
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
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleMonthChange = (months) => {
        setSelectedMonths(months);
    };

    const handleYearChange = (year) => {
        setSelectedYear(year);
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
                <div style={{ display: 'flex', gap: '1rem' }}>
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
                                {moment().month(month - 1).format('MMMM')}
                            </Option>
                        ))}
                    </Select>

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
