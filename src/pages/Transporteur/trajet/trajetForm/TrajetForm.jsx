import React, { useEffect, useState } from 'react'
import { Form, Row, Divider, Card, Col, Upload, message, notification, InputNumber, Skeleton, Select, Button, Input, DatePicker } from 'antd';
import { getLocalisation, getModeTransport } from '../../../../services/transporteurService';


const TrajetForm = () => {
    const [form] = Form.useForm();
    const [ loading, setLoading ] = useState(false);
    const [ local, setLocal ] = useState([]);
    const [ loadingData, setLoadingData ] = useState(false);
    const [ mode, setMode ] = useState([]);

    const fetchData = async () => {
        try {
            const [locaData, modeData] = await Promise.all([
            getLocalisation(),
            getModeTransport()
        ])
        setLocal(locaData.data);
        setMode(modeData.data)
            
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoadingData(false);
        }

    }

    useEffect(()=> {
        fetchData();
    }, [])

    const onFinish = async(values) => {
        await form.validateFields();
        const loadingKey = 'loadingReparation';
        message.loading({ content: 'Traitement en cours, veuillez patienter...', key: loadingKey, duration: 0 });
        setLoading(true);
        try {
            
        } catch (error) {
            
        }  
    }

  return (
    <>
        <div className="controle_form">
            <div className="controle_title_rows">
                <div className="controle_h2">Enregistrer un trajet</div>
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
                                label="Départ"
                                name="id_depart"
                                rules={[{ required: true, message: 'Veuillez sélectionner un ' }]}
                            >
                                { loadingData ? <Skeleton.Input active={true} /> : 
                                <Select
                                    allowClear
                                    showSearch
                                    options={local?.map((item) => ({
                                            value: item.id_localisation,
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
                                label="Arrivée"
                                name="id_arrive"
                                rules={[{ required: true, message: 'Veuillez sélectionner un' }]}
                            >
                                { loadingData ? <Skeleton.Input active={true} /> : 
                                <Select
                                    allowClear
                                    showSearch
                                    options={local?.map((item) => ({
                                            value: item.id_localisation,
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
                                label="Mode"
                                name="id_mode"
                                rules={[{ required: false, message: 'Veuillez sélectionner un mode' }]}
                            >
                                { loadingData ? <Skeleton.Input active={true} /> : 
                                <Select
                                    allowClear
                                    showSearch
                                    options={mode?.map((item) => ({
                                            value: item.id_mode_transport,
                                            label: `${item.nom_mode}`,
                                    }))}
                                    optionFilterProp="label"
                                    placeholder="Sélectionnez..."
                                />
                                }
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={8}>
                            <Form.Item
                                label="Distance"
                                name="distance_km"
                                rules={[{ required: false, message: 'Veuillez entrer la distance' }]}
                            >
                                <InputNumber min={0} placeholder="Saisir la distance..." style={{width:'100%'}}/>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </div>
        </div>
    </>
  )
}

export default TrajetForm