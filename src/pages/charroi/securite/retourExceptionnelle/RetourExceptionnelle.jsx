import { useEffect, useState } from 'react'
import { Form, Row, Input, Card, Col, message, Skeleton, Select, Button } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { getChauffeur, getDestination, getMotif, getServiceDemandeur, getVehiculeDispo, postRetourVehiculeExceptionnel, postSortieVehiculeExceptionnel } from '../../../../services/charroiService';
import { getClient } from '../../../../services/clientService';

const  RetourExceptionnelle = ({closeModal}) => {
    const [form] = Form.useForm();
    const [ loading, setLoading ] = useState(false);
    const [ loadingData, setLoadingData ] = useState(false);
    const [ vehicule, setVehicule ] = useState([]);
    const [ chauffeur, setChauffeur ] = useState([]);
    const userId = useSelector((state) => state.user?.currentUser?.id_utilisateur);
    const [ motif, setMotif ] = useState([]);
    const [ service, setService ] = useState([]);
    const [ destination, setDestination ] = useState([]);
    const [ client, setClient ] = useState([]);

        const fetchDatas = async() => {
            try {
                setLoadingData(true)
                const [vehiculeData, chaufferData, serviceData, motifData, localData, clientData ] = await Promise.all([
                    getVehiculeDispo(),
                    getChauffeur(),
                    getServiceDemandeur(),
                    getMotif(),
                    getDestination(),
                    getClient()
                ])
    
                setVehicule(vehiculeData.data)
                setChauffeur(chaufferData.data?.data)
                setService(serviceData.data);
                setMotif(motifData.data);
                setDestination(localData.data);
                setClient(clientData.data);
    
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
        
        const loadingKey = 'loadingExceptionnelle';
        message.loading({ content: 'Traitement en cours, veuillez patienter...', key: loadingKey, duration: 0 });
            setLoading(true);
        
                try {
                    await postRetourVehiculeExceptionnel({
                        ...values,
                        id_agent: userId,
                        type: 'Retour',
                        mouvement_exceptionnel: 1
                    })
                    
                    message.success({ content: "Sortie exceptionnelle a été enregistré avec succès.", key: loadingKey });
                    form.resetFields();
                    fetchDatas();
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
                <div className="controle_h2">Formulaire de retour sans bon ni enregistrement de sortie</div>
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

                            <Col xs={24} md={6}>
                                <Form.Item
                                    label="Véhicule"
                                    name="id_vehicule"
                                    rules={[{ required: true, message: 'Veuillez sélectionner un véhicule' }]}
                                >
                                { loadingData ? <Skeleton.Input active={true} /> : 
                                    <Select
                                        allowClear
                                        showSearch
                                        options={vehicule?.map((item) => ({
                                            value: item.id_vehicule,
                                            label: `${item.immatriculation} / ${item.nom_marque} / ${item.modele}`,
                                        }))}
                                        optionFilterProp="label"
                                        placeholder="Sélectionnez un vehicule..."
                                /> }
                                </Form.Item>
                            </Col>

                            <Col xs={24} md={6}>
                                <Form.Item
                                    label="Chauffeur"
                                    name="id_chauffeur"
                                    rules={[{ required: true, message: 'Veuillez sélectionner un chauffeur' }]}
                                >
                                { loadingData ? <Skeleton.Input active={true} /> : 
                                <Select
                                    allowClear
                                    showSearch
                                    options={chauffeur?.map((item) => ({
                                        value: item.id_chauffeur,
                                        label: item.nom
                                    }))}
                                    optionFilterProp="label"
                                    placeholder="Sélectionnez un chauffeur..."
                                />}
                                </Form.Item>
                            </Col>
                            
                            <Col xs={24} md={8}>
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
                            
                            <Col xs={24} md={8}>
                                <Form.Item
                                    label="Service demandeur"
                                    name="id_demandeur"
                                    rules={[{ required: true, message: 'Veuillez sélectionner un motif' }]}
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

                            <Col xs={24} md={8}>
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
                            
                            <Col xs={24} md={8}>
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
                            
                            <Col xs={24} md={8}>
                                <Form.Item
                                    label="Personne(s) à bord"
                                    name="personne_bord"
                                >
                                    { loadingData ? <Skeleton.Input active={true} /> : 
                                    <Input placeholder="Saisir..." style={{width:'100%'}}/>
                                    }
                                </Form.Item>
                            </Col>

                            <Col xs={24} md={8}>
                                <Form.Item
                                    label="Autorisé par"
                                    name="autorise_par"
                                    rules={[{ required: true, message: 'Veuillez saisir le nom des chefs ayant validé' }]}
                                >
                                    { loadingData ? <Skeleton.Input active={true} /> : 
                                    <Input  placeholder="Saisir..." style={{width:'100%'}}/>
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

export default RetourExceptionnelle;