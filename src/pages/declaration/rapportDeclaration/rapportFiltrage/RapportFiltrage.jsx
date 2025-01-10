import React, { useEffect, useState } from 'react';
import { Select, Button } from 'antd';
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

    // Générer la liste des mois de l'année
    const months = Array.from({ length: 12 }, (_, index) => index + 1);

    const handleFilter = () => {
        onFilter({
            ville: selectedVille,
            client: selectedClients,
            dateRange: selectedMonths
        });
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [clientData, provinceData] = await Promise.all([
                    getClient(),
                    getProvince()
                ]);

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
        {
            filtraVille && (
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
            )
        }
            
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
                <label>Période :</label>
                <Select
                    mode="multiple"
                    placeholder="Sélectionnez les mois"
                    value={selectedMonths}
                    onChange={setSelectedMonths}
                    style={{ width: '100%' }}
                    showSearch
                    optionFilterProp="children"
                >
                    {months.map((month) => (
                        <Option key={month} value={month}>
                            {moment().month(month - 1).format('MMMM')} {/* Affiche le mois en texte */}
                        </Option>
                    ))}
                </Select>

            </div>
            <Button style={{padding:'10px', marginTop:'20px'}} type="primary" icon={<SearchOutlined />} onClick={handleFilter}>
            </Button>
        </div>
    );
};

export default RapportFiltrage;
