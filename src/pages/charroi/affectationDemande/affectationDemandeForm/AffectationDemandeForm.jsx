import React, { useState } from 'react'
import { Form, message } from 'antd';
import { getChauffeur, getVehicule, postAffectationDemande } from '../../../../services/charroiService';

const AffectationDemandeForm = ({id_demande_vehicule, fetchData}) => {
    const [form] = Form.useForm();
    const [ loading, setLoading ] = useState(false);
    const [ loadingData, setLoadingData ] = useState(false);
    const [ vehicule, setVehicule ] = useState([]);
    const [ chauffeur, setChauffeur ] = useState([]);

    const fetchData = async() => {
        try {
            const [vehiculeData, chaufferData] = await Promise.all([
                getVehicule(),
                getChauffeur()
            ])

            setVehicule(vehiculeData.data)
            setChauffeur(chaufferData.data)
            
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoadingData(false);
        }
    }

    const onFinish = async (values) => {
        await form.validateFields();

        const loadingKey = 'loadingAffectation';
        message.loading({ content: 'Traitement en cours, veuillez patienter...', key: loadingKey, duration: 0 });
        setLoading(true);

        try {
            
            await postAffectationDemande(values)
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
                                    label="Véhicule"
                                    name="id_vehicule"
                                    rules={[{ required: true, message: 'Veuillez sélectionner un véhicule' }]}
                                >
                                { loadingData ? <Skeleton.Input active={true} /> : 
                                <Select
                                    allowClear
                                    showSearch
                                    options={chauffeur?.map((item) => ({
                                        value: item.id_chauffeur,
                                        label: item.nom,
                                    }))}
                                    optionFilterProp="label"
                                    placeholder="Sélectionnez un chauffeur..."
                                />}
                                </Form.Item>
                            </Col>
                            
                            <div style={{ marginTop: '20px' }}>
                                <Button size='large' type="primary" htmlType="submit" icon={<SendOutlined />} loading={loading} disabled={loading} >
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