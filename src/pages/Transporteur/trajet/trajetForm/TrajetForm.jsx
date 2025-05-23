import { useEffect, useState } from 'react'
import { Form, Row, Divider, Card, Col, message, notification, InputNumber, Skeleton, Select, Button, Input, DatePicker } from 'antd';
import { getLocalisation, getModeTransport, getTransporteur, getTypeTarif } from '../../../../services/transporteurService';
import { SendOutlined, PlusCircleOutlined, MinusCircleOutlined } from '@ant-design/icons';


const TrajetForm = () => {
    const [form] = Form.useForm();
    const [ loading, setLoading ] = useState(false);
    const [ local, setLocal ] = useState([]);
    const [ loadingData, setLoadingData ] = useState(false);
    const [ mode, setMode ] = useState([]);
    const [ tarif, setTarif ] = useState([]);
    const [ trans, setTrans ] = useState([]);

    const fetchData = async () => {
        try {
            const [locaData, modeData, typeData, transData] = await Promise.all([
            getLocalisation(),
            getModeTransport(),
            getTypeTarif(),
            getTransporteur()
        ])
        setLocal(locaData.data);
        setMode(modeData.data);
        setTarif(typeData.data);
        setTrans(transData.data)
            
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
                    variant={'filled'}
                    onFinish={onFinish}
                >
                    <Card size="small" type="inner" title='Principaux'>
                        <Row gutter={12}>
                            <Col xs={24} md={12}>
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
                            <Col xs={24} md={12}>
                                <Form.Item
                                    label="Destination"
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
                        </Row>
                    </Card>
                    <Form.List name="segment">
                        {(fields, { add, remove }) => (
                            <>
                            <Divider orientation="left" plain>Le(s) segment(s)</Divider>
                            {fields.map(({ key, name, ...restField }) => (
                                <Card style={{marginBottom:'10px'}}>
                                    <Row key={key} gutter={12} align="middle">
                                        <Col xs={24} md={6}>
                                            <Form.Item
                                                {...restField}
                                                name={[name, 'ordre']}
                                                label="ordre"
                                                rules={[
                                                    { required: true, message: 'Veuillez fournir un numero...' },
                                                ]}
                                            >
                                                <InputNumber min={0} placeholder="Saisir le budget..." style={{width:'100%'}}/>
                                            </Form.Item>
                                        </Col>

                                        <Col xs={24} md={6}>
                                            <Form.Item
                                                label="Départ"
                                                {...restField}
                                                name={[name, "id_depart"]}
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
                                        
                                        <Col xs={24} md={6}>
                                            <Form.Item
                                                label="Destination"
                                                {...restField}
                                                name={[name, "id_arrive"]}
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

                                        <Col xs={24} md={6}>
                                            <Form.Item
                                                label="Date départ"
                                                {...restField}
                                                name={[name, "date_depart"]}
                                                rules={[{ required: true, message: 'Veuillez sélectionner un' }]}
                                            >
                                                <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
                                            </Form.Item>
                                        </Col>

                                        <Col xs={24} md={6}>
                                            <Form.Item
                                                label="Date arrivée"
                                                {...restField}
                                                name={[name, "date_arrivee"]}
                                                rules={[{ required: true, message: 'Veuillez sélectionner un' }]}
                                            >
                                                <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
                                            </Form.Item>
                                        </Col>

                                        <Col xs={24} md={6}>
                                            <Form.Item
                                                label="Distance Km"
                                                {...restField}
                                                name={[name, "distance_km"]}
                                            >
                                                <InputNumber min={0} placeholder="Saisir..." style={{width:'100%'}}/>
                                            </Form.Item>
                                        </Col>

                                        <Col xs={24} md={6}>
                                            <Form.Item
                                                label="Mode transport"
                                                {...restField}
                                                name={[name, "mode_transport"]}
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

                                        <Col xs={24} md={6}>
                                            <Form.Item
                                                label="Prix"
                                                {...restField}
                                                name={[name, "prix"]}
                                            >
                                                { loadingData ? <Skeleton.Input active={true} /> : 
                                                    <InputNumber min={0} placeholder="ex : 100$..." style={{width:'100%'}}/>
                                                }
                                            </Form.Item>
                                        </Col>

                                                                            <Col xs={24} md={2}>
                                        <Button
                                            type="text"
                                            danger
                                            icon={<MinusCircleOutlined />}
                                            onClick={() => {
                                                remove(name);
                                            }}
                                        >
                                        </Button>
                                    </Col>
                                    </Row>
                                </Card>
                            ))}
                                <Form.Item>
                                    <Button
                                        type="dashed"
                                        onClick={() => add()}
                                        icon={<PlusCircleOutlined />}
                                        style={{ width: '100%' }}
                                    >
                                       Ajouter un segment
                                    </Button>
                                </Form.Item>
                            </>
                        )}
                    </Form.List>
                    <Button type="primary" size='large' htmlType="submit" icon={<SendOutlined />}>
                        Soumettre
                    </Button>
                </Form>
            </div>
        </div>
    </>
  )
}

export default TrajetForm