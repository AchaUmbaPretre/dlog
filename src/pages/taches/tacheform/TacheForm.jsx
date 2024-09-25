import React, { useEffect, useState } from 'react';
import { Button, Form, Input, Space, Row, Col, Select, notification, DatePicker, Skeleton } from 'antd';
import { getDepartement } from '../../../services/departementService';
import { getClient, getProvince } from '../../../services/clientService';
import { getFrequence } from '../../../services/frequenceService';
import { getUser } from '../../../services/userService';
import { getTacheOneV, postTache, putTache } from '../../../services/tacheService';
import moment from 'moment';
import { getBatiment } from '../../../services/typeService';
import { useNavigate } from 'react-router-dom';
import { getProjetOne } from '../../../services/projetService';
import './tacheForm.scss'
import { getPriorityIcon } from '../../../utils/prioriteIcons';

const TacheForm = ({idControle, idProjet, idTache, closeModal,fetchData}) => {
    const [form] = Form.useForm();
    const [departement, setDepartement] = useState([]);
    const [client, setClient] = useState([]);
    const [frequence, setFrequence] = useState([]);
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [provinces, setProvinces] = useState([]);
    const [batiment, setBatiment] = useState([]);
    const [projetName, setProjetName] = useState('');
    const [loadingData, setLoadingData] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            setLoadingData(true); // Démarre le chargement des données

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

                if(idProjet){
                    const {data} = await getProjetOne(idProjet)
                    setProjetName(data[0]?.nom_projet)
                }

                const { data: tache } = await getTacheOneV(idTache);
                if (tache && tache[0]) {
                    form.setFieldsValue({
                        nom_tache: tache[0].nom_tache,
                        date_debut: moment(tache[0].date_debut, 'YYYY-MM-DD'),
                        date_fin: moment(tache[0].date_fin, 'YYYY-MM-DD'),
                        id_departement: tache[0].id_departement,
                        id_client: tache[0].id_client,
                        id_ville: tache[0].id_ville,
                        id_frequence: tache[0].id_frequence,
                        responsable_principal: tache[0].responsable_principal,
                        id_demandeur: tache[0].id_demandeur,
                        description: tache[0].description,
                        id_batiment: tache[0]?.id_batiment,
                        priorite: tache[0]?.priorite
                    });
                }

            } catch (error) {
                console.log(error)
            }finally {
                setLoadingData(false); 
            }
        };

        fetchData();
    }, [idTache,form]);

    useEffect(() => {
        // Réinitialiser le formulaire lorsque idTache change
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
            if(idTache) {
                await putTache(idTache, dataAll)
            }
            else{
                await postTache(dataAll);
            }
            notification.success({
                message: 'Succès',
                description: 'Les informations ont été enregistrées avec succès.',
            });
            navigate('/tache')
            closeModal();
            fetchData();
            form.resetFields();
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="controle_form">
            <div className="controle_title_rows">
                <h2 className='controle_h2'>{ idTache ? 'Modifier une tâche' : idProjet ? `Insérer une nouvelle tache dans le projet ${projetName}` : 'Ajouter une nouvelle tâche'}</h2>                
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
                            {loadingData ? <Skeleton.Input active={true} /> : <Input placeholder="Nom..." />}
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
                                {loadingData ? <Skeleton.Input active={true} /> : <DatePicker style={{width:'100%'}} />}
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
                                {loadingData ? <Skeleton.Input active={true} />  : <DatePicker style={{width:'100%'}}/>}
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
                                {loadingData ? <Skeleton.Input active={true} /> : <Select
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
                                {loadingData ? <Skeleton.Input active={true} /> : <Select
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
                                {loadingData ? <Skeleton.Input active={true} /> : <Select
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
                                {loadingData ? <Skeleton.Input active={true} /> : <Select
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
                                {loadingData ? <Skeleton.Input active={true} /> :                                 <Select
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
                                {loadingData ? <Skeleton.Input active={true} /> :                                 <Select
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
                        <Col xs={24} md={12}>
                            <Form.Item
                                name="id_batiment"
                                label="Entité"
                                rules={[
                                    {
                                        required: false
                                    },
                                ]}
                            >
                                {loadingData ? <Skeleton.Input active={true} /> :                                 <Select
                                    placeholder="Sélectionnez un bâtiment"
                                    showSearch
                                    options={batiment.map((item) => ({
                                        value: item.id_batiment,
                                        label: item.nom_batiment,
                                    }))}
                                />}
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                        <Form.Item
                                name="priorite"
                                label="Priorité"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Veuillez sélectionner une priorité.',
                                    },
                                ]}
                            >
                                {loadingData ? <Skeleton.Input active={true} /> :                                 <Select
                                    placeholder="Sélectionnez une priorité..."
                                    optionFilterProp="label"
                                    options={[
                                        { value: 1, label: <span>{getPriorityIcon(1)} Très faible</span> },
                                        { value: 2, label: <span>{getPriorityIcon(2)} Faible</span> },
                                        { value: 3, label: <span>{getPriorityIcon(3)} Moyenne</span> },
                                        { value: 4, label: <span>{getPriorityIcon(4)} Haute</span> },
                                        { value: 5, label: <span>{getPriorityIcon(5)} Très haute</span> },
                                    ]}
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
                                {loadingData ? <Skeleton.Input active={true} /> : <Input.TextArea style={{height:'70px'}} placeholder="Description..." />}
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

export default TacheForm;
