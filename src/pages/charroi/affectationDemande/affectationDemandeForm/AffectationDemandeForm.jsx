import { useEffect, useState } from 'react'
import { Form, Row, Input, Card, Col, message, Skeleton, Select, Button } from 'antd';
import { getChauffeur, getVehiculeDispo, postAffectationDemande } from '../../../../services/charroiService';
import { SendOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';

const AffectationDemandeForm = ({closeModal, fetchData, id_demande_vehicule}) => {
    const [form] = Form.useForm();
    const [ loading, setLoading ] = useState(false);
    const [ loadingData, setLoadingData ] = useState(false);
    const [ vehicule, setVehicule ] = useState([]);
    const [ chauffeur, setChauffeur ] = useState([]);
    const userId = useSelector((state) => state.user?.currentUser?.id_utilisateur);

    const fetchDatas = async() => {
        try {
            const [vehiculeData, chaufferData] = await Promise.all([
                getVehiculeDispo(),
                getChauffeur()
            ])

            setVehicule(vehiculeData.data)
            setChauffeur(chaufferData.data?.data)
            
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoadingData(false);
        }
    }

    useEffect(()=> {
        fetchDatas();
    }, [id_demande_vehicule])
    

    const onFinish = async (values) => {
        await form.validateFields();

        const loadingKey = 'loadingAffectation';
        message.loading({ content: 'Traitement en cours, veuillez patienter...', key: loadingKey, duration: 0 });
        setLoading(true);

        try {
            
            await postAffectationDemande({
                ...values,
                id_demande_vehicule : id_demande_vehicule,
                user_cr: userId
            })
            
            message.success({ content: "L'affectation a été mise a jour avec succès.", key: loadingKey });
            fetchData();
            closeModal();

        } catch (error) {
            console.error("Erreur lors de l'ajout d'affectation :", error);
            message.error({ content: 'Une erreur est survenue.', key: loadingKey });
        }
    }

  return (
    <>
        <div className="controle_form">
            <div className="controle_title_rows">
                <div className="controle_h2">Form d'affectation</div>
            </div>
            <div className="controle_wrapper">
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                >
                    <Card>
                        <Row gutter={12}>

                            <Col xs={24} md={12}>
                                <Form.Item
                                    label="Véhicule"
                                    name="id_vehicule"
                                    rules={[{ required: true, message: 'Veuillez sélectionner un véhicule' }]}
                                >
                                { loadingData ? <Skeleton.Input active={true} /> : 
                                    <Select
                                        allowClear
                                        showSearch
                                        options={vehicule?.map((item) => ({
                                            value: item.id_vehicule,
                                            label: `${item.immatriculation} / ${item.nom_marque} / ${item.modele}`,
                                        }))}
                                        optionFilterProp="label"
                                        placeholder="Sélectionnez un vehicule..."
                                /> }
                                </Form.Item>
                            </Col>

                            <Col xs={24} md={12}>
                                <Form.Item
                                    label="Chauffeur"
                                    name="id_chauffeur"
                                    rules={[{ required: true, message: 'Veuillez sélectionner un chauffeur' }]}
                                >
                                { loadingData ? <Skeleton.Input active={true} /> : 
                                <Select
                                    allowClear
                                    showSearch
                                    options={chauffeur?.map((item) => ({
                                        value: item.id_chauffeur,
                                        label: item.nom
                                    }))}
                                    optionFilterProp="label"
                                    placeholder="Sélectionnez un chauffeur..."
                                />}
                                </Form.Item>
                            </Col>

                            <Col xs={24} md={24}>
                                <Form.Item
                                    label="Commentaire"
                                    name="commentaire"
                                >
                                    <Input.TextArea placeholder="Saisir le commentaire..." style={{width:'100%', resize:'none', height:'85px'}}/>
                                </Form.Item>
                            </Col>
                            
                            <div style={{ marginTop: '20px' }}>
                                <Button type="primary" htmlType="submit" icon={<SendOutlined />} loading={loading} disabled={loading} >
                                    Soumettre
                                </Button>
                            </div>

                        </Row>
                    </Card>
                </Form>
            </div>
        </div>
    </>
  )
}

export default AffectationDemandeForm