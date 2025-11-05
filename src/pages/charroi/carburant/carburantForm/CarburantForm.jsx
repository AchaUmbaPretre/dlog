import { useEffect, useState } from 'react';
import { Button, Form, Input, Select, Tooltip, Row, Col, DatePicker, notification, Skeleton, Modal } from 'antd';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { getChauffeur, getVehicule } from '../../../../services/charroiService';
import { getFournisseur } from '../../../../services/fournisseurService';
import { postCarburant } from '../../../../services/carburantService';

const CarburantForm = ({ closeModal, fetchData }) => {
    const [form] = Form.useForm();
    const [isLoading, setIsLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [fournisseur, setFournisseur] = useState([]);
    const [vehicules, setVehicules] = useState([]);
    const [chauffeur, setChauffeur] = useState([]);
    const userId = useSelector((state) => state.user?.currentUser?.id_utilisateur);

    const fetchDataAll = async () => {
        setIsLoading(true);
        try {
            const [vehiculeData, fournisseurData, chauffeurData ] = await Promise.all([
                getVehicule(),
                getFournisseur(),
                getChauffeur()
            ]);

            setVehicules(vehiculeData.data);
            setFournisseur(fournisseurData.data);
            setChauffeur(chauffeurData.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setIsLoading(false);
        }
    };
      
    useEffect(() => {
        form.resetFields()
    }, [form]);
    
    useEffect(() => {
        fetchDataAll()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onFinish = async (values) => {
        setLoading(true)

        try {
            
            await postCarburant(values)
            notification.success({
                message: 'Succès',
                description: 'Les informations ont été enregistrées avec succès.',
            });
            form.resetFields();
            closeModal();
        } catch (error) {
            console.error("Erreur lors de l'enregistrement : ", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="client_form" style={{ padding: '20px', background: '#fff', borderRadius: '5px' }}>
            <div className="controle_title_rows">
                <h2 className="controle_h2">Insérer un nouveau Info carburant</h2>
            </div>
            <div className="client_wrapper">
                <Form form={form} layout="vertical" onFinish={onFinish}>
                    <Row gutter={16}>
                        <Col xs={{ span: 24 }} sm={{ span: 8 }}>
                            <Form.Item
                                label="Num pc"
                                name="num_pc"
                                rules={[{ required: true, message: 'Veuillez entrez la description!' }]}
                            >
                                { isLoading ? <Skeleton.Input active={true} style={{ width: '100%' }}  /> : 
                                <Input
                                    placeholder="Entrez la description..."
                                />
                                }
                            </Form.Item>
                        </Col>

                        <Col xs={{ span: 24 }} sm={{ span: 8 }}>
                            <Form.Item
                                label="Num facture"
                                name="num_facture"
                                rules={[{ required: false, message: 'Veuillez entrez la description!' }]}
                            >
                                { isLoading ? <Skeleton.Input active={true} style={{ width: '100%' }}  /> : 
                                <Input
                                    placeholder="ex: 12BC1..."
                                />
                                }
                            </Form.Item>
                        </Col>
                        
                        <Col xs={{ span: 24 }} sm={{ span: 8 }}>
                            <Form.Item
                                label="Véhicule"
                                name="id_vehicule"
                                rules={[{ required: true, message: 'Veuillez sélectionner un véhicule!' }]}
                            >
                            { isLoading ? <Skeleton.Input active={true} /> : 
                                <Select
                                    showSearch
                                    options={vehicules.map(item => ({ value: item.id_vehicule, label: item.nom_vehicule }))}
                                    placeholder="Sélectionnez un véhicule..."
                                    optionFilterProp="label"
                                />
                            }
                            </Form.Item>
                        </Col>

                        <Col xs={{ span: 24 }} sm={{ span: 8 }}>
                            <Form.Item
                                label="Chauffeur"
                                name="id_chauffeur"
                                rules={[{ required: true, message: 'Veuillez sélectionner un chauffeur!' }]}
                            >
                            { isLoading ? <Skeleton.Input active={true} /> : 
                                <Select
                                    showSearch
                                    options={chauffeur.map(item => ({ value: item.id_chauffeur, label: item.nom_chauffeur }))}
                                    placeholder="Sélectionnez un chauffeur..."
                                    optionFilterProp="label"
                                />
                            }
                            </Form.Item>
                        </Col>

                        <Col xs={{ span: 24 }} sm={{ span: 8 }}>
                            <Form.Item
                                label="Fournisseur"
                                name="id_fournisseur"
                                rules={[{ required: true, message: 'Veuillez sélectionner un fournisseur!' }]}
                            >
                                { isLoading ? <Skeleton.Input active={true} /> : 
                                    <Select
                                        showSearch
                                        options={fournisseur.map(item => ({ value: item.id_fournisseur, label: item.nom_fournisseur }))}
                                        placeholder="Sélectionnez un fournisseur..."
                                        optionFilterProp="label"
                                    />
                                }
                            </Form.Item>
                        </Col>

                        <Col xs={{ span: 24 }} sm={{ span: 8 }}>
                            <Form.Item
                                label="Qté litre"
                                name="quantite_litres"
                                rules={[{ required: false, message: 'Veuillez entrez la description!' }]}
                            >
                                { isLoading ? <Skeleton.Input active={true} style={{ width: '100%' }}  /> : 
                                <Input
                                    placeholder="ex: 10"
                                />
                                }
                            </Form.Item>
                        </Col>

                        <Col xs={{ span: 24 }} sm={{ span: 8 }}>
                            <Form.Item
                                label="P.U"
                                name="prix_unitaire"
                                rules={[{ required: false, message: 'Veuillez entrez la description!' }]}
                            >
                                { isLoading ? <Skeleton.Input active={true} style={{ width: '100%' }}  /> : 
                                <Input
                                    placeholder="ex: 10"
                                />
                                }
                            </Form.Item>
                        </Col>

                        <Col xs={{ span: 24 }} sm={{ span: 8 }}>
                            <Form.Item
                                label="Montant total"
                                name="montant_total"
                                rules={[{ required: false, message: 'Veuillez entrez la description!' }]}
                            >
                                { isLoading ? <Skeleton.Input active={true} style={{ width: '100%' }}  /> : 
                                <Input
                                    placeholder="ex: 10"
                                />
                                }
                            </Form.Item>
                        </Col>

                        <Col xs={{ span: 24 }} sm={{ span: 8 }}>
                            <Form.Item
                                label="Km actuel."
                                name="compteur_km"
                                rules={[{ required: false, message: 'Veuillez entrez la description!' }]}
                            >
                                { isLoading ? <Skeleton.Input active={true} style={{ width: '100%' }}  /> : 
                                <Input
                                    placeholder="ex: 10"
                                />
                                }
                            </Form.Item>
                        </Col>
                    </Row>
                
                    <Form.Item> 
                        <Button type="primary" htmlType="submit" loading={loading} disabled={loading}>
                            Enregistrer
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default CarburantForm;
