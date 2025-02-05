import React, { useEffect, useState } from 'react';
import { Select, Skeleton, Input, Checkbox, Collapse } from 'antd';
import 'antd/dist/reset.css';
import moment from 'moment';
import { getClient, getProvince } from '../../../../services/clientService';
import { getStatus_batiment } from '../../../../services/typeService';
import { getMois, getAnnee } from '../../../../services/templateService';

const { Option } = Select;
const { Panel } = Collapse;

const RapportFiltrage = ({ onFilter, filtraVille, filtraClient, filtraStatus }) => {
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
            status_batiment: selectedType,
            montant: { min: minMontant, max: maxMontant },
            period,
        });
    };
    handleFilter();
}, [province, client, selectedVille, selectedType, selectedClients, minMontant, maxMontant, mois, annee, selectedMois, selectedAnnees, type ])

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

    const fetchData = async () => {
            setIsLoading(true);
            try {
                const [clientData, provinceData, statutData, yearData] = await Promise.all([ 
                    getClient(),
                    getProvince(),
                    getStatus_batiment(),
                    getAnnee()
                ]);

                setClient(clientData.data);
                setProvince(provinceData.data);
                setType(statutData.data);
                setAnnee(yearData.data);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
    }

    useEffect(() => {
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

            {filtraClient && (
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

            {filtraStatus && (
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

        </div>
    );
};

export default RapportFiltrage;
