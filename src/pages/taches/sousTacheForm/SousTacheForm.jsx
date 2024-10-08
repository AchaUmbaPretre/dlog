import React, { useEffect, useState } from 'react';
import { Button, Form, Input, Space,Skeleton, Row, Col, Select, notification, DatePicker } from 'antd';
import { getDepartement } from '../../../services/departementService';
import { getClient, getProvince } from '../../../services/clientService';
import { getFrequence } from '../../../services/frequenceService';
import { getUser } from '../../../services/userService';
import { getTacheOne, postTache } from '../../../services/tacheService';
import moment from 'moment';
import { getBatiment } from '../../../services/typeService';
import { useNavigate } from 'react-router-dom';

const SousTacheForm = ({idControle, idProjet, idTache, closeModal,fetchData}) => {
    const [form] = Form.useForm();
    const [departement, setDepartement] = useState([]);
    const [client, setClient] = useState([]);
    const [frequence, setFrequence] = useState([]);
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [provinces, setProvinces] = useState([]);
    const [batiment, setBatiment] = useState([]);
    const [tacheName, setTacheName] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [departementData, frequenceData, usersData, clientData, provinceData, batimentData] = await Promise.all([
                    getDepartement(),
                    getFrequence(),
                    getUser(),
                    getClient(),
                    getProvince(),
                    getBatiment(),
                ]);

                setDepartement(departementData.data);
                setFrequence(frequenceData.data);
                setUsers(usersData.data);
                setClient(clientData.data);
                setProvinces(provinceData.data);
                setBatiment(batimentData.data)

                if(idTache){
                    const {data} = await getTacheOne(idTache)
                    setTacheName(data[0].nom_tache)
                }

            } catch (error) {
                console.log(error)
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [idTache,form]);

    useEffect(() => {
        form.resetFields();
      }, [idTache, form]);

    const onFinish = async (values) => {
        const dataAll = {
            ...values,
            id_control : idControle,
            id_projet: idProjet
        }
        setIsLoading(true);
        try {
                await postTache({
                    ...dataAll,
                    id_tache_parente: idTache
                });
                notification.success({
                message: 'Succès',
                description: 'Les informations ont été enregistrées avec succès.',
            });
            navigate('/tache')
            closeModal()
            fetchData()
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="controle_form">
            <div className="controle_title_rows">
                <h2 className='controle_h2'>Ajouter une sous-tâche {tacheName}</h2>                
            </div>
            <div className="controle_wrapper">
                <Form
                    form={form}
                    name="validateOnly"
                    layout="vertical"
                    autoComplete="off"
                    className="custom-form"
                    onFinish={onFinish}
                >
                    <Row gutter={12}>
                        <Col xs={24} md={8}>
                            <Form.Item
                                name="nom_tache"
                                label="Titre"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Veuillez fournir un nom...',
                                    },
                                ]}
                            >
                                {isLoading ? <Skeleton.Input active /> : <Input placeholder="Titre..." />}
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={8}>
                            <Form.Item
                                name="date_debut"
                                label="Date début"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Veuillez sélectionner une date de début.',
                                    },
                                ]}
                                initialValue={moment()}
                            >
                                <DatePicker style={{width:'100%'}} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={8}>
                            <Form.Item
                                name="date_fin"
                                label="Date fin"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Veuillez sélectionner une date de fin.',
                                    },
                                ]}
                            >
                                <DatePicker style={{width:'100%'}}  />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={8}>
                            <Form.Item
                                name="id_departement"
                                label="Département"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Veuillez sélectionner un département.',
                                    },
                                ]}
                            >
                                {isLoading ? <Skeleton.Input active /> :                                 <Select
                                    showSearch
                                    options={departement.map((item) => ({
                                        value: item.id_departement,
                                        label: item.nom_departement,
                                    }))}
                                    placeholder="Sélectionnez un département..."
                                    optionFilterProp="label"
                                />}
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={8}>
                            <Form.Item
                                name="id_client"
                                label="Client"
                                rules={[
                                    {
                                        required: false,
                                        message: 'Veuillez sélectionner un client.',
                                    },
                                ]}
                            >
                                 {isLoading ? <Skeleton.Input active /> :                                 <Select
                                    showSearch
                                    options={client.map((item) => ({
                                        value: item.id_client,
                                        label: item.nom,
                                    }))}
                                    placeholder="Sélectionnez un client..."
                                    optionFilterProp="label"
                                />}
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={8}>
                            <Form.Item
                                label="Ville"
                                name="id_ville"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Veuillez sélectionner une ville.',
                                    },
                                ]}
                            >
                            {isLoading ? <Skeleton.Input active /> :                                 <Select
                                    showSearch
                                    options={provinces?.map((item) => ({
                                        value: item.id,
                                        label: item.capital,
                                    }))}
                                    placeholder="Sélectionnez une ville..."
                                    optionFilterProp="label"
                                />}

                            </Form.Item>
                        </Col>
                        <Col xs={24} md={8}>
                            <Form.Item
                                name="id_frequence"
                                label="Fréquence"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Veuillez indiquer la fréquence.',
                                    },
                                ]}
                            >
                                {isLoading ? <Skeleton.Input active /> :                                 <Select
                                    showSearch
                                    options={frequence.map((item) => ({
                                        value: item.id_frequence,
                                        label: item.nom,
                                    }))}
                                    placeholder="Sélectionnez une fréquence..."
                                    optionFilterProp="label"
                                />}
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={8}>
                            <Form.Item
                                name="responsable_principal"
                                label="Owner"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Veuillez indiquer le responsable.',
                                    },
                                ]}
                            >
                            {isLoading ? <Skeleton.Input active /> :
                                <Select
                                    showSearch
                                    options={users.map((item) => ({
                                        value: item.id_utilisateur,
                                        label: `${item.nom}`,
                                    }))}
                                    placeholder="Sélectionnez un responsable..."
                                    optionFilterProp="label"
                                />}
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={8}>
                            <Form.Item
                                name="id_demandeur"
                                label="Demandeur"
                                rules={[
                                    {
                                        required: false,
                                        message: 'Veuillez indiquer un demandeur.',
                                    },
                                ]}
                            >
                                {isLoading ? <Skeleton.Input active /> :                                 
                                <Select
                                    showSearch
                                    options={users.map((item) => ({
                                        value: item.id_utilisateur,
                                        label: `${item.nom}`,
                                    }))}
                                    placeholder="Sélectionnez un demandeur..."
                                    optionFilterProp="label"
                                />}
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={24}>
                            <Form.Item
                                name="id_batiment"
                                label="Entité"
                                rules={[
                                    {
                                        required: false
                                    },
                                ]}
                            >
                                {isLoading ? <Skeleton.Input active /> :                                 
                                <Select
                                    placeholder="Sélectionnez un bâtiment"
                                    showSearch
                                    options={batiment.map((item) => ({
                                        value: item.id_batiment,
                                        label: item.nom_batiment,
                                    }))}
                                />}
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={24}>
                            <Form.Item
                                name="description"
                                label="Description"
                                rules={[
                                    {
                                        required: false,
                                        message: 'Veuillez fournir une description.',
                                    },
                                ]}
                            >
                                <Input.TextArea style={{height:'70px'}} placeholder="Description..." />
                            </Form.Item>
                        </Col>
                        <Col xs={24}>
                            <Form.Item>
                                <Space className="button-group">
                                    <Button type="primary" htmlType="submit" loading={isLoading} disabled={isLoading}>
                                        { idTache ? 'Modifier' : 'Ajouter'}
                                    </Button>
                                    <Button htmlType="reset">
                                        Réinitialiser
                                    </Button>
                                </Space>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </div>
        </div>
    );
};

export default SousTacheForm;
