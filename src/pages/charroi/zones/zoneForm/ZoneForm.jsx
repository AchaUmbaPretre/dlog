import React, { useEffect, useState } from 'react'
import { Row, Form, Skeleton, notification, Col, Select, Button, Input, message, Space } from 'antd';
import { postZone, getSite, getZoneById, putZone } from '../../../../services/charroiService';

const ZoneForm = ({closeModal, fetchData, idZone}) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(false);
    const [sites, setSites] = useState([]);
    const [typeZone] = useState([
        { id: 'géofencé', label: 'Géofencé' },
        { id: 'normal', label: 'Normal' }
    ]);


    const fetchDatas = async () => {        
        try {
            setLoadingData(true)
            
            // Récupération des sites
            const siteData = await getSite();
            setSites(siteData?.data.data || []);

            // Si c'est une modification, récupérer les données de la zone
            if(idZone) {
                const response = await getZoneById(idZone);
                const zoneData = response.data?.[0] || response.data;
                
                // Formater les données pour le formulaire
                form.setFieldsValue({
                    NomZone: zoneData.NomZone,
                    site_id: zoneData.site_id,
                    state: zoneData.state,
                    type_zone: zoneData.type_zone,
                    latitude: zoneData.latitude,
                    longitude: zoneData.longitude,
                    rayon_metres: zoneData.rayon_metres,
                    precision_minimale: zoneData.precision_minimale
                });
            }
            
        } catch (error) {
            console.error('Erreur lors du chargement des données:', error);
            notification.error({
                message: 'Erreur',
                description: 'Impossible de charger les données nécessaires.'
            });
        } finally {
            setLoadingData(false); 
        }
    }

    useEffect(()=> {
        fetchDatas();
    }, [idZone]); // Ajout de idZone comme dépendance

    const onFinish = async (values) => {
        setLoading(true);
        const loadingKey = 'loadingZone';
    
        try {
            message.loading({ content: 'En cours...', key: loadingKey });
    
            const zoneData = {
                NomZone: values.NomZone,
                site_id: values.site_id,
                state: values.state ?? 1,
                type_zone: values.type_zone,
                latitude: values.latitude,
                longitude: values.longitude,
                rayon_metres: values.rayon_metres,
                precision_minimale: values.precision_minimale || null
            };
    
            if (idZone) {
                // Mode modification
                await putZone({
                    id: idZone,
                    ...zoneData
                });
                message.success({
                    content: 'La zone a été modifiée avec succès.',
                    key: loadingKey,
                });
            } else {
                // Mode ajout
                await postZone(zoneData);
                message.success({
                    content: 'La zone a été ajoutée avec succès.',
                    key: loadingKey,
                });
            }
    
            form.resetFields();
            closeModal();
            fetchData();
        } catch (error) {
            console.error("Erreur lors de l'enregistrement de la zone:", error);
    
            message.error({
                content: 'Une erreur est survenue.',
                key: loadingKey, 
            });
    
            notification.error({
                message: 'Erreur',
                description: error.response?.data?.error || 'Une erreur inconnue s\'est produite.',
            });
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <>
            <div className="controle_form">
                <div className="controle_title_rows">
                    <h2 className="controle_h2">
                        {idZone ? 'Modifier la zone' : 'Ajouter une zone'}
                    </h2>
                </div>
                <div className="controle_wrapper">
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={onFinish}
                        initialValues={{
                            state: 1,
                            rayon_metres: 100
                        }}
                    >
                        <Row gutter={12}>
                            <Col xs={24} md={8}>
                                <Form.Item
                                    name="NomZone"
                                    label="Nom de la zone"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Veuillez fournir un nom pour la zone...',
                                        },
                                    ]}
                                >
                                    {loadingData ? 
                                        <Skeleton.Input active={true} /> : 
                                        <Input 
                                            placeholder="Saisir le nom de la zone..." 
                                            size='large' 
                                            disabled={loading}
                                        />
                                    }
                                </Form.Item>
                            </Col>

                            <Col xs={24} md={8}>
                                <Form.Item
                                    name="site_id"
                                    label="Site"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Veuillez sélectionner un site...',
                                        },
                                    ]}
                                >
                                    {loadingData ? 
                                        <Skeleton.Input active={true} /> :
                                        <Select
                                            size='large'
                                            allowClear
                                            showSearch
                                            options={sites?.map((item) => ({
                                                value: item.id_site,
                                                label: item.nom_site,
                                            }))}
                                            placeholder="Sélectionnez un site..."
                                            optionFilterProp="label"
                                            filterOption={(input, option) =>
                                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                            }
                                            disabled={loading}
                                        />
                                    }
                                </Form.Item>
                            </Col>

                            <Col xs={24} md={8}>
                                <Form.Item
                                    name="type_zone"
                                    label="Type de zone"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Veuillez sélectionner un type de zone...',
                                        },
                                    ]}
                                >
                                    {loadingData ? 
                                        <Skeleton.Input active={true} /> :
                                        <Select
                                            size='large'
                                            allowClear
                                            showSearch
                                            options={typeZone?.map((item) => ({
                                                value: item.id,
                                                label: item.label,
                                            }))}
                                            placeholder="Sélectionnez un type de zone..."
                                            optionFilterProp="label"
                                            disabled={loading}
                                        />
                                    }
                                </Form.Item>
                            </Col>

                            <Col xs={24} md={12}>
                                <Form.Item
                                    name="latitude"
                                    label="Latitude"
                                >
                                    {loadingData ? 
                                        <Skeleton.Input active={true} /> : 
                                        <Input 
                                            type="number" 
                                            step="any" 
                                            placeholder="Ex: -1.678" 
                                            size='large'
                                            disabled={loading}
                                        />
                                    }
                                </Form.Item>
                            </Col>

                            <Col xs={24} md={12}>
                                <Form.Item
                                    name="longitude"
                                    label="Longitude"
                                >
                                    {loadingData ? 
                                        <Skeleton.Input active={true} /> : 
                                        <Input 
                                            type="number" 
                                            step="any" 
                                            placeholder="Ex: 29.234" 
                                            size='large'
                                            disabled={loading}
                                        />
                                    }
                                </Form.Item>
                            </Col>

                            <Col xs={24} md={12}>
                                <Form.Item
                                    name="rayon_metres"
                                    label="Rayon (mètres)"
                                >
                                    {loadingData ? 
                                        <Skeleton.Input active={true} /> : 
                                        <Input 
                                            type="number" 
                                            placeholder="Ex: 100" 
                                            size='large'
                                            disabled={loading}
                                        />
                                    }
                                </Form.Item>
                            </Col>

                            <Col xs={24} md={12}>
                                <Form.Item
                                    name="precision_minimale"
                                    label="Précision minimale"
                                >
                                    {loadingData ? 
                                        <Skeleton.Input active={true} /> : 
                                        <Input 
                                            type="number" 
                                            step="any" 
                                            placeholder="Ex: 10 (optionnel)" 
                                            size='large'
                                            disabled={loading}
                                        />
                                    }
                                </Form.Item>
                            </Col>

                            <Col xs={24}>
                                <Form.Item>
                                    <Space className="button-group">
                                        <Button 
                                            size='large' 
                                            type="primary" 
                                            htmlType="submit" 
                                            loading={loading} 
                                            disabled={loading}
                                        >
                                            {idZone ? 'Modifier la zone' : 'Ajouter la zone'}
                                        </Button>
                                        <Button 
                                            size='large' 
                                            htmlType="reset"
                                            disabled={loading}
                                            onClick={() => form.resetFields()}
                                        >
                                            Réinitialiser
                                        </Button>
                                    </Space>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </div>
            </div>
        </>
    )
}

export default ZoneForm;