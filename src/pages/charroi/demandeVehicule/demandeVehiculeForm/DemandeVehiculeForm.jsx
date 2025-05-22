import React, { useEffect, useState } from 'react'
import { Form, Row, Divider, Card, Col, message, notification, InputNumber, Skeleton, Select, Button, Input, DatePicker } from 'antd';
import { getMotif, getServiceDemandeur, getTypeVehicule } from '../../../../services/charroiService';


const DemandeVehiculeForm = () => {
    const [form] = Form.useForm();
    const [ loading, setLoading ] = useState(false);
    const [ loadingData, setLoadingData ] = useState(false);
    const [ motif, setMotif ] = useState([]);
    const [ type, setType ] = useState([]);
    const [ service, setService ] = useState([]);


    const fetchData = async () => {
        try {
            const [ serviceData, typeData, motifData ] = await Promise.all([
                getServiceDemandeur(),
                getTypeVehicule(),
                getMotif()
            ]) 
            setService(serviceData.data);
            setType(typeData.data);
            setMotif(motifData.data);

        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoadingData(false);
        }
    }

    useEffect(()=> {
        fetchData();
    }, [])

    const onFinish = async () => {

    }

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
                                name="date_preuve"
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

                    </Row>
                </Form>
            </div>
        </div>
    </>
  )
}

export default DemandeVehiculeForm