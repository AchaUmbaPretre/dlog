import React, { useEffect, useState } from 'react';
import { Select, Button, Collapse, Checkbox, } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import 'antd/dist/reset.css';
import { getClient, getProvince } from '../../../services/clientService';
import { getBatiment } from '../../../services/typeService';
import moment from 'moment';
import { getAnnee, getMois } from '../../../services/templateService';

const { Option } = Select;
const { Panel } = Collapse;

const DeclarationFiltre = ({ onFilter, visible }) => {
    const [province, setProvince] = useState([]);
    const [client, setClient] = useState([]);
    const [batiment, setBatiment] = useState([]);
    const [selectedVille, setSelectedVille] = useState([]);
    const [selectedClients, setSelectedClients] = useState([]);
    const [selectedBatiment, setSelectedBatiment] = useState([]);
    const [selectedMois, setSelectedMois] = useState([]);
    const [selectedAnnees, setSelectedAnnees] = useState([]);
    const [mois, setMois] = useState([]);
    const [annee, setAnnee] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [batimentData, clientData, provinceData, yearData] = await Promise.all([
                    getBatiment(),
                    getClient(),
                    getProvince(),
                    getAnnee()
                ]);

                setBatiment(batimentData.data);
                setClient(clientData.data);
                setProvince(provinceData.data);
                setAnnee(yearData.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, []);

    
        const fetchMoisParAnnee = async (annee) => {
            try {
                const response = await getMois(annee); // Modifier `getMois` pour accepter l'année comme paramètre
                setMois((prev) => ({
                    ...prev,
                    [annee]: response.data,
                }));
            } catch (error) {
                console.error("Erreur lors du chargement des mois :", error);
            }
        };

    const handleMoisChange = (checkedValues, annee) => {
        setSelectedMois((prev) => ({
            ...prev,
            [annee]: checkedValues,
        }));
    };

    const handleAnneeChange = (checkedValues) => {
        setSelectedAnnees(checkedValues);
        checkedValues.forEach((annee) => {
            if (!mois[annee]) {
                fetchMoisParAnnee(annee);
            }
        });
    };
    
    const renderMoisParAnnee = () => {
        return selectedAnnees.map((year) => (
            <Panel header={year} key={year}>
                <Checkbox.Group
                    options={(mois[year] || []).map((item) => ({
                        label: moment().month(item.mois - 1).format('MMMM'),
                        value: `${item.mois}-${year}`,
                    }))}
                    value={selectedMois[year] || []}
                    onChange={(checkedValues) => handleMoisChange(checkedValues, year)}
                />
            </Panel>
        ));
    };

    useEffect(()=> {
        const handleFilter = () => {
            const period = {
                mois: [],
                annees: selectedAnnees,
            };
        
            selectedAnnees.forEach(year => {
                if (selectedMois[year]) {
                    selectedMois[year].forEach(mois => {
                    period.mois.push(mois.split('-')[0]); 
                    });
                }
            });
        
            onFilter({
                ville: selectedVille,
                client: selectedClients,
                batiment: selectedBatiment,
                period,
            });
        
        };
        handleFilter();
    }, [province, client, selectedVille, selectedClients, selectedBatiment, mois, annee, selectedMois, selectedAnnees ])
    

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
                <label>Année :</label>
                <Checkbox.Group
                    options={annee.map((item) => ({
                        label: item.annee,
                        value: item.annee,
                    }))}
                    value={selectedAnnees}
                    onChange={handleAnneeChange}
                />
            </div>

            {selectedAnnees.length > 0 && (
                <div className="filter_row">
                    <label>Mois :</label>
                    <Collapse defaultActiveKey={selectedAnnees}>
                        {renderMoisParAnnee()}
                    </Collapse>
                </div>
            )}

{/*             <Button
                style={{ padding: '10px', marginTop: '20px' }}
                type="primary"
                icon={<SearchOutlined />}
                onClick={handleFilter}
            >
                Filtrer
            </Button> */}
        </div>
    );
};

export default DeclarationFiltre;
