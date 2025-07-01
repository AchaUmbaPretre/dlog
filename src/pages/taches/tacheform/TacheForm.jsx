import { useEffect, useState } from 'react';
import { Button, Form,Card, message, Input, Space, Row, Col, Select, notification, DatePicker, Skeleton, Modal } from 'antd';
import { getDepartement } from '../../../services/departementService';
import { getClient, getProvince } from '../../../services/clientService';
import { getFrequence } from '../../../services/frequenceService';
import { getUser } from '../../../services/userService';
import { PlusOutlined } from '@ant-design/icons';
import { getTacheOneV, postTache, putTache } from '../../../services/tacheService';
import moment from 'moment';
import { getBatiment, getCatTache, getCorpsMetier } from '../../../services/typeService';
import { useNavigate } from 'react-router-dom';
import { getProjetOne } from '../../../services/projetService';
import './tacheForm.scss'
import { getPriorityIcon } from '../../../utils/prioriteIcons';
import 'froala-editor/css/froala_editor.pkgd.min.css';
import 'froala-editor/css/froala_style.min.css';
import FroalaEditor from 'react-froala-wysiwyg'
import DepartementForm from '../../departement/departementForm/DepartementForm';
import FormUsers from '../../users/formUsers/FormUsers';
import BatimentForm from '../../batiment/batimentForm/BatimentForm';
import CorpsMetierForm from '../../corpsMetier/corpsMetierForm/CorpsMetierForm';
import ListeCatTacheForm from '../../listCatTache/listeCatTacheForm/ListeCatTacheForm';
import ClientForm from '../../client/clientForm/ClientForm';
import { useSelector } from 'react-redux';

const TacheForm = ({idControle, idProjet, idTache, closeModal,fetchData, fetchDatas, idInspection}) => {
    const [form] = Form.useForm();
    const [departement, setDepartement] = useState([]);
    const [client, setClient] = useState([]);
    const [frequence, setFrequence] = useState([]);
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [provinces, setProvinces] = useState([]);
    const [batiment, setBatiment] = useState([]);
    const [projetName, setProjetName] = useState([]);
    const [catTache, setCatTache] = useState([]);
    const [categories, setCategories] = useState([]);
    const [corps, setCorps] = useState([]);
    const [loadingData, setLoadingData] = useState(true);
    const navigate = useNavigate();
    const [editorContent, setEditorContent] = useState('');
    const [totalCost, setTotalCost] = useState(0);
    const [modalType, setModalType] = useState(null);
    const userId = useSelector((state) => state.user?.currentUser?.id_utilisateur);
    const isDarkMode = localStorage.getItem('theme') === 'dark';

    const handlDepartement = () => openModal('AddDepartement');
    const handOwner = () => openModal('AddOwner');
    const handlDemandeur = () => openModal('AddDemandeur');
    const handlEntite = () => openModal('AddEntite');
    const handlCorpsMetier = () => openModal('AddCorpsMetier');
    const handlCatTache = () => openModal('AddCatTache');
    const handlClient= () => openModal('AddClient');

    
    const closeAllModals = () => {
        setModalType(null);
    };
      
    const openModal = (type) => {
        closeAllModals();
        setModalType(type);
    };

    const handleEditorChange = (content) => {
        setEditorContent(content);
        form.setFieldsValue({ description: content });
    };

    const fetchDataAll = async () => {
        setLoadingData(true);

        try {
            const [departementData, frequenceData, usersData, clientData, provinceData, batimentData, corpsData, catTacheData] = await Promise.all([
                getDepartement(),
                getFrequence(),
                getUser(),
                getClient(),
                getProvince(),
                getBatiment(),
                getCorpsMetier(),
                getCatTache()
            ]);

                setDepartement(departementData.data);
                setFrequence(frequenceData.data);
                setUsers(usersData.data);
                setClient(clientData.data);
                setProvinces(provinceData.data);
                setBatiment(batimentData.data);
                setCorps(corpsData.data)
                setCatTache(catTacheData.data)

                if(idProjet){
                    const {data} = await getProjetOne(idProjet)
                    setProjetName(data.projet[0]?.nom_projet)
                }

                if(idTache){
                    const { data: tache } = await getTacheOneV(idTache);
                    
                    if (tache && tache[0]) {
                        setEditorContent(tache[0].description);
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
                }

            } catch (error) {
                console.log(error)
            }finally {
                setLoadingData(false); 
            }
        };
    
    useEffect(() => {
        fetchDataAll();
    }, [idTache,idProjet,form]);

    useEffect(() => {
        form.resetFields();
        setEditorContent();
      }, [idTache, idProjet, form]);

    const handleCategoryChange = (index, field, value) => {
        const updatedCategories = [...categories];
        updatedCategories[index][field] = value;

        if (field === 'cout') {
            calculateTotalCost(updatedCategories);
        }
        setCategories(updatedCategories);
    };

    // Calculate total cout dynamically
    const calculateTotalCost = (categories) => {
        const total = categories.reduce((acc, curr) => acc + (curr.cout ? parseFloat(curr.cout) : 0), 0);
        setTotalCost(total);
    };

    // Ajouter nouvelle categorie
    const handleAddCategory = () => {
        setCategories([...categories, { id_cat: null, cout: 0 }]);
    };

    const onFinish = async (values) => {

        if (isLoading) return;

        const loadingKey = 'loadingTache';
        message.loading({ content: 'Traitement en cours, veuillez patienter...', key: loadingKey, duration: 0 });
            
        const dataAll = {
            ...values,
            id_control : idControle,
            id_projet: idProjet,
            user_cr: userId,
            idInspection: idInspection,
            categories
        }
        setIsLoading(true);
        try {
            if(idTache) {
                await putTache(idTache, dataAll);
                message.success({ content: "La tache a été mise a jour avec succès.", key: loadingKey });
            }
            else{
                await postTache(dataAll);
                message.success({ content: "La tache a été enregistrée avec succès.", key: loadingKey });
            }
            notification.success({
                message: 'Succès',
                description: 'Les informations ont été enregistrées avec succès.',
            });
            form.resetFields();
            navigate('/tache')
            closeModal();
            fetchData();
            fetchDatas();
            setEditorContent();
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="controle_form" style={{background: isDarkMode ? '#1e1e1e' : '#fff' }}>
            <div className="controle_title_rows">
                <h2 className='controle_h2'>{ idTache ? 'Modifier une tâche' : idProjet ? `Insérer une nouvelle tache dans le projet  "${projetName}"` : 'Ajouter une nouvelle tâche'}</h2>                
            </div>
            <div className="controle_wrapper" >
                <Form
                    form={form}
                    layout="vertical"
                    autoComplete="off"
                    onFinish={onFinish}
                >
                    <Card>
                        <Row gutter={24}>
                            
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
                                    {loadingData ? <Skeleton.Input active={true} /> : 
                                    <Select
                                        showSearch
                                        options={departement.map((item) => ({
                                            value: item.id_departement,
                                            label: item.nom_departement,
                                        }))}
                                        placeholder="Sélectionnez un département..."
                                        optionFilterProp="label"
                                    />}
                                </Form.Item>
                                <Button 
                                    style={{ width:'19px', height:'19px' }}
                                    icon={<PlusOutlined style={{fontSize:'9px', margin:'0 auto'}} />}
                                    onClick={handlDepartement}
                                >
                                </Button>
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
                                <Button 
                                    style={{ width:'19px', height:'19px' }}
                                    icon={<PlusOutlined style={{fontSize:'9px', margin:'0 auto'}} />}
                                    onClick={handlClient}
                                >
                                </Button>
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
                                    {loadingData ? <Skeleton.Input active={true} /> : 
                                    <Select
                                        allowClear
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
                                    {loadingData ? <Skeleton.Input active={true} /> : 
                                    <Select
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
                                    {loadingData ? <Skeleton.Input active={true} /> :                                 
                                    <Select
                                        showSearch
                                        options={users.map((item) => ({
                                            value: item.id_utilisateur,
                                            label: [item.prenom, item.nom].filter(Boolean).join(' - '),
                                        }))}
                                        placeholder="Sélectionnez un responsable..."
                                        optionFilterProp="label"
                                    />}
                                </Form.Item>
                                <Button 
                                    style={{ width:'19px', height:'19px' }}
                                    icon={<PlusOutlined style={{fontSize:'9px', margin:'0 auto'}} />}
                                    onClick={handOwner}
                                >
                                </Button>
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
                                    {loadingData ? <Skeleton.Input active={true} /> :                                 
                                    <Select
                                        showSearch
                                        options={users.map((item) => ({
                                            value: item.id_utilisateur,
                                            label: [item.prenom, item.nom].filter(Boolean).join(' - '),
                                        }))}
                                        placeholder="Sélectionnez un demandeur..."
                                        optionFilterProp="label"
                                    />}
                                    
                                </Form.Item>
                                <Button 
                                    style={{ width:'19px', height:'19px' }}
                                    icon={<PlusOutlined style={{fontSize:'9px', margin:'0 auto'}} />}
                                    onClick={handlDemandeur}
                                >
                                </Button>
                            </Col>

                            <Col xs={24} md={8}>
                                <Form.Item
                                    name="id_batiment"
                                    label="Entité"
                                    rules={[
                                        {
                                            required: false
                                        },
                                    ]}
                                >
                                    {loadingData ? <Skeleton.Input active={true} /> :                                 
                                    <Select
                                        placeholder="Sélectionnez un bâtiment"
                                        showSearch
                                        options={batiment?.map((item) => ({
                                            value: item.id_batiment,
                                            label: item.nom_batiment,
                                        }))}
                                        optionFilterProp="label"
                                    />}
                                </Form.Item>
                                <Button 
                                    style={{ width:'19px', height:'19px' }}
                                    icon={<PlusOutlined style={{fontSize:'9px', margin:'0 auto'}} />}
                                    onClick={handlEntite}
                                >
                                </Button>
                            </Col>
                            <Col xs={24} md={8}>
                                <Form.Item
                                    name="id_corps_metier"
                                    label="Corps metier"
                                    rules={[
                                        {
                                            required: false
                                        }
                                    ]}
                                >
                                    {loadingData ? <Skeleton.Input active={true} /> :                                 <Select
                                        placeholder="Sélectionnez.."
                                        showSearch
                                        options={corps?.map((item) => ({
                                            value: item.id_corps_metier,
                                            label: item.nom_corps_metier
                                        }))}
                                    />}
                                </Form.Item>
                                <Button 
                                    style={{ width:'19px', height:'19px' }}
                                    icon={<PlusOutlined style={{fontSize:'9px', margin:'0 auto'}} />}
                                    onClick={handlCorpsMetier}
                                >
                                </Button>
                            </Col>

                            <Col xs={24} md={8}>
                                <Form.Item
                                    name="id_cat_tache"
                                    label="Cat tache"
                                    rules={[
                                        {
                                            required: false
                                        },
                                    ]}
                                >
                                    {loadingData ? <Skeleton.Input active={true} /> :                                 
                                    <Select
                                        placeholder="Sélectionnez.."
                                        showSearch
                                        options={catTache?.map((item) => ({
                                            value: item.id_cat_tache,
                                            label: item.nom_cat_tache
                                        }))}
                                    />}
                                </Form.Item>
                                <Button 
                                    style={{ width:'19px', height:'19px' }}
                                    icon={<PlusOutlined style={{fontSize:'9px', margin:'0 auto'}} />}
                                    onClick={handlCatTache}
                                >
                                </Button>
                            </Col>

                            <Col xs={24} md={24}>
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
                                            required: true,
                                            message: 'Veuillez fournir une description.',
                                        },
                                    ]}
                                >
                                    {loadingData ? (
                                        <Skeleton.Input active={true} />
                                    ) : (
                                        <FroalaEditor
                                            tag='textarea'
                                            model={editorContent}
                                            onModelChange={handleEditorChange}
                                            config={{
                                            toolbarButtons: [
                                                    'bold', 
                                                    'italic', 
                                                    'underline', 
                                                    '|', 
                                                    'insertLink', 
                                                    'insertImage', 
                                                    'insertHR', 
                                                    '|', 
                                                    'undo', 
                                                    'redo', 
                                                    '|', 
                                                    'paragraphFormat',
                                                    'align',
                                                    'insertTable',
                                                    'clearFormatting'
                                                ],
                                                height: 150,
                                                placeholder: 'Entrez votre description ici...'
                                            }}
                                        />
                                    )}
                                </Form.Item>
                            </Col>
                            
                            {categories.map((category, index) => (
                                <Card 
                                    key={index} 
                                    title={`Catégorie ${index + 1}`} 
                                    style={{ marginBottom: 16 }}
                                >
                                    <Row gutter={12}>
                                        <Col xs={24} md={12}>
                                            <Form.Item label="Catégorie" style={{ marginBottom: 0 }}>
                                                <Select
                                                    showSearch
                                                    placeholder="Sélectionnez une catégorie"
                                                    value={category.id_cat}
                                                    onChange={(value) => handleCategoryChange(index, 'id_cat', value)}
                                                    options={catTache.map((item) => ({
                                                        value: item.id_cat_tache,
                                                        label: item.nom_cat_tache,
                                                    }))}
                                                    optionFilterProp="label"
                                                />
                                            </Form.Item>
                                        </Col>
                                        <Col xs={24} md={12}>
                                            <Form.Item label="Coût" style={{ marginBottom: 0 }}>
                                                <Input
                                                    type="number"
                                                    placeholder="Entrez le coût"
                                                    value={category.cout}
                                                    onChange={(e) => handleCategoryChange(index, 'cout', e.target.value)}
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </Card>
                            ))}
                            <Button 
                                type="dashed" 
                                onClick={handleAddCategory} 
                                style={{ marginBottom: 16, marginLeft:10 }}
                            >
                                Ajouter une catégorie
                            </Button>

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
                    </Card>
                </Form>
            </div>

            <Modal
                title=""
                visible={modalType === 'AddDepartement'}
                onCancel={closeAllModals}
                footer={null}
                width={900}
                centered
            >
                <DepartementForm id_departement={''} closeModal={() => setModalType(null)} fetchData={fetchDataAll } />
            </Modal>

            <Modal
                title=""
                visible={modalType === 'AddOwner'}
                onCancel={closeAllModals}
                footer={null}
                width={900}
                centered
            >
                <FormUsers userId={''} close={()=> setModalType(null)} fetchData={fetchDataAll}/>
            </Modal>
            
            <Modal
                title=""
                visible={modalType === 'AddDemandeur'}
                onCancel={closeAllModals}
                footer={null}
                width={900}
                centered
            >
                <FormUsers userId={''} close={()=> setModalType(null)} fetchData={fetchDataAll}/>
            </Modal>
            <Modal
                title=""
                visible={modalType === 'AddEntite'}
                onCancel={closeAllModals}
                footer={null}
                width={900}
                centered
            >
                <BatimentForm idBatiment={''} closeModal={()=>setModalType(null)} fetchData={fetchDataAll}/>
            </Modal>
            <Modal
                title=""
                visible={modalType === 'AddCorpsMetier'}
                onCancel={closeAllModals}
                footer={null}
                width={700}
                centered
            >
                <CorpsMetierForm idCorps={''} closeModal={() => setModalType(null)} fetchData={fetchDataAll}/>
            </Modal>
            <Modal
                title=""
                visible={modalType === 'AddCatTache'}
                onCancel={closeAllModals}
                footer={null}
                width={700}
                centered
            >
                <ListeCatTacheForm idCat={''} close={()=> setModalType(null)} fetchData={fetchDataAll}/>
            </Modal>
            <Modal
                title=""
                visible={modalType === 'AddClient'}
                onCancel={closeAllModals}
                footer={null}
                width={800}
                centered
            >
                <ClientForm closeModal={() => setModalType(null)} idClient={''} fetchData={fetchDataAll} />
            </Modal>
        </div>
    );
};

export default TacheForm;