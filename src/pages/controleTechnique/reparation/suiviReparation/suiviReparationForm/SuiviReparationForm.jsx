import React, { useEffect, useState } from 'react';
import './suiviReparationForm.scss'
import { Card, Form, Skeleton, Select, DatePicker, notification, Input, Button, Col, Row, Divider, Table, Tag, InputNumber, message } from 'antd';
import moment from 'moment';
import { SendOutlined, ToolOutlined, CalendarOutlined,DollarOutlined, PlusCircleOutlined, MinusCircleOutlined } from '@ant-design/icons';
import {  getEvaluation, getPiece, getReparationOneV, getTypeReparation, postReclamation, postSuiviReparation } from '../../../../../services/charroiService';
import { getCat_inspection } from '../../../../../services/batimentService';
import { useSelector } from 'react-redux';
import { evaluationStatusMap } from '../../../../../utils/prioriteIcons';
import { useMenu } from '../../../../../context/MenuProvider';

const SuiviReparationForm = ({idReparations, closeModal, fetchData}) => {
    const [form] = Form.useForm();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 20,
    });
    const [evaluation, setEvaluation] = useState([]);
    const [tache, setTache] = useState([]);
    const [piece, setPiece] = useState([]);
    const [iDpiece, setIdPiece] = useState(null);
    const [marque, setMarque] = useState(null);
    const [matricule, setMatricule] = useState(null);
    const [loadingData, setLoadingData] = useState(true);
    const [num, setNum] = useState(null);
    const [dataEvol, setDataEvol] = useState(1)
    const userId = useSelector((state) => state.user?.currentUser?.id_utilisateur);
    const [reparation, setReparation] = useState([]);
    const {fetchDataInsp} = useMenu();
    
    useEffect(() => {
        const info = form.getFieldValue('info');
        if (!info || info.length === 0) {
          form.setFieldsValue({ info: [{}] }); 
        }
    }, [form]);

    const fetchDatas = async() => {
        try {
            const [ tacheData, evalueData, pieceData, reparationData] = await Promise.all([
                getCat_inspection(),
                getEvaluation(),
                getPiece(),
                getTypeReparation()
            ])
                setTache(tacheData.data)
                setEvaluation(evalueData.data)
                setPiece(pieceData.data)
                setReparation(reparationData.data.data)
    
            if(idReparations) {
                const { data : d } = await getReparationOneV(idReparations)
                setData(d)
                setMarque(d[0]?.nom_marque)
                setMatricule(d[0]?.immatriculation)
                setNum(d[0]?.id_sud_reparation)
            }

        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoadingData(false);
        }
    }

    useEffect(() => {
        fetchDatas();
    }, [idReparations, iDpiece])
      
    const columns = [
        {
          title: '#',
          dataIndex: 'id',
          key: 'id',
          render: (text, record, index) => {
            const pageSize = pagination.pageSize || 10;
            const pageIndex = pagination.current || 1;
            return (pageIndex - 1) * pageSize + index + 1;
          },
          width: "4%"
        },
        {
          title: <><ToolOutlined /> Type de rep</>,
          dataIndex: 'type_rep',
          key: 'type_rep',
          render: (text) => <Tag color="blue">{text}</Tag>
        },
        {
          title: <><CalendarOutlined /> Date début</>,
          dataIndex: 'date_entree',
          key: 'date_entree',
          render: (text) =>
            <Tag color='purple'>{moment(text).format('LL')}</Tag>
        },
        {
            title: <><CalendarOutlined /> Date fin</>,
            dataIndex: 'date_sortie',
            key: 'date_sortie',
            render: (text) => {
              if (!text || !moment(text).isValid()) {
                return <Tag color="default">Aucune date</Tag>;
              }
              return <Tag color='purple'>{moment(text).format('LL')}</Tag>;
            }
        },          
        {
            title: 'Statut', 
            dataIndex: 'nom_evaluation', 
            key: 'nom_evaluation',
            render: (text) => {
              if (!text) {
                return <Tag color="default">Aucun statut</Tag>;
              }
              const { color, icon } = evaluationStatusMap[text] || { color: 'default' };
              return <Tag icon={icon} color={color}>{text}</Tag>;
            }
        },  
        {
          title: <><DollarOutlined /> Budget</>,
          dataIndex: 'cout',
          key: 'cout',
          render: (text) => <Tag color="green">{text} $</Tag>
        }
      ];      

      const onFinish = async (values) => {
        const loadingKey = 'loadingReparation';
        message.loading({ content: 'Traitement en cours, veuillez patienter...', key: loadingKey, duration: 0 });
    
        setLoading(true);
    
        try {
            if (dataEvol !== 1) {
                await postReclamation({
                    ...values,
                    id_sud_reparation: idReparations,
                    user_cr: userId,
                });
                message.success({ content: 'La réclamation a été enregistrée avec succès.', key: loadingKey });
            } else {
                await postSuiviReparation({
                    ...values,
                    id_sud_reparation: idReparations,
                    user_cr: userId,
                });
                message.success({ content: 'Suivi réparation enregistré avec succès.', key: loadingKey });
            }
    
            form.resetFields();
            fetchData(); 
            fetchDataInsp();
            closeModal();
    
        } catch (error) {
            console.error("Erreur lors de l'ajout de la réparation:", error);
            message.error({ content: 'Une erreur est survenue.', key: loadingKey });
            const errorMsg = error?.response?.data?.error || 'Erreur inconnue. Veuillez réessayer plus tard.';
            notification.error({
                message: 'Erreur',
                description: errorMsg,
            });
    
        } finally {
            setLoading(false);
        }
    }
    
    
  return (
    <>
        <div className="suivi_reparation_form">
            <div className="reparation_detail_title">
                <h1 className="reparation_detail_h1">SUIVI INTERVENTION BON N° {num}: VEHECULE {marque?.toUpperCase()} {matricule}</h1>
            </div>
            <Card className="suivi_reparation_wrapper">
                <Divider style={{ borderColor: 'rgba(0, 123, 255, 0.137)' }}>INFORMATIONS GENERALES</Divider>
                <Card>
                    <div className="reparation_detail_top">
                        <Skeleton loading={loading} active paragraph={false}>
                            <Table
                                columns={columns}
                                dataSource={data}
                                onChange={(pagination) => setPagination(pagination)}
                                pagination={pagination}
                                rowKey="id"
                                bordered
                                loading={loadingData}
                                size="small"
                                rowClassName={(record, index) => (index % 2 === 0 ? 'odd-row' : 'even-row')}
                            />
                        </Skeleton>
                    </div>
                </Card>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    autoComplete="off"
                    className="custom-form"
                >
                    <Row gutter={24}>
                        <Col span={24}>
                            <Card style={{ marginTop: 10 }}>
                                <Form.Item
                                    name="id_evaluation"
                                    label="Évaluation"
                                    rules={[{ required: true, message: 'Veuillez sélectionner une option.' }]}
                                >
                                    <Select
                                        allowClear
                                        showSearch
                                        placeholder="Sélectionnez une option..."
                                        optionFilterProp="label"
                                        onChange={setDataEvol}
                                        options={evaluation.map((item) => {
                                            const status = evaluationStatusMap[item.nom_evaluation] || {};
                                            return {
                                            value: item.id_evaluation,
                                            label: (
                                                <div style={{ margin: 0, color: status.color }}>
                                                {item.nom_evaluation}
                                                </div>
                                            ),
                                            };
                                        })}
                                    />
                                </Form.Item>
                            </Card>
                        </Col>
                    </Row>

                    {dataEvol === 1 && (
                        <Form.List name="info">
                            {(fields, { add, remove }) => (
                                <>
                                    {fields.map(({ key, name, ...restField }) => (
                                        <Card key={key} style={{ margin: '10px 0' }}>
                                            <Row gutter={12}>
                                                <Col xs={24} md={8}>
                                                    <Form.Item
                                                        {...restField}
                                                        name={[name, "id_tache_rep"]}
                                                        label="Tâche"
                                                        rules={[{ required: true, message: 'Veuillez fournir une tâche.' }]}
                                                    >
                                                        <Select
                                                            allowClear
                                                            showSearch
                                                            placeholder="Sélectionnez une tâche..."
                                                            optionFilterProp="label"
                                                            options={tache.map((item) => ({
                                                                value: item.id_cat_inspection,
                                                                label: item.nom_cat_inspection,
                                                            }))}
                                                            onChange={setIdPiece}
                                                        />
                                                    </Form.Item>
                                                </Col>

                                                <Col xs={24} md={7}>
                                                    <Form.Item
                                                        {...restField}
                                                        name={[name, "id_piece"]}
                                                        label="Pièce"
                                                    >
                                                        <Select
                                                            allowClear
                                                            showSearch
                                                            placeholder="Sélectionnez une pièce..."
                                                            optionFilterProp="label"
                                                            options={piece.map((item) => ({
                                                                value: item.id,
                                                                label: item.nom,
                                                            }))}
                                                        />
                                                    </Form.Item>
                                                </Col>

                                                <Col xs={24} md={8}>
                                                    <Form.Item
                                                        {...restField}
                                                        name={[name, "budget"]}
                                                        label="Budget"
                                                    >
                                                        <InputNumber min={0} placeholder="Saisir le budget..." style={{ width: '100%' }} />
                                                    </Form.Item>
                                                </Col>

                                                <Col xs={24}>
                                                    <Form.Item
                                                        {...restField}
                                                        name={[name, "commentaire"]}
                                                        label="Commentaire"
                                                    >
                                                        <Input.TextArea placeholder="Saisir un commentaire..." style={{ width: '100%', resize: 'none', height: '70px' }} />
                                                    </Form.Item>
                                                </Col>

                                                <Col>
                                                    <Button type="text" danger icon={<MinusCircleOutlined />} onClick={() => remove(name)} />
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
                                            Ajouter
                                        </Button>
                                    </Form.Item>

                                    <div style={{ marginTop: '20px' }}>
                                        <Button size="large" type="primary" htmlType="submit" icon={<SendOutlined />} loading={loading}>
                                            Soumettre
                                        </Button>
                                    </div>
                                </>
                            )}
                        </Form.List>
                    )}

                    {dataEvol !== 1 && (
                        <Card style={{ marginTop: 10 }}>
                            <Row gutter={12}>
                                <Col xs={24} md={12}>
                                    <Form.Item name="intitule" label="Intitulé">
                                        <Input placeholder="Saisir le titre..." />
                                    </Form.Item>
                                </Col>

                                <Col xs={24} md={12}>
                                    <Form.Item
                                        name="date_debut"
                                        label="Date début"
                                        rules={[{ required: true, message: 'Veuillez fournir une date.' }]}
                                        initialValue={moment()}
                                    >
                                        <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
                                    </Form.Item>
                                </Col>

                                <Col xs={24} md={12}>
                                    <Form.Item
                                        name="date_fin"
                                        label="Date fin"
                                        rules={[{ required: false, message: 'Veuillez fournir une date.' }]}
                                        initialValue={moment()}
                                    >
                                        <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
                                    </Form.Item>
                                </Col>

                                <Col xs={12}>
                                    <Form.Item
                                        name="montant"
                                        label="Coût"
                                        rules={[{ required: true, message: 'Veuillez fournir un coût.' }]}
                                    >
                                        <InputNumber min={0} placeholder="Saisir le coût..." style={{ width: '100%' }} />
                                    </Form.Item>
                                </Col>

                                <Col xs={24} md={12}>
                                    <Form.Item name="description" label="Description">
                                        <Input.TextArea placeholder="Saisir la description..." style={{ width: '100%', resize: 'none', height: '40px' }} />
                                    </Form.Item>
                                </Col>

                                <Col xs={24} md={12}>
                                    <Form.Item name="raison_fin" label="Motif">
                                        <Input.TextArea placeholder="Saisir le motif..." style={{ width: '100%', resize: 'none', height: '40px' }} />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Form.List name="sub_reclamation">
                                {(fields, { add, remove }) => (
                                    <>
                                        <Divider className="title_row">Réclamer</Divider>
                                        {fields.map(({ key, name, ...restField }) => (
                                            <Row key={key} gutter={12} align="middle">
                                                <Col xs={24} md={7}>
                                                    <Form.Item
                                                        {...restField}
                                                        name={[name, 'id_type_reparation']}
                                                        label="Type de réparation"
                                                        rules={[{ required: true, message: 'Veuillez fournir une réparation.' }]}
                                                    >
                                                        <Select
                                                            allowClear
                                                            showSearch
                                                            placeholder="Sélectionnez un type de réparation..."
                                                            optionFilterProp="label"
                                                            options={reparation.map((item) => ({
                                                                value: item.id_type_reparation,
                                                                label: item.type_rep,
                                                            }))}
                                                        />
                                                    </Form.Item>
                                                </Col>

                                                <Col xs={24} md={7}>
                                                    <Form.Item
                                                        {...restField}
                                                        name={[name, 'cout']}
                                                        label="Cout"
                                                    >
                                                        <InputNumber min={0} placeholder="Saisir le montant..." style={{ width: '100%' }} />
                                                    </Form.Item>
                                                </Col>

                                                <Col xs={24} md={8}>
                                                    <Form.Item
                                                        {...restField}
                                                        name={[name, 'description']}
                                                        label="Description"
                                                        rules={[{ required: true, message: 'Veuillez fournir une description.' }]}
                                                    >
                                                        <Input.TextArea placeholder="Saisir la description" style={{ width: '100%', resize: 'none' }} />
                                                    </Form.Item>
                                                </Col>

                                                <Col xs={24} md={2}>
                                                    <Button type="text" danger icon={<MinusCircleOutlined />} onClick={() => remove(name)} />
                                                </Col>
                                            </Row>
                                        ))}

                                        <Form.Item>
                                            <Button
                                                type="dashed"
                                                onClick={() => add()}
                                                icon={<PlusCircleOutlined />}
                                                style={{ width: '100%' }}
                                            >
                                                Ajouter une réclamation
                                            </Button>
                                        </Form.Item>
                                    </>
                                )}
                            </Form.List>

                            <div style={{ marginTop: '20px' }}>
                                <Button type="primary" htmlType="submit" loading={loading} icon={<SendOutlined />}>
                                    Soumettre
                                </Button>
                            </div>
                        </Card>
                    )}
                </Form>

            </Card>
        </div>
    </>
  )
}

export default SuiviReparationForm