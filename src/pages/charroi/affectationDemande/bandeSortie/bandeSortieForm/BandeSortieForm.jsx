import { useEffect, useState } from 'react'
import { Form, Row, Input, Card, Col, DatePicker, message, Skeleton, Select, Button } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import moment from 'moment';
import { getAffectationDemandeOne, getChauffeur, getDestination, getMotif, getServiceDemandeur, getTypeVehicule, getVehicule, postBandeSortie } from '../../../../../services/charroiService';
import { getClient } from '../../../../../services/clientService';
import { getLocalisation } from '../../../../../services/transporteurService';
import { useSelector } from 'react-redux';
import { getSociete } from '../../../../../services/userService';

const BandeSortieForm = ({closeModal, fetchData, affectationId}) => {
    const [form] = Form.useForm();
    const [ loading, setLoading ] = useState(false);
    const [ loadingData, setLoadingData ] = useState(false);
    const [ vehicule, setVehicule ] = useState([]);
    const [ chauffeur, setChauffeur ] = useState([]);
    const userId = useSelector((state) => state.user?.currentUser?.id_utilisateur);
    const [ type, setType ] = useState([]);
    const [ motif, setMotif ] = useState([]);
    const [ service, setService ] = useState([]);
    const [ client, setClient ] = useState([]);
    const [ destination, setDestination ] = useState([]);
    const [ societe, setSociete ] = useState([]);

        const fetchDatas = async() => {
            try {
                const [vehiculeData, chaufferData, serviceData, typeData, motifData, clientData, localData, societeData] = await Promise.all([
                    getVehicule(),
                    getChauffeur(),
                    getServiceDemandeur(),
                    getTypeVehicule(),
                    getMotif(),
                    getClient(),
                    getDestination(),
                    getSociete()
                ])
    
                setVehicule(vehiculeData.data.data)
                setChauffeur(chaufferData.data?.data)
                setService(serviceData.data);
                setType(typeData.data);
                setMotif(motifData.data);
                setClient(clientData.data);
                setDestination(localData.data);
                setSociete(societeData.data)
    
                 if(affectationId) {
                    const { data : d } = await getAffectationDemandeOne(affectationId);
                    form.setFieldsValue({
                        id_vehicule : d[0].id_vehicule,
                        id_chauffeur : d[0].id_chauffeur,
                        date_prevue : moment(d[0].date_prevue),
                        date_retour : moment(d[0].date_retour),
                        id_type_vehicule : d[0].id_type_vehicule,
                        id_motif_demande : d[0].id_motif_demande,
                        id_demandeur : d[0].id_demandeur,
                        id_client : d[0].id_client,
                        id_localisation : d[0].id_localisation,
                        personne_bord : d[0].personne_bord
                    })
                }
                
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoadingData(false);
            }
        }
    
        useEffect(()=> {
            fetchDatas();
        }, [affectationId]);


    const onFinish = async (values) => {
        await form.validateFields();
        
        const loadingKey = 'loadingAffectation';
            message.loading({ content: 'Traitement en cours, veuillez patienter...', key: loadingKey, duration: 0 });
            setLoading(true);
        
                try {
                    await postBandeSortie({
                        ...values,
                        id_affectation_demande : affectationId,
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
                <div className="controle_h2">Form de bon de sortie</div>
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

                            <Col xs={24} md={6}>
                                <Form.Item
                                    label="Départ prévue"
                                    name="date_prevue"
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
                            
                            <Col xs={24} md={6}>
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
                            
                            <Col xs={24} md={8}>
                                <Form.Item
                                    label="Motif"
                                    name="id_motif_demande"
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
                                    <Input  placeholder="Saisir..." style={{width:'100%'}}/>
                                    }
                                </Form.Item>
                            </Col>

                            <Col xs={24} md={8}>
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

export default BandeSortieForm