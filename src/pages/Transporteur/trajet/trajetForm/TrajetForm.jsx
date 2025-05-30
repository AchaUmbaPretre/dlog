import { useEffect, useState } from 'react'
import { Form, Row, Divider, Card, Col, message, InputNumber, Skeleton, Select, Button,  DatePicker } from 'antd';
import { getLocalisation, getModeTransport, getTrajetOneV, postTrajet, putTrajet } from '../../../../services/transporteurService';
import { SendOutlined, PlusCircleOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { useWatch } from 'antd/es/form/Form';


const TrajetForm = ({closeModal, fetchDatas, trajetId}) => {
    const [form] = Form.useForm();
    const [ loading, setLoading ] = useState(false);
    const [ local, setLocal ] = useState([]);
    const [ loadingData, setLoadingData ] = useState(false);
    const [ mode, setMode ] = useState([]);
    const userId = useSelector((state) => state.user?.currentUser?.id_utilisateur);
    
    const fetchData = async () => {
        try {
            const [locaData, modeData] = await Promise.all([
            getLocalisation(),
            getModeTransport()
        ])
        setLocal(locaData.data);
        setMode(modeData.data);

        if(trajetId) {
            const { data : d } = await getTrajetOneV(trajetId);
            form.setFieldsValue({
                id_depart : d[0].id_depart,
                id_arrive : d[0].id_arrive,
                segment : d.map((item, index) => ({
                    ordre : item.ordre,
                    id_depart : item.id_depart,
                    id_arrive : item.id_destination,
                    date_depart : moment(item.date_depart),
                    date_arrivee : moment(item.date_arrivee),
                    distance_km : item.distance_km,
                    mode_transport : item.mode_transport,
                    prix : item.prix
                }))
            })
        }
            
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoadingData(false);
        }
    }

    useEffect(()=> {
        fetchData();
    }, [trajetId])

    const segments = Form.useWatch('segment', form);
    const departPrincipal = Form.useWatch('id_depart', form);

    useEffect(() => {
    if (!segments || segments.length === 0) return;

    const updatedSegments = segments.map((seg, index) => {
        const previousSegment = segments[index - 1];

        const autoDepart =
        index === 0
            ? departPrincipal || null
            : previousSegment && previousSegment.id_arrive
            ? previousSegment.id_arrive
            : null;

        return {
        ...seg,
        id_depart: autoDepart,
        };
    });

    form.setFieldsValue({ segment: updatedSegments });
    }, [
    JSON.stringify(segments?.map(s => s?.id_arrive || '')),
    departPrincipal
    ]);

    const onFinish = async(values) => {
        await form.validateFields();
        const loadingKey = 'loadingReparation';
        message.loading({ content: 'Traitement en cours, veuillez patienter...', key: loadingKey, duration: 0 });
        setLoading(true);
        try {

            if(trajetId) {
               const valueObjet = {
                ...values,
                user_cr : userId
               }
                await putTrajet(trajetId, valueObjet)
                message.success({ content: "Le trajet a été modifié avec succès.", key: loadingKey });

            }else {
                const valueObjet = {
                ...values,
                user_cr : userId
               }

            await postTrajet(valueObjet)
            message.success({ content: "Le trajet a été enregistré avec succès.", key: loadingKey });
             
            }   
            form.resetFields();
            closeModal();
            fetchDatas();
            
        } catch (error) {
            console.error("Erreur lors de l'ajout de contrôle technique :", error);
            message.error({ content: 'Une erreur est survenue.', key: loadingKey });
        }  finally {
            setLoading(false);
        }
    }

  return (
    <>
        <div className="controle_form">
            <div className={`controle_title_rows ${loading ? 'loading' : ''}`}>
                <div className="controle_h2">{ trajetId ? 'Modifier un trajet' : 'Enregistrer un trajet'}</div>
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
                                <Card style={{marginBottom:'10px'}} size="small" type="inner" title={`Segment ${key + 1}`}>
                                    <Row key={key} gutter={12} align="middle">
                                        <Col xs={24} md={6}>
                                            <Form.Item
                                                {...restField}
                                                name={[name, 'ordre']}
                                                label="ordre"
                                                initialValue={key + 1}
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
                                                rules={[{ required: true, message: 'Veuillez sélectionner un départ ' }]}
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
                                                rules={[{ required: true, message: 'Veuillez sélectionner une destination' }]}
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
                                                rules={[{ required: false, message: 'Veuillez sélectionner un' }]}
                                            >
                                                <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
                                            </Form.Item>
                                        </Col>

                                        <Col xs={24} md={6}>
                                            <Form.Item
                                                label="Date arrivée"
                                                {...restField}
                                                name={[name, "date_arrivee"]}
                                                rules={[{ required: false, message: 'Veuillez sélectionner un' }]}
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
                    <Button type="primary" htmlType="submit" loading={loading} icon={<SendOutlined />}>
                        { trajetId ? 'Modifier' : 'Soumettre'}
                    </Button>
                </Form>
            </div>
        </div>
    </>
  )
}

export default TrajetForm