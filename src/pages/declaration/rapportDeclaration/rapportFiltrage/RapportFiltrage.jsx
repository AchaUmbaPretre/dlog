import { useEffect, useState } from 'react';
import { Select, Skeleton, Input, Checkbox, Collapse } from 'antd';
import 'antd/dist/reset.css';
import moment from 'moment';
import { getClient, getProvinceClient } from '../../../../services/clientService';
import { getBatiment, getStatus_batiment } from '../../../../services/typeService';
import { getMois, getAnnee, getTemplate } from '../../../../services/templateService';
import { useSelector } from 'react-redux';

const { Panel } = Collapse;

const RapportFiltrage = ({ onFilter, filtraVille, filtraClient, filtraStatus, filtreBatiment, filtreTemplate, filtreMontant }) => {
    const [province, setProvince] = useState([]);
    const [client, setClient] = useState([]);
    const [selectedVille, setSelectedVille] = useState([]);
    const [selectedType, setSelectedType] = useState('');
    const [selectedClients, setSelectedClients] = useState([]);
    const [selectedBatiment, setSelectedBatiment] = useState([]);
    const [selectedTemplate, setSelectedTemplate] = useState([]);
    const [minMontant, setMinMontant] = useState(null);
    const [maxMontant, setMaxMontant] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [mois, setMois] = useState([]);
    const [annee, setAnnee] = useState([]);
    const [selectedMois, setSelectedMois] = useState([]);
    const [selectedAnnees, setSelectedAnnees] = useState([]);
    const [type, setType] = useState([]);
    const [batiment, setBatiment] = useState([]);
    const [template, setTemplate] = useState([]);
    const [selectAllClients, setSelectAllClients] = useState(false);
    const [selectAllVilles, setSelectAllVilles] = useState(false);
    const [selectAllBatiment, setSelectAllBatiment] = useState(false);
    const [selectAllTemplate, setSelectAllTemplate] = useState(false);
    const userId = useSelector((state) => state.user?.currentUser?.id_utilisateur);
    const role = useSelector((state) => state.user?.currentUser.role);

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
            batiment: selectedBatiment,
            template: selectedTemplate,
            period,
        });
    
    };
    handleFilter();
}, [province, client, selectedVille, selectedType, selectedClients, selectedTemplate, minMontant, maxMontant, selectedBatiment, mois, annee, selectedMois, selectedAnnees, type ])

    const fetchMoisParAnnee = async (annee) => {
        try {
            const response = await getMois(annee);
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
                const [clientData, provinceData, statutData, yearData, batimentData, templateData] = await Promise.all([ 
                    getClient(),
                    getProvinceClient(),
                    getStatus_batiment(),
                    getAnnee(),
                    getBatiment(),
                    getTemplate(role, userId)
                ]);

                setTemplate(templateData.data);
                setClient(clientData.data);
                setProvince(provinceData.data);
                setType(statutData.data);
                setAnnee(yearData.data);
                setBatiment(batimentData.data)

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

    const options = [
        { value: null, label: 'All' },
        ...type.map((item) => ({
            value: item.id_status_batiment,
            label: item.nom_status_batiment,
        })),
    ];

    const toggleSelectAll = (selectAll, setSelectAll, data, setSelected) => {
        const newState = !selectAll;
        setSelectAll(newState);
    
        if (newState) {
            const allValues = data.map(item => item.value || item.id || item.id_client || item.id_batiment || item.id_template);
            setSelected(allValues);
        } else {
            setSelected([]);
        }
    };
    
    
    
    return (
        <div className="filterTache" style={{ margin: '10px 0' }}>
            {filtreTemplate && (
                <div className="filter_row">
                    <label>Template :</label>
                    <Select
                        mode="multiple"
                        style={{ width: '100%' }}
                        showSearch
                        value={selectedTemplate}
                        options={[
                            {
                                value: 'selectAll',
                                label: selectAllTemplate ? 'Tout désélectionner' : 'Tout sélectionner',
                            },
                            ...template?.map((item) => ({
                            value: item.id_template,
                            label: item.desc_template,
                        }))
                        ]}
                        placeholder="Sélectionnez un template..."
                        optionFilterProp="label"
                        onChange={(newValue) => {
                                    if (newValue.includes('selectAll')) {
                                        toggleSelectAll(selectAllTemplate, setSelectAllTemplate, template, setSelectedTemplate);
                                    } else {
                                        setSelectedTemplate(newValue);
                                    }
                                }}
                    />
                </div>
            )}

            {filtreBatiment && (
                <div className="filter_row">
                    <label>Bâtiment :</label>
                    <Select
                        mode="multiple"
                        style={{ width: '100%' }}
                        showSearch
                        value={selectedBatiment}
                        options={[
                            {
                                value: 'selectAll',
                                label: selectAllBatiment ? 'Tout désélectionner' : 'Tout sélectionner',
                            },
                            ...batiment.map((item) => ({
                                value: item.id_batiment,
                                label: item.nom_batiment,
                            }))
                        ]}
                        placeholder="Sélectionnez un bâtiment..."
                        optionFilterProp="label"
                        onChange={(newValue) => {
                                    if (newValue.includes('selectAll')) {
                                        toggleSelectAll(selectAllBatiment, setSelectAllBatiment, batiment, setSelectedBatiment);
                                    } else {
                                        setSelectedBatiment(newValue);
                                    }
                                }}
                    />
                </div>
            )}
            {filtraVille && (
                <div className="filter_row">
                    <label>Ville :</label>
                    {isLoading ? (
                        <Skeleton.Input active={true} />
                    ) : (
                        <Select
                            mode="multiple"
                            showSearch
                            value={selectedVille}
                            style={{ width: '100%' }}
                            options={[
                                {
                                value: 'selectAll',
                                label: selectAllVilles ? 'Tout désélectionner' : 'Tout sélectionner',
                                },
                                ...province.map((item) => ({
                                value: item.id,
                                label: item.capital,
                            }))
                            ]}
                            placeholder="Sélectionnez..."
                            optionFilterProp="label"
                            onChange={(newValue) => {
                                    if (newValue.includes('selectAll')) {
                                        toggleSelectAll(selectAllVilles, setSelectAllVilles, province, setSelectedVille);
                                    } else {
                                        setSelectedVille(newValue);
                                    }
                                }}
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
                        <>
                            <Select
                                mode="multiple"
                                style={{ width: '100%' }}
                                showSearch
                                value={selectedClients}
                                options={[
                                    {
                                        value: 'selectAll',
                                        label: selectAllClients ? 'Tout désélectionner' : 'Tout sélectionner',
                                    },
                                    ...client.map((item) => ({
                                        value: item.id_client,
                                        label: item.nom,
                                    })),
                                ]}
                                placeholder="Sélectionnez un client..."
                                optionFilterProp="label"
                                onChange={(newValue) => {
                                    if (newValue.includes('selectAll')) {
                                        toggleSelectAll(selectAllClients, setSelectAllClients, client, setSelectedClients);
                                    } else {
                                        setSelectedClients(newValue);
                                    }
                                }}
                            />
                        </>
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
                            options={options}
                            placeholder="Sélectionnez..."
                            optionFilterProp="label"
                            onChange={setSelectedType}
                        />
                    )}
                </div>
            )}

            {filtreMontant && (
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
            )
            }

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
