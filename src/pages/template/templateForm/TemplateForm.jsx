import { useEffect, useState } from 'react';
import { Button, Form, Input, Select, Tooltip, Row, Col, DatePicker, notification, Skeleton, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { getClient } from '../../../services/clientService';
import { getContrat, getObjetFacture, getTemplateOne, getTypeOccupation, postTemplate, putTemplate } from '../../../services/templateService';
import { getBatiment } from '../../../services/typeService';
import { getDenominationOne, getNiveauOne } from '../../../services/batimentService';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import ClientForm from '../../client/clientForm/ClientForm';
import BatimentForm from '../../batiment/batimentForm/BatimentForm';
import NiveauForm from '../../batiment/niveau/niveauForm/NiveauForm';
import DenominationForm from '../../batiment/denomination/denominationForm/DenominationForm';
import ContratForm from '../../contrat/contratForm/ContratForm';
import { useSelector } from 'react-redux';

const TemplateForm = ({ closeModal, fetchData, idTemplate }) => {
    const [form] = Form.useForm();
    const [isLoading, setIsLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [client, setClient] = useState([]);
    const [typeOccupation, setTypeOccupation] = useState([]);
    const [batiment, setBatiment] = useState([]);
    const [idBatiment, setIdBatiment] = useState('');
    const [niveau, setNiveau] = useState([]);
    const [denomination, setDenomination] = useState([]);
    const [modalType, setModalType] = useState(null);
    const [objet, setObjet] = useState([]);
    const [contrat, setContrat] = useState([]);
    const navigate = useNavigate();
    const userId = useSelector((state) => state.user?.currentUser?.id_utilisateur);

    const fetchDataAll = async () => {
        setIsLoading(true);
        try {
            const [clientData, typeOccupationData, batimentData, objetData, contratData] = await Promise.all([
                getClient(),
                getTypeOccupation(),
                getBatiment(),
                getObjetFacture(),
                getContrat()
            ]);

            setClient(clientData.data);
            setTypeOccupation(typeOccupationData.data);
            setBatiment(batimentData.data);
            setObjet(objetData.data);
            setContrat(contratData.data)

            if (idBatiment) {
                const [niveauData, denominationData] = await Promise.all([
                    getNiveauOne(idBatiment),
                    getDenominationOne(idBatiment),
                ]);
                setNiveau(niveauData.data);
                setDenomination(denominationData.data);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handlClient = () => openModal('AddClient');
    const handlBatiment = () => openModal('AddBatiment');
    const handlNiveau = () => openModal('AddNiveau');
    const handlDenom = () => openModal('AddDenom');
    const handlContrat = () => openModal('AddContrat');

    const closeAllModals = () => {
        setModalType(null);
      };
      
      const openModal = (type) => {
        setModalType(type);
      };

    useEffect(() => {
        fetchDataAll();
          // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [idBatiment ]);

    useEffect(() => {
        form.resetFields()
      }, [form]);

    const handleTemplateChange = async () => {
        try {
            const { data } = await getTemplateOne(idTemplate);
        
            form.setFieldsValue({
                ...data[0],
                date_actif : moment(data[0].date_actif, 'YYYY-MM-DD')
            });
        } catch (error) {
            console.log(error)
        }
    };
    
    useEffect(() => {
        handleTemplateChange()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [idTemplate]);

    const onFinish = async (values) => {
        setLoading(true)

        try {
            if(idTemplate) {
                await putTemplate(idTemplate, values)
            }
            else{
                await postTemplate(values,userId)
            }
            notification.success({
                message: 'Succès',
                description: 'Les informations ont été enregistrées avec succès.',
            });
            form.resetFields();
            navigate('/liste_template')
            fetchData();
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
                <h2 className="controle_h2">{idTemplate ? 'Modifier le template' : "Insérer un nouveau template"}</h2>
            </div>
            <div className="client_wrapper">
                <Form form={form} layout="vertical" onFinish={onFinish}>
                    <Row gutter={16}>
                        <Col xs={{ span: 24 }} sm={{ span: 8 }}>
                            <Form.Item
                                label="Client"
                                name="id_client"
                                rules={[{ required: true, message: 'Veuillez sélectionner un client!' }]}
                            >
                                { isLoading ? <Skeleton.Input active={true} /> : 
                                <Select
                                    showSearch
                                    options={client.map(item => ({ value: item.id_client, label: item.nom }))}
                                    placeholder="Sélectionnez un client..."
                                    optionFilterProp="label"
                                />
                                }
                            </Form.Item>
                            <Tooltip title="Créer un nouveau client">
                                <Button 
                                    style={{ marginBottom: '5px' }}
                                    icon={<PlusOutlined />}
                                    onClick={handlClient}
                                >
                                </Button>
                            </Tooltip>
                        </Col>

                        <Col xs={{ span: 24 }} sm={{ span: 8 }}>
                            <Form.Item
                                label="Type d'occupation"
                                name="id_type_occupation"
                                rules={[{ required: true, message: 'Veuillez sélectionner un type d\'occupation!' }]}
                            >
                            { isLoading ? <Skeleton.Input active={true} /> : 
                                <Select
                                    showSearch
                                    options={typeOccupation.map(item => ({ value: item.id_type_d_occupation, label: item.nom_type_d_occupation }))}
                                    placeholder="Sélectionnez un type d'occupation..."
                                    optionFilterProp="label"
                                />
                            }
                            </Form.Item>
                        </Col>

                        <Col xs={{ span: 24 }} sm={{ span: 8 }}>
                            <Form.Item
                                label="Bâtiment"
                                name="id_batiment"
                                rules={[{ required: true, message: 'Veuillez sélectionner un bâtiment!' }]}
                            >
                            { isLoading ? <Skeleton.Input active={true} /> : 
                                <Select
                                    showSearch
                                    options={batiment.map(item => ({ value: item.id_batiment, label: item.nom_batiment }))}
                                    placeholder="Sélectionnez un bâtiment..."
                                    optionFilterProp="label"
                                    onChange={(value) => setIdBatiment(value)}
                                />
                            }
                            </Form.Item>
                            <Tooltip title="Créer un nouveau batiment">
                                <Button 
                                    style={{ marginBottom: '5px' }}
                                    icon={<PlusOutlined />}
                                    onClick={handlBatiment}
                                >
                                </Button>
                            </Tooltip>
                        </Col>

                        <Col xs={{ span: 24 }} sm={{ span: 8 }}>
                            <Form.Item
                                label="Niveau"
                                name="id_niveau"
                                rules={[{ required: true, message: 'Veuillez sélectionner un niveau!' }]}
                            >
                                { isLoading ? <Skeleton.Input active={true} /> : 
                                    <Select
                                        showSearch
                                        options={niveau.map(item => ({ value: item.id_niveau, label: item.nom_niveau }))}
                                        placeholder="Sélectionnez un niveau..."
                                        optionFilterProp="label"
                                    />
                                }
                            </Form.Item>
                            <Tooltip title="Créer un nouveau niveau">
                                <Button 
                                    style={{ marginBottom: '5px' }}
                                    icon={<PlusOutlined />}
                                    onClick={handlNiveau}
                                >
                                </Button>
                            </Tooltip>
                        </Col>

                        <Col xs={{ span: 24 }} sm={{ span: 8 }}>
                            <Form.Item
                                label="Dénomination"
                                name="id_denomination"
                                rules={[{ required: true, message: 'Veuillez sélectionner une dénomination!' }]}
                            >
                                {
                                     isLoading ? <Skeleton.Input active={true} /> : 
                                    <Select
                                        showSearch
                                        options={denomination.map(item => ({ value: item.id_denomination_bat, label: item.nom_denomination_bat }))}
                                        placeholder="Sélectionnez une dénomination..."
                                        optionFilterProp="label"
                                    />
                                }
                            </Form.Item>
                            <Tooltip title="Créer une nouvelle dénomination">
                                <Button 
                                    style={{ marginBottom: '5px' }}
                                    icon={<PlusOutlined />}
                                    onClick={handlDenom}
                                >
                                </Button>
                            </Tooltip>
                        </Col>

                        <Col xs={{ span: 24 }} sm={{ span: 8 }}>
                            <Form.Item
                                label="Warehouse facture"
                                name="id_batiment_fact"
                                rules={[{ required: true, message: 'Veuillez sélectionner un Warehouse facture!' }]}
                            >
                                { isLoading ? <Skeleton.Input active={true} /> : 
                                    <Select
                                        showSearch
                                        options={batiment.map(item => ({ value: item.id_batiment, label: item.nom_batiment }))}
                                        placeholder="Sélectionnez un bâtiment..."
                                        optionFilterProp="label"
                                    />
                                }
                            </Form.Item>
                        </Col>

                        <Col xs={{ span: 24 }} sm={{ span: 8 }}>
                            <Form.Item
                                label="Contrat"
                                name="id_contrat"
                                rules={[{ required: false, message: 'Veuillez sélectionner un contrat!' }]}
                            >
                                { isLoading ? <Skeleton.Input active={true} /> : 
                                <Select
                                    showSearch
                                    options={contrat.map(item => ({ value: item.id_contrat, label: item.conditions }))}
                                    placeholder="Sélectionnez un contrat..."
                                    optionFilterProp="label"
                                />
                                }
                            </Form.Item>
                            <Tooltip title="Créer un contrat">
                                <Button 
                                    style={{ marginBottom: '5px' }}
                                    icon={<PlusOutlined />}
                                    onClick={handlContrat}
                                >
                                </Button>
                            </Tooltip>
                        </Col>

                        <Col xs={{ span: 24 }} sm={{ span: 8 }}>
                            <Form.Item
                                label="Objet facture"
                                name="id_objet_fact"
                                rules={[{ required: true, message: 'Veuillez sélectionner un objet facture!' }]}
                            >
                                { isLoading ? <Skeleton.Input active={true} /> : 
                                <Select
                                    showSearch
                                    options={objet.map(item => ({ value: item.id_objet_fact, label: item.nom_objet_fact }))}
                                    placeholder="Sélectionnez un objet facture..."
                                    optionFilterProp="label"
                                />
                                }
                            </Form.Item>
                        </Col>

                        <Col xs={{ span: 24 }} sm={{ span: 8 }}>
                            <Form.Item
                                label="Date actif"
                                name="date_actif"
                                rules={[{ required: true, message: 'La date active est requise' }]}
                                initialValue={moment()}
                            >
                                { isLoading ? <Skeleton.Input active={true} style={{ width: '100%' }}  /> : 
                                    <DatePicker placeholder="Sélectionnez la date active" style={{ width: '100%' }} />
                                }
                            </Form.Item>
                        </Col>

                        <Col span={24}>
                            <Form.Item
                                label="Description (Titre)"
                                name="desc_template"
                                rules={[{ required: true, message: 'Veuillez entrez la description!' }]}
                            >
                                { isLoading ? <Skeleton.Input active={true} style={{ width: '100%' }}  /> : 
                                <Input.TextArea
                                    style={{ height: '80px', resize: 'none' }}
                                    placeholder="Entrez la description..."
                                />
                                }
                            </Form.Item>
                        </Col>
                    </Row>
                
                    <Form.Item> 
                        <Button type="primary" htmlType="submit" loading={loading} disabled={loading}>
                            { idTemplate ? 'Modifier' : 'Enregistrer'}
                        </Button>
                    </Form.Item>
                </Form>
            </div>

            <Modal
                title=""
                visible={modalType === 'AddClient'}
                onCancel={closeAllModals}
                footer={null}
                width={750}
                centered
            >
                <ClientForm closeModal={() => setModalType(null)} idClient={''} fetchData={fetchDataAll} />
            </Modal>

            <Modal
                title=""
                visible={modalType === 'AddBatiment'}
                onCancel={closeAllModals}
                footer={null}
                width={900}
                centered
            >
                <BatimentForm idBatiment={''} closeModal={()=>setModalType(null)} fetchData={fetchDataAll}/>
            </Modal>

            <Modal
                title=""
                visible={modalType === 'AddNiveau'}
                onCancel={closeAllModals}
                footer={null}
                width={600}
                centered
            >
                <NiveauForm idBatiment={idBatiment} closeModal={()=>setModalType(null)} fetchData={fetchDataAll} />
            </Modal>

            <Modal
                title=""
                visible={modalType === 'AddDenom'}
                onCancel={closeAllModals}
                footer={null}
                width={600}
                centered
            >
                <DenominationForm idBatiment={idBatiment} idDenomination_bat={''} closeModal={()=>setModalType(null)} fetchData={fetchDataAll}  />
            </Modal>

            <Modal
                title=""
                visible={modalType === 'AddContrat'}
                onCancel={closeAllModals}
                footer={null}
                width={900}
                centered
            >
                <ContratForm closeModal={()=>setModalType(null)} fetchData={fetchDataAll}  />
            </Modal>
        </div>
    );
};

export default TemplateForm;
