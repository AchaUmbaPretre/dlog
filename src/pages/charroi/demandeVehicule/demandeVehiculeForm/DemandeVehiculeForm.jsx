import React, { useEffect, useState } from 'react'
import { Form, Row, Divider, Card, Col, message, notification, InputNumber, Skeleton, Select, Button, Input, DatePicker } from 'antd';
import { getMotif, getServiceDemandeur, getTypeVehicule, postDemandeVehicule } from '../../../../services/charroiService';
import { getClient } from '../../../../services/clientService';
import { getLocalisation } from '../../../../services/transporteurService';
import { getUser } from '../../../../services/userService';
import { SendOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';

const DemandeVehiculeForm = ({closeModal}) => {
    const [form] = Form.useForm();
    const [ loading, setLoading ] = useState(false);
    const [ loadingData, setLoadingData ] = useState(false);
    const [ motif, setMotif ] = useState([]);
    const [ type, setType ] = useState([]);
    const [ service, setService ] = useState([]);
    const [ client, setClient ] = useState([]);
    const [ local, setLocal ] = useState([]);
    const [ user, setUser ] = useState([]);
    const userId = useSelector((state) => state.user?.currentUser?.id_utilisateur);


    const fetchData = async () => {
        try {
            const [ serviceData, typeData, motifData, clientData, localData, userData ] = await Promise.all([
                getServiceDemandeur(),
                getTypeVehicule(),
                getMotif(),
                getClient(),
                getLocalisation(),
                getUser()
            ]) 
            setService(serviceData.data);
            setType(typeData.data);
            setMotif(motifData.data);
            setClient(clientData.data);
            setLocal(localData.data);
            setUser(userData.data)

        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoadingData(false);
        }
    }

    useEffect(()=> {
        fetchData();
    }, [])

  const onFinish = async (values) => {
    await form.validateFields();
        
    const loadingKey = 'loadingDemandeVehicule';
    message.loading({ content: 'Traitement en cours, veuillez patienter...', key: loadingKey, duration: 0 });
        
    setLoading(true); 

    try {
        const v = {
            ...values,
            user_cr : userId
        }
        await postDemandeVehicule(v);
        message.success({ content: 'La demande a été envoyée avec succès.', key: loadingKey });

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
                <div className="controle_h2">Formulaire de demande</div>
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

                            <Col xs={24} md={8}>
                                <Form.Item
                                    label="Date & heure de départ prévue"
                                    name="date_prevue"
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

                            <Col xs={24} md={8}>
                                <Form.Item
                                    label="Date & heurre de retour prévue"
                                    name="date_retour"
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
                                    name="id_localisation"
                                    rules={[{ required: true, message: 'Veuillez sélectionner une localisation.' }]}
                                >
                                    { loadingData ? <Skeleton.Input active={true} /> : 
                                    <Select
                                        allowClear
                                        showSearch
                                        options={local?.map((item) => ({
                                            value: item.id_localisation ,
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
                                    label="Personne(s) qui sort(ent) avec le véhicule"
                                    name="id_utilisateur"
                                    rules={[{ required: true, message: 'Veuillez sélectionner au moins une personne.' }]}
                                >
                                    { loadingData ? <Skeleton.Input active={true} /> : 
                                    <Select
                                        allowClear
                                        showSearch
                                        mode="multiple"
                                        options={user?.map((item) => ({
                                            value: item.id_utilisateur,
                                            label: `${item.nom} - ${item.prenom ?? ''}`,
                                        }))}
                                        optionFilterProp="label"
                                        placeholder="Sélectionnez..."
                                    />
                                    }
                                </Form.Item>
                            </Col>
                        </Row>
                    </Card>
                    <Button type="primary" size='large' loading={loading} disabled={loading} htmlType="submit" icon={<SendOutlined />} style={{marginTop:'20px'}}>
                        Soumettre
                    </Button>
                </Form>
            </div>
        </div>
    </>
  )
}

export default DemandeVehiculeForm