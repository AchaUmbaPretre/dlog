import React, { useEffect, useState } from 'react';
import './suiviReparationForm.scss'
import { Card, Form, Skeleton, Select, DatePicker, notification, Input, Button, Col, Row, Divider, Table, Tag, InputNumber, message } from 'antd';
import moment from 'moment';
import { SendOutlined, ToolOutlined, TagsOutlined, CalendarOutlined,DollarOutlined, PlusCircleOutlined, MinusCircleOutlined } from '@ant-design/icons';
import {  getEvaluation, getPiece, getStatutVehicule, getSuiviReparationOne, getTypeReparation, postSuiviReparation } from '../../../../../services/charroiService';
import { getCat_inspection } from '../../../../../services/batimentService';
import { useSelector } from 'react-redux';

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
    const [dataEvol, setDataEvol] = useState(null)
    const userId = useSelector((state) => state.user?.currentUser?.id_utilisateur);
    const [reparation, setReparation] = useState([]);
    
    
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
                const { data : d } = await getSuiviReparationOne(idReparations)
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
          dataIndex: 'nom_type_rep',
          key: 'nom_type_rep',
          render: (text) => <Tag color="blue">{text}</Tag>
        },
        {
          title: <><TagsOutlined /> Catégorie</>,
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
          dataIndex: '"date_sortie',
          key: '"date_sortie',
          render: (text) =>
            <Tag color='purple'>{moment(text).format('LL')}</Tag>
        },
        {
          title: <><DollarOutlined /> Budget</>,
          dataIndex: 'budget',
          key: 'budget',
          render: (text) => <Tag color="green">{text} $</Tag>
        }
      ];
      

    const onFinish = async (values) => {
        const loadingKey = 'loadingReparation';
        message.loading({ content: 'Traitement en cours, veuillez patienter...', key: loadingKey, duration: 0 });
    
        setLoading(true);
        
        try {

            await postSuiviReparation({
                ...values,
                id_sud_reparation : idReparations,
                user_cr : userId
            });
            message.success({ content: 'Suivie réparation enregistrée avec succès.', key: loadingKey });
            form.resetFields();
            fetchData();
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
                        {
                            dataEvol === 1 &&
                            <div>
                            <Form.List name="info">
                            {(fields, { add, remove}) => (
                                <>
                                    {
                                        fields.map(({ key, name, ...restField }) => (
                                            <Card style={{margin:'10px 0'}}>
                                                <Row key={key} gutter={12} align='small'>
                                                    <Col xs={24} md={8}>
                                                        <Form.Item
                                                            {...restField}
                                                            name={[name, "id_tache_rep" ]}
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
                                                                onChange={setIdPiece}
                                                            />
                                                        </Form.Item>
                                                    </Col>

                                                    <Col xs={24} md={7}>
                                                        <Form.Item
                                                            {...restField}
                                                            name={[name, "id_piece" ]}
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
                                                            {...restField}
                                                            name={[name, "budget" ]}
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
                                                            {...restField}
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
                                                    <Col xs={24} md={2}>
                                                        <Button
                                                            style={{marginTop:'27px'}}
                                                            type="text"
                                                            danger
                                                            icon={<MinusCircleOutlined />}
                                                            onClick={() => remove(name)}
                                                        >
                                                        </Button>
                                                    </Col>
                                                </Row>
                                            </Card>
                                        ))
                                    }

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
                                </>
                            )}
                        </Form.List>

                        <div style={{ marginTop: '20px' }}>
                            <Button size='large' type="primary" htmlType="submit" icon={<SendOutlined />} loading={loading} disabled={loading} >
                                Soumettre
                            </Button>
                        </div>
                            </div>
                        }
                        {   dataEvol !== 1 &&
                            <>
                            <Card style={{margin:'10px 0'}}>
                                <Form
                                    form={form}
                                    name="chauffeurForm"
                                    layout="vertical"
                                    autoComplete="off"
                                    className="custom-form"
                                    onFinish={onFinish}
                                >
                                    <Row gutter={12}>
                                    <Col xs={24} md={12}>
                                        <Form.Item
                                            name="intitule"
                                            label="Intitulé"
                                            rules={[
                                                {
                                                    required: false,
                                                    message: 'Veuillez fournir un titre...',
                                                }
                                            ]}
                                        >
                                            {loadingData ? <Skeleton.Input active={true} /> : <Input placeholder="Saisir le titre..." />}
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} md={12}>
                                        <Form.Item
                                            name="date_debut"
                                            label="Date début"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Veuillez fournir une date...',
                                                },
                                            ]}
                                            initialValue={moment()}
                                        >
                                                {loadingData ? (
                                                    <Skeleton.Input active={true} />
                                                ) : (
                                                    <DatePicker size='large' format="YYYY-MM-DD" style={{ width: '100%' }} />
                                                )}
                                            </Form.Item>
                                    </Col>

                                    <Col xs={24} md={24}>
                                            <Form.Item
                                                name="montant"
                                                label="Cout"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: 'Veuillez fournir un cout...',
                                                    }
                                                ]}
                                            >
                                                {loadingData ? <Skeleton.Input active={true} /> : <InputNumber size='large' min={0} placeholder="Saisir le cout..." style={{width:'100%'}}/>}
                                            </Form.Item>
                                        </Col>

                                        <Col xs={24} md={12}>
                                            <Form.Item
                                                name="description"
                                                label="Description"
                                                rules={[
                                                    {
                                                        required: false,
                                                        message: 'Veuillez fournir la description...',
                                                    }
                                                ]}
                                            >
                                                {loadingData ? <Skeleton.Input active={true} /> : <Input.TextArea placeholder="Saisir le commentaire..." style={{width:'100%', resize:'none', height:'90px'}}/>}
                                            </Form.Item>
                                        </Col>

                                        <Col xs={24} md={12}>
                                            <Form.Item
                                                name="raison_fin"
                                                label="Raison"
                                                rules={[
                                                    {
                                                        required: false,
                                                        message: 'Veuillez fournir la raison...',
                                                    }
                                                ]}
                                            >
                                                {loadingData ? <Skeleton.Input active={true} /> : <Input.TextArea placeholder="Saisir le commentaire..." style={{width:'100%', resize:'none', height:'90px'}}/>}
                                            </Form.Item>
                                        </Col>
                                    </Row>

                                    {/* Réparations dynamiques */}
                                    <Form.List name="sub_reclamation">
                                    {(fields, { add, remove }) => (
                                        <>
                                        <Divider className='title_row'>Réclamer</Divider>
                                        {fields.map(({ key, name, ...restField }) => (
                                            <Row key={key} gutter={12} align="middle">
                                                <Col xs={24} md={7}>
                                                    <Form.Item
                                                        {...restField}
                                                        name={[name, 'id_type_reparation']}
                                                        label="Type de réparation"
                                                        rules={[
                                                            { required: true, message: 'Veuillez fournir une réparation...' },
                                                        ]}
                                                    >
                                                        <Select
                                                            allowClear
                                                            showSearch
                                                            options={reparation.map((item) => ({
                                                            value: item.id_type_reparation,
                                                            label: `${item.type_rep}`,
                                                                }))}
                                                            placeholder="Sélectionnez un type de réparation..."
                                                            optionFilterProp="label"
                                                        />
                                                    </Form.Item>
                                                </Col>
                                                
                                                <Col xs={24} md={7}>
                                                    <Form.Item
                                                    {...restField}
                                                    name={[name, 'montant']}
                                                    label="Montant"
                                                    rules={[
                                                        { required: false, message: 'Veuillez fournir le montant...' },
                                                    ]}
                                                    >
                                                        <InputNumber min={0} placeholder="Saisir le montant..." style={{width:'100%'}}/>
                                                    </Form.Item>
                                                </Col>
                                                <Col xs={24} md={8}>
                                                    <Form.Item
                                                    {...restField}
                                                    name={[name, 'description']}
                                                    label="Description"
                                                    rules={[
                                                        { required: true, message: 'Veuillez fournir une description...' },
                                                    ]}
                                                    >
                                                        <Input.TextArea
                                                            placeholder="Saisir la description"
                                                            style={{ width: '100%', resize: 'none' }}
                                                        />
                                                    </Form.Item>
                                                </Col>
                                                <Col xs={24} md={2}>
                                                    <Button
                                                    type="text"
                                                    danger
                                                    icon={<MinusCircleOutlined />}
                                                    onClick={() => remove(name)}
                                                    >
                                                    </Button>
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
                                </Form>
                            </Card>
                        </>
                        }
                    </Form>
            </Card>
        </div>
    </>
  )
}

export default SuiviReparationForm