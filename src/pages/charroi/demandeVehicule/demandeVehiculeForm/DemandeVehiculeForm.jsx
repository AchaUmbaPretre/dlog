import { useEffect, useState } from 'react'
import { Form, Row, Card, Modal, Col, message, Input, notification, Skeleton, Select, Button, DatePicker } from 'antd';
import { getDemandeVehiculeOne, getDestination, getMotif, getServiceDemandeur, getTypeVehicule, postDemandeVehicule, putDemandeVehicule } from '../../../../services/charroiService';
import { getClient } from '../../../../services/clientService';
import { getLocalisation } from '../../../../services/transporteurService';
import { getUser } from '../../../../services/userService';
import { SendOutlined, PlusOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import moment from 'moment';
import DestinationForm from '../destination/destinationForm/DestinationForm';

const DemandeVehiculeForm = ({closeModal, fetchData, demandeId}) => {
    const [form] = Form.useForm();
    const [ loading, setLoading ] = useState(false);
    const [ loadingData, setLoadingData ] = useState(false);
    const [ motif, setMotif ] = useState([]);
    const [ type, setType ] = useState([]);
    const [ service, setService ] = useState([]);
    const [ client, setClient ] = useState([]);
    const [ local, setLocal ] = useState([]);
    const [ user, setUser ] = useState([]);
    const [ destination, setDestination ] = useState([]);
    const userId = useSelector((state) => state.user?.currentUser?.id_utilisateur);
    const [modalType, setModalType] = useState(null);

    const fetchDatas = async () => {
        try {
            const [ serviceData, typeData, motifData, clientData, localData, userData, destinationData ] = await Promise.all([
                getServiceDemandeur(),
                getTypeVehicule(),
                getMotif(),
                getClient(),
                getLocalisation(),
                getUser(),
                getDestination()
            ]) 
            setService(serviceData.data);
            setType(typeData.data);
            setMotif(motifData.data);
            setClient(clientData.data);
            setLocal(localData.data);
            setUser(userData.data);
            setDestination(destinationData.data)

            if (demandeId) {
                const { data : d} = await getDemandeVehiculeOne(demandeId);
                form.setFieldsValue({
                    date_chargement : moment(d[0].date_chargement),
                    date_prevue : moment(d[0].date_prevue),
                    date_retour : moment(d[0].date_retour),
                    id_type_vehicule : d[0].id_type_vehicule,
                    id_motif_demande: d[0].id_motif_demande,
                    id_demandeur: d[0].id_demandeur,
                    id_client : d[0].id_client,
                    id_localisation : d[0].id_localisation,
                    id_utilisateur: d.map((item) => item.id_utilisateur)
                });
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoadingData(false);
        }
    }

    useEffect(()=> {
        fetchDatas();
    }, [])

    const closeAllModals = () => {
        setModalType(null);
    };
      
    const openModal = (type) => {
        closeAllModals();
        setModalType(type);
    };

    const handleDestination = () => openModal('Destination')

  const onFinish = async (values) => {
    await form.validateFields();
        
    const loadingKey = 'loadingDemandeVehicule';
    message.loading({ content: 'Traitement en cours, veuillez patienter...', key: loadingKey, duration: 0 });
        
    setLoading(true); 

    try {

        if(demandeId) {
            const v = {
                ...values,
                user_cr : userId
            }
            await putDemandeVehicule(demandeId, v)
            message.success({ content: 'La demande a été modifiée avec succès.', key: loadingKey });

        } else{

            const v = {
                ...values,
                user_cr : userId
            }
            await postDemandeVehicule(v);
            message.success({ content: 'La demande a été envoyée avec succès.', key: loadingKey });

        }

        form.resetFields();
        fetchData();
        closeModal();
    } catch (error) {
      notification.error({
        message: 'Erreur',
        description: 'Erreur lors de l\'enregistrement de demande.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
        <div className="controle_form">
            <div className="controle_title_rows">
                <div className="controle_h2">{demandeId ? 'Modifier la demande' : 'Formulaire de demande'}</div>
            </div>
            <div className="controle_wrapper">
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                >
                    <Card>
                        <Row gutter={12}>
                            <Col xs={24} md={8}>
                                <Form.Item
                                    label="Date & heurre de chargement"
                                    name="date_chargement"
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
                                    label="Date & heure de départ prévue"
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

                            <Col xs={24} md={8}>
                                <Form.Item
                                    label="Date & heure de retour prévue"
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
                                    label="Type de véhicule"
                                    name="id_type_vehicule"
                                    rules={[{ required: true, message: 'Veuillez sélectionner un type de vehicule' }]}
                                >
                                    { loadingData ? <Skeleton.Input active={true} /> : 
                                    <Select
                                        allowClear
                                        showSearch
                                        options={type?.map((item) => ({
                                            value: item.id_type_vehicule,
                                            label: `${item.nom_type_vehicule}`,
                                        }))}
                                        optionFilterProp="label"
                                        placeholder="Sélectionnez..."
                                    />
                                        }
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
                                    rules={[{ required: true, message: 'Veuillez sélectionner un client' }]}
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
                                    rules={[{ required: true, message: 'Veuillez sélectionner une destination.' }]}
                                >
                                    { loadingData ? <Skeleton.Input active={true} /> : 
                                    <Select
                                        allowClear
                                        showSearch
                                        options={destination?.map((item) => ({
                                            value: item.id_destination ,
                                            label: `${item.nom_destination}`,
                                        }))}
                                            optionFilterProp="label"
                                            placeholder="Sélectionnez..."
                                    />
                                    }
                                </Form.Item>
                                <Button 
                                    style={{ width:'19px', height:'19px' }}
                                    icon={<PlusOutlined style={{fontSize:'9px', margin:'0 auto'}} />}
                                    onClick={handleDestination}
                                >
                                </Button>
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
                        </Row>
                    </Card>
                    <Button type="primary" loading={loading} disabled={loading} htmlType="submit" icon={<SendOutlined />} style={{marginTop:'20px'}}>
                       { demandeId ? 'Modifier' : 'Soumettre'}
                    </Button>
                </Form>
            </div>
        </div>
        <Modal
            title=""
            visible={modalType === 'Destination'}
            onCancel={closeAllModals}
            footer={null}
            width={700}
            centered
        >
            <DestinationForm closeModal={() => setModalType(null)} fetchData={fetchDatas} />
        </Modal>
    </>
  )
}

export default DemandeVehiculeForm