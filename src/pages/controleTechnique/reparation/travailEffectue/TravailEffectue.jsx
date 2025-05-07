import React, { useEffect, useState } from 'react';
import { Card, Form, Select, Input, Button, Col, Row, Skeleton, Table, Tag, InputNumber, message } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import { getEvaluation, getPiece, getSuiviReparationOne, putSuiviReparation } from '../../../../services/charroiService';
import { getCat_inspection } from '../../../../services/batimentService';
import './travailEffectue.scss'

const TravailEffectue = ({idReparations, closeModal, fetchData}) => {
        const [form] = Form.useForm();
        const [evaluation, setEvaluation] = useState([]);
        const [tache, setTache] = useState([]);
        const [piece, setPiece] = useState([]);
        const [loadingData, setLoadingData] = useState(true);
        const [loading, setLoading] = useState(false);
        const [data, setData] = useState([]);
        const [idSuivi, setIdSuivi] = useState(null);
        const [idEvaluation, setIdEvaluation] = useState(null)

        const fetchDatas = async() => {
            try {
                const [ tacheData, evalueData, pieceData] = await Promise.all([
                    getCat_inspection(),
                    getEvaluation(),
                    getPiece()
                ])
                    setTache(tacheData.data)
                    setEvaluation(evalueData.data)
                    setPiece(pieceData.data)

                if(idReparations) {
                    const  { data : d } = await getSuiviReparationOne(idReparations);
                    setData(d)
                    form.setFieldsValue({
                        id_evaluation : d[0].id_evaluation,
                        id_tache_rep: d[0].id_tache_rep,
                        id_piece: d[0].id_piece,
                        budget: d[0].budget,
                        commentaire: d[0].commentaire
                    })

                    setIdSuivi(d[0].id_suivi_reparation)
                }
    
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoadingData(false);
            }
        }

        useEffect(() => {
            fetchDatas();
        }, [idReparations])

        const onFinish = async (values) => {
            try {
                await form.validateFields();

                const val = {
                    ...values,
                    id_evaluation : idEvaluation,
                    id_sud_reparation: idReparations
                }
        
                const loadingKey = 'loadingReparation';
                message.loading({
                    content: 'Traitement en cours, veuillez patienter...',
                    key: loadingKey,
                    duration: 0
                });
        
                setLoading(true);
        
                await putSuiviReparation(idSuivi, val);
        
                message.success({
                    content: 'La réparation a été enregistrée avec succès.',
                    key: loadingKey
                });
        
                form.resetFields();
                fetchData();
                closeModal();
        
            } catch (error) {
                console.error('Erreur lors de l’enregistrement :', error);
                message.error({
                    content: "Une erreur s'est produite lors de l'enregistrement.",
                    key: 'loadingReparation'
                });
            } finally {
                setLoading(false);
            }
        };
        

  return (
    <>
        <div className="travail_effectue">
            <div className="reparation_detail_title">
            <Skeleton
                active
                paragraph={false}
                title={{ width: '80%' }}
                loading={!data[0]}
            >
                <h1 className="reparation_detail_h1">
                METTRE A JOUR TRAVAIL EFFECTUE DU VEHICULE {data[0]?.immatriculation} / MARQUE {data[0]?.nom_marque.toUpperCase()}
                </h1>
            </Skeleton>
            </div>
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
                                    { loadingData ? <Skeleton.Input active={true} /> :
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
                                        onChange={setIdEvaluation}
                                    />
                                    }
                                </Form.Item>
                            </Card>
                        </Col>
                    </Row>

                    <Card style={{margin:'10px 0'}}>
                        <Row gutter={12} align='small'>
                            <Col xs={24} md={8}>
                                <Form.Item
                                    name="id_tache_rep"
                                    label='Tache'
                                    rules={[
                                        { required: true, message: 'Veuillez fournir une tache...' },
                                        ]}
                                >
                                    { loadingData ? <Skeleton.Input active={true} /> : 
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
                                     }
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
                                    { loadingData ? <Skeleton.Input active={true} /> :
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
                                     }
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
                                    name="commentaire"
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