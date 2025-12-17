import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Form, Select, notification, InputNumber, DatePicker, Input, Table, Button, Tag, Row, Col, Card, Skeleton } from 'antd';
import { getCat_inspection } from '../../../../../../services/batimentService';
import { useReparationTracking } from './hook/useReparationTracking';
import { SendOutlined, ToolOutlined, CalendarOutlined,DollarOutlined, PlusCircleOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { evaluationStatusMap } from '../../../../../../utils/prioriteIcons';
import moment from 'moment';


const ReparationGeneratTracking = ({ idRep }) => {
    const [form] = Form.useForm();
    const { data, loading, refresh } = useReparationTracking({idRep})
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 20,
    });
    const [dataEvol, setDataEvol] = useState(1)
    
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

    }

    useEffect(() => {
        const info = form.getFieldValue('info');
        if (!info || info.length === 0) {
            form.setFieldsValue({ info: [{}] }); 
        }
    }, [form]);

    const evaluationOptions = useMemo(() => data?.evaluation?.map(e => ({ value: e.id_evaluation, label: e.nom_evaluation})), [data?.evaluation]);
    const statutOptions = useMemo(() => data?.statut?.map(s => ({ value: s.id_statut_vehicule,label: `${s.nom_statut_vehicule}` })), [data?.statut]);
    const tacheOptions = useMemo(() => data?.tache?.map(t => ({ value: t.id_cat_inspection, label: t.nom_cat_inspection })), [data.tache]);
    const pieceOptions = useMemo(() => data?.piece?.map(p => ({ value: p.id, label: p.nom })), [data?.piece])

  return (
    <>
        <div className="suivi_reparation_form">
            <div className="reparation_detail_title">
                <h1 className="reparation_detail_h1">SUIVI INTERVENTION BON N°</h1>
            </div>
            <Card className="suivi_reparation_wrapper">
                <Card type="inner" title="INFORMATIONS GENERALES">
                    <div className="reparation_detail_top">
                        <Skeleton loading={loading} active paragraph={false}>
                            <Table
                                columns={columns}
                                dataSource={data.detail}
                                onChange={(pagination) => setPagination(pagination)}
                                pagination={pagination}
                                rowKey="id"
                                bordered
                                loading={loading}
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
                    <Col span={12}>
                        <Card style={{ marginTop: 10 }}>
                            <Form.Item
                                name="id_evaluation"
                                label="Évaluation"
                                rules={[{ required: true, message: 'Veuillez sélectionner une option.' }]}
                            >
                                <Select showSearch placeholder="Sélectionnez une évaluation" onChange={setDataEvol} options={evaluationOptions} />
                            </Form.Item>
                        </Card>
                    </Col>

                    <Col span={12}>
                        <Card style={{ marginTop: 10 }}>
                            <Form.Item
                                name="id_statut_vehicule"
                                label="État du véhicule"
                            >
                                <Select allowClear showSearch placeholder="Sélectionnez un générateur" optionFilterProp="label" options={statutOptions} />
                            </Form.Item>
                        </Card>
                    </Col>
                </Row>
                {dataEvol === 1 && (
                    <Form.List name="info">
                        {(fields, { add, remove}) => (
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
                                                    <Select allowClear showSearch placeholder="Sélectionnez un générateur" optionFilterProp="label" options={tacheOptions} />
                                                </Form.Item> 
                                            </Col>

                                            <Col xs={24} md={7}>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, "id_piece"]}
                                                    label="Pièce"
                                                >
                                                    <Select allowClear showSearch placeholder="Sélectionnez un générateur" optionFilterProp="label" options={pieceOptions} />
                                                </Form.Item>
                                            </Col>

                                            <Col xs={24} md={8}>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, "budget"]}
                                                    label="Budget"
                                                >
                                                    <InputNumber min={0} placeholder="20" style={{ width: '100%' }} />
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
                        )

                        }
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
                    </Card>     
                )}
            </Form>
            </Card>
        </div>
    </>
  );
};

export default ReparationGeneratTracking;
