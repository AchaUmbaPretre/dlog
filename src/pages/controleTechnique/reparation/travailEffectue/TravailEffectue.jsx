import React from 'react'
import { Card, Form, Skeleton, Select, DatePicker, notification, Input, Button, Col, Row, Divider, Table, Tag, InputNumber, message } from 'antd';
import { SendOutlined, PlusCircleOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { getEvaluation, getPiece, getStatutVehicule } from '../../../../services/charroiService';
import { getCat_inspection } from '../../../../services/batimentService';

const TravailEffectue = () => {
        const [form] = Form.useForm();
        const [evaluation, setEvaluation] = useState([]);
        const [tache, setTache] = useState([]);
        const [piece, setPiece] = useState([]);

        const fetchDatas = async() => {
            try {
                const [ tacheData, evalueData, pieceData, statutData] = await Promise.all([
                    getCat_inspection(),
                    getEvaluation(),
                    getPiece(),
                    getStatutVehicule(),
                ])
                    setTache(tacheData.data)
                    setEvaluation(evalueData.data)
                    setPiece(pieceData.data)
                    setStatut(statutData.data)
    
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoadingData(false);
            }
        }

        useEffect(() => {
            fetchDatas();
        }, [])

  return (
    <>
        <div className="travail_effectue">
            <div className="travail_effectue_wrapper">
                <Form
                    form={form}
                    name="validateOnly"
                    layout="vertical"
                    autoComplete="off"
                    className="custom-form"
                    onFinish={onFinish}
                >
                    <Row gutter={24}>
                        <Col xs={24} md={24}>
                            <Card style={{marginTop:'10px'}}>
                                <Form.Item
                                    name="id_evaluation"
                                    label="Evaluation"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Veuillez sélectionner une option.',
                                        },
                                    ]}
                                >
                                    <Select
                                        allowClear
                                        style={{width:'100%'}}
                                        showSearch
                                        options={evaluation.map((item) => ({
                                            value: item.id_evaluation,
                                            label: item.nom_evaluation,
                                        }))}
                                        placeholder="Sélectionnez une option..."
                                        optionFilterProp="label"
                                        onChange={setDataEvol}
                                    />
                                </Form.Item>
                            </Card>
                        </Col>
                    </Row>

                    <Card style={{margin:'10px 0'}}>
                        <Row key={key} gutter={12} align='small'>
                            <Col xs={24} md={8}>
                                <Form.Item
                                    {...restField}
                                    name="id_tache_rep"
                                    label='Tache'
                                    rules={[
                                        { required: true, message: 'Veuillez fournir une tache...' },
                                        ]}
                                >
                                    <Select
                                        allowClear
                                        showSearch
                                        options={tache.map((item) => ({
                                            value: item.id_cat_inspection,
                                            label: `${item.nom_cat_inspection}`,
                                        }))}
                                        placeholder="Sélectionnez une tache..."
                                        optionFilterProp="label"
                                    />
                                </Form.Item>
                            </Col>

                            <Col xs={24} md={7}>
                                <Form.Item
                                    name="id_piece"
                                    label='Piece'
                                    rules={[
                                        { required: false, message: 'Veuillez fournir une piece...' },
                                    ]}
                                >
                                    <Select
                                        allowClear
                                        showSearch
                                        options={piece.map((item) => ({
                                            value: item.id,
                                            label: `${item.nom}`,
                                        }))}
                                        placeholder="Sélectionnez une piece..."
                                        optionFilterProp="label"
                                    />
                                </Form.Item>
                            </Col> 
                            <Col xs={24} md={8}>
                                <Form.Item
                                    name="budget"
                                    label='Budget'
                                    rules={[
                                        { required: false, message: 'Veuillez fournir un budget...' },
                                    ]}
                                >
                                    <InputNumber min={0} placeholder="Saisir le budget..." style={{width:'100%'}}/>
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={24}>
                                <Form.Item
                                    name={[name, "commentaire" ]}
                                    label="Commentaire"
                                    rules={[
                                        {
                                            required: false,
                                            message: 'Veuillez fournir un commentaire...',
                                        }
                                    ]}
                                >
                                    <Input.TextArea placeholder="Saisir le commentaire..." style={{width:'100%', resize:'none', height:'70px'}}/>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Card>
                    <div style={{ marginTop: '20px' }}>
                        <Button size='large' type="primary" htmlType="submit" icon={<SendOutlined />} loading={loading} disabled={loading} >
                            Soumettre
                        </Button>
                    </div>
                </Form>
            </div>
        </div>
    </>
  )
}

export default TravailEffectue