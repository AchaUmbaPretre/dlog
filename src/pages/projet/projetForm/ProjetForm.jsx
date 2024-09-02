import React, { useEffect, useState } from 'react';
import { Form, Input, DatePicker, InputNumber, Select, Button, Typography, Row, Col, notification } from 'antd';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Importez les styles de Quill
import { getUser } from '../../../services/userService';
import { getClient } from '../../../services/clientService';
import { postProjet } from '../../../services/projetService';

const { Title } = Typography;
const { Option } = Select;

const ProjetForm = () => {
    const [form] = Form.useForm();
    const [client, setClient] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [description, setDescription] = useState(''); // État pour la description des besoins

    // Fonction pour afficher des notifications d'erreur
    const handleError = (message) => {
        notification.error({
            message: 'Erreur de chargement',
            description: message,
        });
    };

    // Fonction pour récupérer les données des utilisateurs et des clients
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [usersData, clientData] = await Promise.all([
                    getUser(),
                    getClient(),
                ]);

                setUsers(usersData.data); // Met à jour l'état avec les utilisateurs récupérés
                setClient(clientData.data); // Met à jour l'état avec les clients récupérés
            } catch (error) {
                handleError('Une erreur est survenue lors du chargement des données.');
            }
        };

        fetchData();
    }, []);

    // Fonction pour traiter la soumission du formulaire
    const onFinish = async (values) => {
        setLoading(true); // Affiche le spinner de chargement
        try {
            // Ajout de la description des besoins aux valeurs du formulaire
            const finalValues = { ...values, description };
            await postProjet(finalValues); // Envoie les données du formulaire au serveur
            notification.success({
                message: 'Succès',
                description: 'Le projet a été enregistré avec succès.',
            });
            form.resetFields(); // Réinitialise les champs du formulaire
            window.location.reload(); // Recharge la page (optionnel)
        } catch (error) {
            notification.error({
                message: 'Erreur',
                description: 'Erreur lors de l\'enregistrement du projet.',
            });
        } finally {
            setLoading(false); // Masque le spinner de chargement
        }
    };

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{ budget: 0 }}
        >
            <Title level={3}>Créer un Projet</Title>
            
            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item
                        label="Titre du Projet"
                        name="nom_projet"
                        rules={[{ required: true, message: 'Le nom du projet est requis' }]}
                    >
                        <Input placeholder="Entrez le nom du projet" />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        label="Chef de Projet"
                        name="chef_projet"
                        rules={[{ required: true, message: 'Le chef de projet est requis' }]}
                    >
                        <Select placeholder="Sélectionnez un chef de projet">
                            {users.map((chef) => (
                                <Option key={chef.id_utilisateur} value={chef.id_utilisateur}>
                                    {chef.nom}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Col>
            </Row>

            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item
                        label="Date de Début"
                        name="date_debut"
                        rules={[{ required: true, message: 'La date de début est requise' }]}
                    >
                        <DatePicker 
                            placeholder="Sélectionnez la date de début" 
                            style={{ width: '100%' }} 
                            format="DD/MM/YYYY" // Format de la date
                        />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        label="Date de Fin"
                        name="date_fin"
                        rules={[{ required: true, message: 'La date de fin est requise' }]}
                    >
                        <DatePicker 
                            placeholder="Sélectionnez la date de fin" 
                            style={{ width: '100%' }} 
                            format="DD/MM/YYYY" // Format de la date
                        />
                    </Form.Item>
                </Col>
            </Row>

            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item
                        label="Budget"
                        name="budget"
                        rules={[{ required: false, message: 'Le budget est requis' }]}
                    >
                        <InputNumber
                            placeholder="Entrez le budget"
                            style={{ width: '100%' }}
                            min={0}
                            formatter={(value) => `${value} $`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                        />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        label="Client"
                        name="client"
                        rules={[{ required: true, message: 'Le client est requis' }]}
                    >
                        <Select
                            placeholder="Sélectionnez un client"
                            showSearch
                            options={client.map((item) => ({
                                value: item.id_client,
                                label: item.nom,
                            }))}
                        />
                    </Form.Item>
                </Col>
            </Row>

            <Row gutter={16}>
                <Col span={24}>
                    <Form.Item
                        label="Description des Besoins"
                        name="description"
                        // Le label est conservé pour la validation
                    >
                        <ReactQuill
                            style={{height:'150px', marginBottom:'30px'}}
                            value={description}
                            onChange={setDescription}
                            placeholder="Entrez les besoins associés au projet"
                            modules={modules} // Optionnel: modules Quill à configurer
                            formats={formats} // Optionnel: formats Quill à configurer
                        />
                    </Form.Item>
                </Col>
            </Row>

            <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                    Enregistrer
                </Button>
            </Form.Item>
        </Form>
    );
};

// Optionnel: modules et formats Quill à configurer
const modules = {
    toolbar: [
        [{ 'header': '1'}, { 'header': '2'}, { 'font': [] }],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        ['bold', 'italic', 'underline'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'align': [] }],
        ['link', 'image'],
        ['clean']
    ],
};

const formats = [
    'header', 'font', 'list', 'bullet', 'bold', 'italic', 'underline', 'color', 'background', 'align', 'link', 'image'
];

export default ProjetForm;
