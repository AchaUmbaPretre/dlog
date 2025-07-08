import { useEffect, useState } from 'react';
import { Select, Skeleton, Collapse, Checkbox, } from 'antd';
import 'antd/dist/reset.css';
import { getClient, getProvince } from '../../../services/clientService';
import { getBatiment } from '../../../services/typeService';
import moment from 'moment';
import { getAnnee, getMois } from '../../../services/templateService';

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
    const [isLoading, setIsLoading] = useState(false);
    

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true)
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
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    
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
                { isLoading ? <Skeleton.Input active={true} /> : 
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
                }
            </div>

            {!visible && (
                <div className="filter_row">
                    <label>Clients :</label>
                    { isLoading ? <Skeleton.Input active={true} /> : 
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
                    }
                </div>
            )}

            <div className="filter_row">
                <label>Bâtiment :</label>
                { isLoading ? <Skeleton.Input active={true} /> : 
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
                }
            </div>

            <div className="filter_row">
                <label>Année :</label>
                { isLoading ? <Skeleton.Input active={true} /> : 
                <Checkbox.Group
                    options={annee.map((item) => ({
                        label: item.annee,
                        value: item.annee,
                    }))}
                    value={selectedAnnees}
                    onChange={handleAnneeChange}
                />
                }
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

export default DeclarationFiltre;
