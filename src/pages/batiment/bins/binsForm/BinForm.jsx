import { useEffect, useState } from 'react';
import { Form, Input, Card, Select, Button, InputNumber, message, Row, Col, notification, Skeleton } from 'antd';
import './binForm.css';
import { getStatutBin, getTypeBin } from '../../../../services/typeService';
import { getBinsOneV, postBins, putBins } from '../../../../services/batimentService';
import { useNavigate } from 'react-router-dom';

const BinForm = ({ idBatiment, closeModal, fetchData, idBins }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(true);
    const [type, setType] = useState([]);
    const [status, setStatus] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [typeResponse, statusResponse] = await Promise.all([
                    getTypeBin(),
                    getStatutBin()
                ]);

                setType(typeResponse.data);
                setStatus(statusResponse.data);

                if (idBins) {
                    const { data } = await getBinsOneV(idBins);
                    form.setFieldsValue(data[0]);
                }

            } catch (error) {
                notification.error({
                    message: 'Erreur de chargement',
                    description: 'Une erreur est survenue lors du chargement des données.',
                });
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [idBins, form]);

    const onFinish = async (values) => {
        const value = {
            id_batiment: idBatiment,
            ...values
        };
        try {
            if (idBins) {
                await putBins(idBins, value);
                message.success('Bin a été mis à jour avec succès !');
            } else {
                await postBins(value);
                message.success('Bin créé avec succès !');
            }
            form.resetFields();
            fetchData();
            closeModal();
            navigate('/liste_bins');
        } catch (error) {
            message.error('Erreur lors de la création du bin. Veuillez réessayer.', 3);
        }
    };

    return (
        <div className="bin-form-container">
            <div className="controle_title_rows">
                <h2 className="controle_h2">{idBins ? 'Mise à jour du bin' : 'Créer un Nouvel Bin'}</h2>
            </div>
            {loading ? (
                <Skeleton active />
            ) : (
                <Card>
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={onFinish}
                        initialValues={{
                            statut: 1,
                            type_stockage: 1,
                        }}
                        className="bin-form"
                    >
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    label="Nom"
                                    name="nom"
                                    rules={[{ required: true, message: 'Veuillez entrer le nom du bin.' }]}
                                >
                                    <Input placeholder="Entrez le nom du bin" />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    label="Superficie (m²)"
                                    name="superficie"
                                    rules={[{ required: true, message: 'Veuillez entrer la superficie.' }]}
                                >
                                    <InputNumber min={0} placeholder="m²" style={{ width: '100%' }} />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col span={8}>
                                <Form.Item
                                    label="Longueur (m)"
                                    name="longueur"
                                    rules={[{ required: true, message: 'Veuillez entrer la longueur.' }]}
                                >
                                    <InputNumber min={0} placeholder="m" style={{ width: '100%' }} />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    label="Largeur (m)"
                                    name="largeur"
                                    rules={[{ required: true, message: 'Veuillez entrer la largeur.' }]}
                                >
                                    <InputNumber min={0} placeholder="m" style={{ width: '100%' }} />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    label="Hauteur (m)"
                                    name="hauteur"
                                    rules={[{ required: true, message: 'Veuillez entrer la hauteur.' }]}
                                >
                                    <InputNumber min={0} placeholder="m" style={{ width: '100%' }} />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col span={8}>
                                <Form.Item
                                    label="Capacité"
                                    name="capacite"
                                    rules={[{ required: true, message: 'Veuillez entrer la capacité.' }]}
                                >
                                    <InputNumber min={0} placeholder="Capacité" style={{ width: '100%' }} />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    label="Type de stockage"
                                    name="type_stockage"
                                    rules={[{ required: true, message: 'Veuillez sélectionner un type de stockage.' }]}
                                >
                                    <Select
                                        showSearch
                                        options={type.map((item) => ({
                                            value: item.id_type_stockage_bins,
                                            label: item.nom_stockage,
                                        }))}
                                        placeholder="Sélectionnez..."
                                        optionFilterProp="label"
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    label="Statut"
                                    name="statut"
                                    rules={[{ required: true, message: 'Veuillez sélectionner un statut.' }]}
                                >
                                    <Select
                                        showSearch
                                        options={status.map((item) => ({
                                            value: item.id_statut_bins,
                                            label: item.nom_statut_bins,
                                        }))}
                                        placeholder="Sélectionnez..."
                                        optionFilterProp="label"
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

    {/*                     <Row gutter={16}>
                            <Col span={24}>
                                <Form.Item
                                    label="Adresse"
                                    name="adresse"
                                    rules={[{ required: false, message: 'Veuillez entrer l adresse.' }]}
                                >
                                    <Input.TextArea placeholder="Entrer l'adresse..." style={{ width: '100%', height:'100px', resize:'none' }} />
                                </Form.Item>
                            </Col>
                        </Row> */}

                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="submit-button" block loading={loading} disabled={loading}>
                                {idBins ? 'Mise à jour' : 'Créer Bin'}
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            )}
        </div>
    );
};

export default BinForm;
