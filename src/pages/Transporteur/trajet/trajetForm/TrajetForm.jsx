import { useEffect, useState } from 'react'
import { Form, Row, Divider, Card, Col, message, notification, InputNumber, Skeleton, Select, Button, Input, DatePicker } from 'antd';
import { getLocalisation, getModeTransport, getTransporteur, getTypeTarif } from '../../../../services/transporteurService';
import { SendOutlined } from '@ant-design/icons';


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
                                label="Type tarif"
                                name="type tarif"
                                rules={[{ required: false, message: 'Veuillez sélectionner un type' }]}
                            >
                                { loadingData ? <Skeleton.Input active={true} /> : 
                                <Select
                                    allowClear
                                    showSearch
                                    options={tarif?.map((item) => ({
                                        value: item.id_type_tarif,
                                        label: `${item.nom_type_tarif}`,
                                    }))}
                                    optionFilterProp="label"
                                    placeholder="Sélectionnez..."
                                />
                                }
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={8}>
                            <Form.Item
                                label="Transporteur"
                                name="id_transporteur"
                            >
                                { loadingData ? <Skeleton.Input active={true} /> : 
                                <Select
                                    allowClear
                                    showSearch
                                    options={trans?.map((item) => ({
                                        value: item.id_transporteur ,
                                        label: `${item.nom_transporteur}`,
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

                        <Col xs={24} md={8}>
                            <Form.Item
                                label="Poids réel"
                                name="poids_reel"
                            >
                                <InputNumber min={0} placeholder="ex: 100" style={{width:'100%'}}/>
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={8}>
                            <Form.Item
                                label="Poids volume"
                                name="poids_volume"
                            >
                                <InputNumber min={0} placeholder="ex: 100" style={{width:'100%'}}/>
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={8}>
                            <Form.Item
                                label="Poids facture"
                                name="poids_facture"
                            >
                                <InputNumber min={0} placeholder="ex: 150" style={{width:'100%'}}/>
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={8}>
                            <Form.Item
                                label="Cout principal"
                                name="cout_principal"
                            >
                                <InputNumber min={0} placeholder="ex: 100$" style={{width:'100%'}}/>
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={8}>
                            <Form.Item
                                label="Manutention départ"
                                name="manutention_depart"
                            >
                                <InputNumber min={0} placeholder="ex: 150" style={{width:'100%'}}/>
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={8}>
                            <Form.Item
                                label="Manutention arrivée"
                                name="manutention_arrivee	"
                                rules={[{ required: false, message: 'Veuillez fournir la manutention arrivée' }]}
                            >
                                <InputNumber min={0} placeholder=" ex: 200$" style={{width:'100%'}}/>
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={8}>
                            <Form.Item
                                label="Livraison locale"
                                name="livraison_locale"
                            >
                                <InputNumber min={0} placeholder="ex: 150" style={{width:'100%'}}/>
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={8}>
                            <Form.Item
                                label="Frais"
                                name="frais"
                            >
                                <InputNumber min={0} placeholder="ex: 90" style={{width:'100%'}}/>
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={8}>
                            <Form.Item
                                label="Total"
                                name="total"
                            >
                                <InputNumber min={0} placeholder="ex: 100" style={{width:'100%'}}/>
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={8}>
                            <Form.Item
                                label="Délai prévu"
                                name="delai_prevu"
                            >
                                <InputNumber min={0} placeholder="ex: 5 jours" style={{width:'100%'}}/>
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={8}>
                            <Form.Item
                                label="Délai réel"
                                name="delai_reel"
                            >
                                <InputNumber min={0} placeholder="ex: 4jours" style={{width:'100%'}}/>
                            </Form.Item>
                        </Col>

                    </Row>
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