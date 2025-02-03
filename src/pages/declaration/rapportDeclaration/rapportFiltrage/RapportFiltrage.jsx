import React, { useEffect, useState } from 'react';
import { Select, Button, Skeleton, Input, Checkbox, Collapse } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import 'antd/dist/reset.css';
import moment from 'moment';
import { getClient, getProvince } from '../../../../services/clientService';
import { getStatus_batiment } from '../../../../services/typeService';
import { getMois, getAnnee } from '../../../../services/templateService';

const { Option } = Select;
const { Panel } = Collapse;

const RapportFiltrage = ({ onFilter, filtraVille }) => {
    const [province, setProvince] = useState([]);
    const [client, setClient] = useState([]);
    const [selectedVille, setSelectedVille] = useState([]);
    const [selectedType, setSelectedType] = useState('');
    const [selectedClients, setSelectedClients] = useState([]);
    const [minMontant, setMinMontant] = useState(null);
    const [maxMontant, setMaxMontant] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [mois, setMois] = useState([]);
    const [annee, setAnnee] = useState([]);
    const [selectedMois, setSelectedMois] = useState([]);
    const [selectedAnnees, setSelectedAnnees] = useState([]);
    const [type, setType] = useState([]);

const handleFilter = () => {
    // Format selected months and years
    const period = {
        mois: [],
        annees: selectedAnnees,
    };

    // Flatten the selected months for each year
    selectedAnnees.forEach(year => {
        if (selectedMois[year]) {
            selectedMois[year].forEach(mois => {
                period.mois.push(mois.split('-')[0]); // Extracting month from "mois-annee"
            });
        }
    });

    // Prepare the filter data
    onFilter({
        ville: selectedVille,
        client: selectedClients,
        status_batiment: selectedType,
        montant: { min: minMontant, max: maxMontant },
        period,  // Pass formatted period object
    });
};


    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const [clientData, provinceData, statutData, moisData, yearData] = await Promise.all([ 
                    getClient(),
                    getProvince(),
                    getStatus_batiment(),
                    getMois(),
                    getAnnee()
                ]);

                setClient(clientData.data);
                setProvince(provinceData.data);
                setType(statutData.data);
                setMois(moisData.data); // Utiliser les données de mois
                setAnnee(yearData.data); // Utiliser les données d'année
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleMoisChange = (checkedValues, annee) => {
        setSelectedMois((prev) => ({
            ...prev,
            [annee]: checkedValues,
        }));
    };

    const handleAnneeChange = (checkedValues) => {
        setSelectedAnnees(checkedValues);
    };

    const renderMoisParAnnee = () => {
        return annee.map((year) => {
            if (selectedAnnees.includes(year.annee)) {
                return (
                    <Panel header={year.annee} key={year.annee}>
                        <Checkbox.Group
                            options={mois.map((item) => ({
                                label: moment().month(item.mois - 1).format('MMMM'),
                                value: `${item.mois}-${year.annee}`,
                            }))}
                            value={selectedMois[year.annee] || []}
                            onChange={(checkedValues) => handleMoisChange(checkedValues, year.annee)}
                        />
                    </Panel>
                );
            }
            return null;
        });
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

            {!filtraVille && (
                <div className="filter_row">
                    <label>Type de batiment :</label>
                    {isLoading ? (
                        <Skeleton.Input active={true} />
                    ) : (
                        <Select
                            showSearch
                            style={{ width: '100%' }}
                            options={type.map((item) => ({
                                value: item.id_status_batiment,
                                label: item.nom_status_batiment,
                            }))}
                            placeholder="Sélectionnez..."
                            optionFilterProp="label"
                            onChange={setSelectedType}
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
                        onChange={(e) => setMinMontant(e.target.value)}
                    />
                    <Input
                        placeholder="Max"
                        type="number"
                        value={maxMontant}
                        onChange={(e) => setMaxMontant(e.target.value)}
                    />
                </div>
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

export default RapportFiltrage;
