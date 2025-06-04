import { useEffect, useState } from 'react'
import { Form, Row, Divider, Card, Col, message, InputNumber, Skeleton, Select, Button,  DatePicker } from 'antd';
import { getLocalisation, getModeTransport, getTrajetOneV, postTrajet, putTrajet } from '../../../../services/transporteurService';
import { SendOutlined, PlusCircleOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import moment from 'moment';

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
                id_depart : d[0].id_depart_tr,
                id_destination : d[0].id_destination_tr,
            })
        }
            
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoadingData(false);
        }
    };

    useEffect(()=> {
        fetchData();
    }, [trajetId])

    const segments = Form.useWatch('segment', form);
    const departPrincipal = Form.useWatch('id_depart', form);

    useEffect(() => {
    if (!segments || segments.length === 0 || !departPrincipal) return;

    const updatedSegments = [...segments];

    for (let i = 0; i < segments.length; i++) {
        const currentSegment = { ...segments[i] };

        // Départ automatique
        if (i === 0) {
        currentSegment.id_depart = departPrincipal;
        } else {
        const previousDestination = updatedSegments[i - 1]?.id_destination;
        if (previousDestination) {
            currentSegment.id_depart = previousDestination;
        }
        }

        updatedSegments[i] = currentSegment;
    }

    if (JSON.stringify(updatedSegments) !== JSON.stringify(segments)) {
        form.setFieldsValue({ segment: updatedSegments });
    }
    }, [
    departPrincipal,
    JSON.stringify(segments?.map(s => s?.id_destination || null)),
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