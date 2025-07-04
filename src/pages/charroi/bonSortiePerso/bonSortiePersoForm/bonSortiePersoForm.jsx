import { useEffect, useState } from 'react'
import { Form, Row, Input, Card, Col, DatePicker, message, Skeleton, Select, Button } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { getPersonne, getSociete } from '../../../../services/userService';
import { getChauffeur, getDestination, getMotif, getServiceDemandeur, getTypeVehicule, postBonSortiePerso } from '../../../../services/charroiService';
import { getClient } from '../../../../services/clientService';

const BonSortiePersoForm = ({closeModal, fetchData}) => {
    const [form] = Form.useForm();
    const [ loading, setLoading ] = useState(false);
    const [ loadingData, setLoadingData ] = useState(false);
    const userId = useSelector((state) => state.user?.currentUser?.id_utilisateur);
    const [ type, setType ] = useState([]);
    const [ motif, setMotif ] = useState([]);
    const [ service, setService ] = useState([]);
    const [ client, setClient ] = useState([]);
    const [ destination, setDestination ] = useState([]);
    const [ societe, setSociete ] = useState([]);
    const [ person, setPerson ] = useState([]);

        const fetchDatas = async() => {
            try {
                const [serviceData, typeData, motifData, clientData, localData, societeData, persoData] = await Promise.all([
                    getServiceDemandeur(),
                    getTypeVehicule(),
                    getMotif(),
                    getClient(),
                    getDestination(),
                    getSociete(),
                    getPersonne()
                ])
    
                setService(serviceData.data);
                setType(typeData.data);
                setMotif(motifData.data);
                setClient(clientData.data);
                setDestination(localData.data);
                setSociete(societeData.data);
                setPerson(persoData.data)
                
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoadingData(false);
            }
        }
    
        useEffect(()=> {
            fetchDatas();
        }, []);


    const onFinish = async (values) => {
        await form.validateFields();
        
        const loadingKey = 'loadingAffectation';
            message.loading({ content: 'Traitement en cours, veuillez patienter...', key: loadingKey, duration: 0 });
            setLoading(true);
        
                try {
                    await postBonSortiePerso({
                        ...values,
                        user_cr: userId
                    })
                    
                    message.success({ content: "Le bon de sortie a été enregistré avec succès.", key: loadingKey });
                    fetchData();
                    closeModal();
        
                } catch (error) {
                    console.error("Erreur lors de l'ajout de bon de sortie :", error);
                    message.error({ content: 'Une erreur est survenue.', key: loadingKey });
                } finally {
                    setLoading(false);
                }
    }


  return (
    <>
        <div className="controle_form">
            <div className="controle_title_rows">
                <div className="controle_h2">Formulaire de bon de sortie du personnel</div>
            </div>
            <div className="controle_wrapper">
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    initialValues={{ id_societe: 1 }}
                >
                    <Card>
                        <Row gutter={12}>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    label="Date & heure de sortie"
                                    name="date_sortie"
                                    rules={[{ required: true, message: "Veuillez fournir la date et l'heure"}]}
                                >
                                    <DatePicker 
                                        style={{width:'100%'}}
                                        showTime={{ format: 'HH:mm' }} 
                                        format="YYYY-MM-DD HH:mm" 
                                        placeholder="Choisir date et heure" 
                                    />
                                </Form.Item>
                            </Col>
                            
                            <Col xs={24} md={12}>
                                <Form.Item
                                    label="Retour prévue"
                                    name="date_retour"
                                    rules={[{ required: false, message: "Veuillez fournir la date et l'heure"}]}
                                >
                                    <DatePicker 
                                        style={{width:'100%'}}
                                        showTime={{ format: 'HH:mm' }} 
                                        format="YYYY-MM-DD HH:mm" 
                                        placeholder="Choisir date et heure" 
                                    />
                                </Form.Item>
                            </Col>

                                                        <Col xs={24} md={12}>
                                <Form.Item
                                    label="Personnel"
                                    name="id_personnel"
                                    rules={[{ required: true, message: 'Veuillez sélectionner un personnel' }]}
                                >
                                    { loadingData ? <Skeleton.Input active={true} /> : 
                                    <Select
                                        allowClear
                                        showSearch
                                        options={person?.map((item) => ({
                                            value: item.id_personnel ,
                                            label: `${item.nom}`,
                                        }))}
                                        optionFilterProp="label"
                                        placeholder="Sélectionnez..."
                                    />
                                    }
                                </Form.Item>
                            </Col>
                            
                            <Col xs={24} md={12}>
                                <Form.Item
                                    label="Motif"
                                    name="id_motif"
                                    rules={[{ required: true, message: 'Veuillez sélectionner un motif' }]}
                                >
                                    { loadingData ? <Skeleton.Input active={true} /> : 
                                    <Select
                                        allowClear
                                        showSearch
                                        options={motif?.map((item) => ({
                                            value: item.id_motif_demande,
                                            label: `${item.nom_motif_demande}`,
                                        }))}
                                        optionFilterProp="label"
                                        placeholder="Sélectionnez..."
                                    />
                                    }
                                </Form.Item>
                            </Col>
                            
                            <Col xs={24} md={12}>
                                <Form.Item
                                    label="Service demandeur"
                                    name="id_demandeur"
                                >
                                    { loadingData ? <Skeleton.Input active={true} /> : 
                                    <Select
                                        allowClear
                                        showSearch
                                        options={service?.map((item) => ({
                                            value: item.id_service_demandeur,
                                            label: `${item.nom_service}`,
                                        }))}
                                        optionFilterProp="label"
                                        placeholder="Sélectionnez..."
                                    />
                                    }
                                </Form.Item>
                            </Col>
                            
                            <Col xs={24} md={12}>
                                <Form.Item
                                    label="Client"
                                    name="id_client"
                                >
                                    { loadingData ? <Skeleton.Input active={true} /> : 
                                    <Select
                                        allowClear
                                        showSearch
                                        options={client?.map((item) => ({
                                            value: item.id_client,
                                            label: `${item.nom}`,
                                        }))}
                                        optionFilterProp="label"
                                        placeholder="Sélectionnez..."
                                    />
                                    }
                                </Form.Item>
                            </Col>
                            
                            <Col xs={24} md={12}>
                                <Form.Item
                                    label="Destination"
                                    name="id_destination"
                                >
                                    { loadingData ? <Skeleton.Input active={true} /> : 
                                    <Select
                                        allowClear
                                        showSearch
                                        options={destination?.map((item) => ({
                                            value: item.id_destination,
                                            label: `${item.nom_destination}`,
                                        }))}
                                        optionFilterProp="label"
                                        placeholder="Sélectionnez..."
                                    />
                                    }
                                </Form.Item>
                            </Col>

                            <Col xs={24} md={12}>
                                <Form.Item
                                    label="Société"
                                    name="id_societe"
                                    value={1}
                                    rules={[{ required: true, message: 'Veuillez sélectionner une société' }]}
                                >
                                    { loadingData ? <Skeleton.Input active={true} /> : 
                                    <Select
                                        allowClear
                                        showSearch
                                        options={societe?.map((item) => ({
                                            value: item.id_societe,
                                            label: `${item.nom_societe}`,
                                        }))}
                                        optionFilterProp="label"
                                        placeholder="Sélectionnez..."
                                    />
                                    }
                                </Form.Item>
                            </Col>

                            <div style={{ marginTop: '20px' }}>
                                <Button type="primary" htmlType="submit" icon={<SendOutlined />} loading={loading} disabled={loading} >
                                    Soumettre
                                </Button>
                            </div>
                        </Row>
                    </Card>
                </Form>
            </div>
        </div>
    </>
  )
}

export default BonSortiePersoForm;