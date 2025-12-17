import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Form, Select, notification, Input, Table, Button, Tag, Row, Col, Card, Skeleton } from 'antd';
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
                                <Select showSearch placeholder="Sélectionnez un générateur" options={evaluationOptions} />
                            </Form.Item>
                        </Card>
                    </Col>

                    <Col span={12}>
                        <Card style={{ marginTop: 10 }}>
                            <Form.Item
                                name="id_statut_vehicule"
                                label="État du véhicule"
                            >
                                <Select allowClear showSearch placeholder="Sélectionnez un générateur" optionFilterProp="label" onChange={setDataEvol} options={statutOptions} />
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
                                                    <Select allowClear showSearch placeholder="Sélectionnez un générateur" optionFilterProp="label" onChange={setDataEvol} options={tacheOptions} />
                                                </Form.Item> 
                                            </Col>

                                            <Col xs={24} md={7}>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, "id_piece"]}
                                                    label="Pièce"
                                                >
                                                    <Select allowClear showSearch placeholder="Sélectionnez un générateur" optionFilterProp="label" onChange={setDataEvol} options={pieceOptions} />
                                                </Form.Item>
                                            </Col>

                                            <Col xs={24} md={8}>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, "budget"]}
                                                    label="Budget"
                                                >

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
                            </>
                        )

                        }
                    </Form.List>
                )

                }
            </Form>

        </div>
    </>
  );
};

export default ReparationGeneratTracking;
