import { useEffect, useState } from 'react'
import moment from 'moment';
import { UploadOutlined } from '@ant-design/icons';
import Cropper from 'react-easy-crop';
import { Button, Form, Upload, Input, Card, Row, Col, Select, DatePicker, Skeleton, InputNumber, Space, message, Modal } from 'antd';
import { getDisposition, getLubrifiant, getTypeCarburant } from '../../../../../services/charroiService';
import { getGenerateurOne, getMarqueGenerateur, getModeleGenerateurOne, getRefroidissement, getTypeGenerateur, postGenerateur, putGenerateur } from '../../../../../services/generateurService';
import getCroppedImg from '../../../../../utils/getCroppedImg';
import ConfirmModal from '../../../../../components/confirmModal/ConfirmModal';
import { useSelector } from 'react-redux';

const GenerateurForm = ({id_generateur, closeModal, fetchData}) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(false);
    const [disposition, setDisposition] = useState([]);
    const [typeCarburant, setTypeCarburant] = useState([]);
    const [lubrifiant, setLubrifiant] = useState([]);
    const [marque, setMarque] = useState([]);
    const [iDmarque, setIdMarque] = useState('');
    const [fileList, setFileList] = useState([]);
    const [previewImage, setPreviewImage] = useState('');
    const [cropping, setCropping] = useState(false);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [modele, setModele] = useState([]);
    const [geneType, setGeneType] = useState([]);
    const [refroidissement, setRefroidissement] = useState([]);
    const [confirmationMessage, setConfirmationMessage] = useState(""); // Message spécifique 409
    const [pendingPayload, setPendingPayload] = useState(null);
    const [confirmVisible, setConfirmVisible] = useState(false);
    const userId = useSelector((state) => state.user?.currentUser?.id_utilisateur);

    const fetchDatas = async () => {
        setLoadingData(true)
        try {
            const [marqueData, dispoData, carburantData, typeGeneData, refroiData, lubriData] = await Promise.all([
                getMarqueGenerateur(),
                getDisposition(),
                getTypeCarburant(),
                getTypeGenerateur(),
                getRefroidissement(),
                getLubrifiant()
            ])

            setMarque(marqueData.data)
            setDisposition(dispoData.data)
            setTypeCarburant(carburantData.data)
            setGeneType(typeGeneData.data)
            setRefroidissement(refroiData.data)
            setLubrifiant(lubriData.data)

            if(iDmarque) {
                const { data : m} = await getModeleGenerateurOne(iDmarque)
                setModele(m)
            } 

            if(id_generateur) {
                const { data : gen } = await getGenerateurOne(id_generateur)
                form.setFieldsValue({
                    ...gen[0],
                    annee_fabrication : moment(gen[0]?.annee_fabrication),
                    annee_service : moment(gen[0]?.annee_service),
                    
                })
            }
            
        } catch (error) {
            console.log(error);
        } finally {
            setLoadingData(false)
        }
    }

    useEffect(()=> {
        fetchDatas()
    }, [iDmarque])

    const handleSubmit = (values) => {
        const payload = {
            ...values,
            user_cr: userId,
            id_generateur : id_generateur
        };

        setPendingPayload(payload);
        setConfirmationMessage("Voulez-vous vraiment enregistrer ces informations générateur ?");
        setConfirmVisible(true);
    }
    const onFinish = async (values) => {
        if (!pendingPayload) return;

        setLoading(true)
        try {
            message.loading({ content: 'En cours...', key: 'submit' });

            if(pendingPayload.date_service) {
                pendingPayload.date_service =  pendingPayload.date_service ? moment(pendingPayload.date_service).format('YYYY-MM-DD') : null;

            }
            if (fileList.length > 0) {
                pendingPayload.img = fileList[0].originFileObj;
            }
            if (pendingPayload.annee_circulation) {
                pendingPayload.annee_circulation = pendingPayload.annee_circulation.format("YYYY");
            }
            if (pendingPayload.annee_fabrication) {
                pendingPayload.annee_fabrication = pendingPayload.annee_fabrication.format("YYYY");
            }

            if(id_generateur) {
                await putGenerateur(pendingPayload)
            }
            await postGenerateur(pendingPayload)

            message.success({ content: id_generateur ? 'Le générateur a été modifié avec succès' :  'le générateur a été ajouté avec succès!', key: 'submit' });

            form.resetFields();
            closeModal();
            fetchData();

            setConfirmVisible(false);
            setPendingPayload(null);
        } catch (error) {
            message.error({ content: 'Une erreur est survenue.', key: 'submit' });
            console.error('Erreur lors de l\'ajout du chauffeur:', error);
            setConfirmVisible(false);
            setPendingPayload(null);
        } finally {
            setLoading(false);
        }
    }

    const handleUploadChange = ({ fileList }) => {
        // Empêche qu'AntD ajoute plusieurs images
        const limitedList = fileList.slice(-1);

        setFileList(limitedList);

        if (limitedList.length > 0) {
            setPreviewImage(URL.createObjectURL(limitedList[0].originFileObj));
            setCropping(true);
        }
    };

   
    const onCropComplete = (croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
      };
    
      const handleCrop = async () => {
        try {
            const cropped = await getCroppedImg(previewImage, croppedAreaPixels);
            const croppedFile = new File(
                [await fetch(cropped).then((r) => r.blob())],
                'cropped-image.jpg',
                { type: 'image/jpeg' }
            );
    
            setFileList([
                {
                    uid: '-1',
                    name: 'cropped-image.jpg',
                    status: 'done',
                    url: cropped,
                    originFileObj: croppedFile,
                },
            ]);
    
            setCropping(false);
        } catch (e) {
            console.error('Error cropping image:', e);
        }
    };

  return (
    <>
        <div className="controle_form">
            <div className="controle_title_rows">
                <h2 className="controle_h2">{ id_generateur ? 'MODIFIER UN GENERATEUR' : 'FORM GENERATEUR'}</h2>
            </div>
            <div className="controle_wrapper">
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit }
                >
                    <Row gutter={24}>
                        <Card type="inner" title="IDENTIFICATION" style={{width:'100%', marginBottom:'20px'}}>
                            <Row gutter={12}>
                                <Col xs={24} md={8}>
                                        <Form.Item
                                            name="code_groupe"
                                            label="Code groupe"
                                            rules={[
                                                {
                                                    required: false,
                                                    message: 'Veuillez fournir un code... ',
                                                },
                                            ]}
                                        >
                                            {loadingData ? <Skeleton.Input active={true} /> : <Input placeholder="Entrer le code groupe" />}
                                        </Form.Item>
                                </Col>

                                <Col xs={24} md={8}>
                                        <Form.Item
                                            name="id_type_gen"
                                            label="Type générateur"
                                            rules={[
                                                {
                                                    required: false,
                                                    message: 'Veuillez fournir un générateur...',
                                                },
                                            ]}
                                        >
                                            {
                                                loadingData ? <Skeleton.Input active={true} /> : 
                                                <Select
                                                    showSearch
                                                    allowClear
                                                    options={geneType.map((item) => ({
                                                        value: item.id_type_generateur,
                                                        label: item.nom_type_gen,
                                                    }))}
                                                    placeholder="Sélectionnez un lubrifiant..."
                                                    optionFilterProp="label"
                                                />
                                            }
                                        </Form.Item>
                                </Col>

                                <Col xs={24} md={8}>
                                        <Form.Item
                                            name="id_marque"
                                            label="Marque du générateur"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Veuillez fournir une marque...',
                                                },
                                            ]}
                                        >
                                        {
                                            loadingData ? <Skeleton.Input active={true} /> : 
                                            <Select
                                                showSearch
                                                allowClear
                                                options={marque.map((item) => ({
                                                    value: item.id_marque_generateur                                           ,
                                                    label: item?.nom_marque,
                                                }))}
                                                placeholder="Sélectionnez une marque..."
                                                optionFilterProp="label"
                                                onChange={(value)=> setIdMarque(value)}
                                            />
                                        }
                                        </Form.Item>
                                </Col> 
                                { iDmarque && 
                                <Col xs={24} md={8}>
                                        <Form.Item
                                            name="id_modele"
                                            label="Modèle"
                                            rules={[
                                                {
                                                    required: false,
                                                    message: 'Veuillez fournir un modèle...',
                                                },
                                            ]}
                                        >
                                            {
                                                loadingData ? <Skeleton.Input active={true} /> :
                                                <Select
                                                    showSearch
                                                    allowClear
                                                    options={modele.map((item) => ({
                                                            value: item.id_modele_generateur,
                                                            label: item.nom_modele,
                                                    }))}
                                                    placeholder="Sélectionnez un modèle..."
                                                    optionFilterProp="label"
                                                />
                                            }

                                        </Form.Item>
                                </Col> }
                            </Row>
                        </Card>

                        <Card type="inner" title="DIMENSIONS ET POIDS" style={{width:'100%', marginBottom:'20px'}}>
                            <Row gutter={12}>
                                <Col xs={24} md={8}>
                                    <Form.Item
                                        name="longueur"
                                        label="Longueur"
                                        rules={[
                                            {
                                                required: false,
                                                message: 'Veuillez fournir une longueur...',
                                            },
                                        ]}
                                    >
                                    {loadingData ? <Skeleton.Input active={true} /> : <InputNumber placeholder="Entrer la longueur" style={{width:'100%'}} />}
                                    </Form.Item>
                                </Col>

                                <Col xs={24} md={8}>
                                    <Form.Item
                                        name="largeur"
                                        label="Largeur"
                                        rules={[
                                            {
                                                required: false,
                                                message: 'Veuillez fournir une largeur...',
                                            },
                                        ]}
                                    >
                                    {loadingData ? <Skeleton.Input active={true} /> : <InputNumber placeholder="Entrer la largeur" style={{width:'100%'}} />}
                                    </Form.Item>
                                </Col>

                                <Col xs={24} md={8}>
                                    <Form.Item
                                        name="poids"
                                        label="Poids"
                                        rules={[
                                            {
                                                required: false,
                                                message: 'Veuillez fournir un poids...',
                                            },
                                        ]}
                                    >
                                    {loadingData ? <Skeleton.Input active={true} /> : <InputNumber placeholder="Entrer le poids..." style={{width:'100%'}} />}
                                    </Form.Item>
                                </Col>

                                <Col xs={24} md={8}>
                                    <Form.Item
                                        name="reservoir"
                                        label="Reservoir"
                                        rules={[
                                            {
                                                required: false,
                                                message: '1000',
                                            },
                                        ]}
                                    >
                                        {loadingData ? <Skeleton.Input active={true} /> : <InputNumber placeholder="100"  style={{width:'100%'}} />}
                                    </Form.Item>
                                </Col>

                                <Col xs={24} md={8}>
                                    <Form.Item
                                        name="capacite_radiateur"
                                        label="Capacité radiateur"
                                        rules={[
                                            {
                                                required: false,
                                                message: 'Veuillez fournir la capacité du radiateur...',
                                            },
                                        ]}
                                    >
                                    {loadingData ? <Skeleton.Input active={true} /> : <InputNumber placeholder="Entrer la capacité du radiateur..." style={{width:'100%'}} />}
                                    </Form.Item>
                                </Col>

                                <Col xs={24} md={8}>
                                    <Form.Item
                                        name="capacite_carter"
                                        label="Capacité carter"
                                        rules={[
                                            {
                                                required: false,
                                                message: 'Veuillez fournir une capacité carter...',
                                            },
                                        ]}
                                    >
                                    {loadingData ? <Skeleton.Input active={true} /> : <InputNumber placeholder="Entrer la capacité cartel..." style={{width:'100%'}} />}
                                    </Form.Item>
                                </Col>

                                <Col xs={24} md={8}>
                                    <Form.Item
                                        name="cos_phi"
                                        label="Facteur de puissance(cos_phi)"
                                        rules={[
                                            {
                                                required: false,
                                                message: 'Veuillez fournir le facteur de puissance...',
                                            },
                                        ]}
                                    >
                                    {loadingData ? <Skeleton.Input active={true} /> : <InputNumber placeholder="Entrer le facteur de puissance..." style={{width:'100%'}} />}
                                    </Form.Item>
                                </Col>

                                <Col xs={24} md={8}>
                                    <Form.Item
                                        name="nbr_phase"
                                        label="Nombre de phase"
                                        rules={[
                                            {
                                                required: false,
                                                message: 'Veuillez fournir un nombre de moteur...',
                                            },
                                        ]}
                                    >
                                    {loadingData ? <Skeleton.Input active={true} /> : <InputNumber placeholder="Entrer le nombre de moteur..." style={{width:'100%'}} />}
                                    </Form.Item>
                                </Col>

                                <Col xs={24} md={8}>
                                <Form.Item name="img" label="Image du générateur">
                                    <Upload
                                        accept="image/*"
                                        listType="picture-card"
                                        maxCount={1}
                                        fileList={fileList}
                                        onChange={handleUploadChange}
                                        beforeUpload={() => false}
                                    >
                                        {fileList.length < 1 && (
                                            <Button icon={<UploadOutlined style={{margin: 0, width:'100%', height:'100%'}} />} />
                                        )}
                                    </Upload>
                                </Form.Item>
                            </Col>

                            </Row>
                        </Card>

                        <Card type="inner" title="MOTEUR" style={{width:'100%', marginBottom:'20px'}}>
                            <Row gutter={12}>
                                <Col xs={24} md={8}>
                                    <Form.Item
                                        name="cylindre"
                                        label="Cylindre"
                                        rules={[
                                            {
                                                required: false,
                                                message: 'Veuillez fournir le cylindre...',
                                            },
                                        ]}
                                    >
                                    {loadingData ? <Skeleton.Input active={true} /> : <InputNumber placeholder="Entrer le cylindre..." style={{width:'100%'}} />}
                                    </Form.Item>
                                </Col>

                                <Col xs={24} md={8}>
                                    <Form.Item
                                        name="nbre_cylindre"
                                        label="Nombre de cylindre"
                                        rules={[
                                            {
                                                required: false,
                                                message: 'Veuillez fournir le Nombre de cylindre...',
                                            },
                                        ]}
                                    >
                                    {loadingData ? <Skeleton.Input active={true} /> : <InputNumber min={0} placeholder="Entrer le Nombre de cylindre..." style={{width:'100%'}} />}
                                    </Form.Item>
                                </Col>

                                <Col xs={24} md={8}>
                                    <Form.Item
                                        name="disposition_cylindre"
                                        label="Disposition"
                                        rules={[
                                            {
                                                required: false,
                                                message: 'Veuillez fournir une disposition...',
                                            },
                                        ]}
                                    >
                                        { loadingData ? <Skeleton.Input active={true} /> : 
                                            <Select
                                                showSearch
                                                allowClear
                                                options={disposition.map((item) => ({
                                                        value: item.id_disposition_cylindre                                          ,
                                                        label: item.nom_disposition,
                                                }))}
                                                placeholder="Sélectionnez une disposition..."
                                                optionFilterProp="label"
                                            />
                                        }
                                    </Form.Item>
                                </Col>

                                <Col xs={24} md={8}>
                                    <Form.Item
                                        name="id_type_carburant"
                                        label="Type carburant"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Veuillez fournir un type du carburant...',
                                            },
                                        ]}
                                    >
                                        { loadingData ? <Skeleton.Input active={true} /> : 
                                        <Select
                                            showSearch
                                            allowClear
                                            options={typeCarburant.map((item) => ({
                                                    value: item.id_type_carburant                                          ,
                                                    label: item.nom_type_carburant,
                                            }))}
                                            placeholder="Sélectionnez un type de carburant..."
                                            optionFilterProp="label"
                                        />
                                        }
                                    </Form.Item>
                                </Col>

                                <Col xs={24} md={8}>
                                    <Form.Item
                                        name="regime_moteur"
                                        label="Regime moteur"
                                        rules={[
                                            {
                                                required: false,
                                                message: 'Veuillez fournir un regime moteur...',
                                            },
                                        ]}
                                    >
                                        {loadingData ? <Skeleton.Input active={true} /> : <Input min={0} placeholder="Saisir le regime moteur" />}
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Card>

                        <Card type="inner" title="INFORMATION COMPLEMENTAIRES" style={{width:'100%', marginBottom:'20px'}}>
                            <Row gutter={12}>
                              
                                <Col xs={24} md={8}>
                                    <Form.Item
                                        name="date_service"
                                        label="Mise en service"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Veuillez fournir une date service...',
                                            },
                                        ]}
                                        initialValue={moment()}
                                    >
                                    {loadingData ? <Skeleton.Input active={true} /> : <DatePicker style={{width:'100%'}} format="YYYY-MM-DD" />}
                                    </Form.Item>
                                </Col>

                                <Col xs={24} md={8}>
                                    <Form.Item
                                        name="annee_fabrication"
                                        label="Année de fabrication"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Veuillez fournir un numero de chassis',
                                            },
                                        ]}
                                    >
                                        {loadingData ? <Skeleton.Input active={true} /> :  
                                            <DatePicker 
                                                picker="year" 
                                                style={{width:'100%'}}
                                                placeholder="Sélectionnez une année" 
                                            />
                                        }
                                    </Form.Item>
                                </Col>

                                <Col xs={24} md={8}>
                                    <Form.Item
                                        name="puissance"
                                        label="Puissance"
                                        rules={[
                                            {
                                                required: false,
                                                message: 'Veuillez fournir la puissance...',
                                            },
                                        ]}
                                    >
                                        {loadingData ? <Skeleton.Input active={true} /> : <InputNumber min={0} placeholder="Saisir la puissance" style={{width:'100%'}}/>}
                                    </Form.Item>
                                </Col>

                                <Col xs={24} md={8}>
                                    <Form.Item
                                        name="tension"
                                        label="Tension"
                                        rules={[
                                            {
                                                required: false,
                                                message: 'Veuillez fournir la tension...',
                                            },
                                        ]}
                                    >
                                        {loadingData ? <Skeleton.Input active={true} /> : <InputNumber min={0} placeholder="Saisir la tension" style={{width:'100%'}}/>}
                                    </Form.Item>
                                </Col>

                                <Col xs={24} md={8}>
                                    <Form.Item
                                        name="refroidissement"
                                        label="Refroidissement"
                                        rules={[
                                            {
                                                required: false,
                                                message: 'Veuillez fournir un refroidissement...',
                                            },
                                        ]}
                                    >
                                        { loadingData ? <Skeleton.Input active={true} /> : 
                                        <Select
                                            showSearch
                                            allowClear
                                            options={refroidissement .map((item) => ({
                                                    value: item.id_refroidissement,
                                                    label: item.nom_refroidissement,
                                            }))}
                                            placeholder="Sélectionnez un type des refroidissement..."
                                            optionFilterProp="label"
                                        />
                                        }
                                    </Form.Item>
                                </Col>

                                <Col xs={24} md={8}>
                                    <Form.Item
                                        name="valeur_acquisition"
                                        label="Valeur d'acquisition"
                                        rules={[
                                            {
                                                required: false,
                                                message: 'Veuillez fournir la valeur d acquisition...',
                                            },
                                        ]}
                                    >
                                        {loadingData ? <Skeleton.Input active={true} /> : <InputNumber min={0} placeholder="Saisir la valeur d acquisition" style={{width:'100%'}}/>}
                                    </Form.Item>
                                </Col>

                                <Col xs={24} md={8}>
                                    <Form.Item
                                        name="lubrifiant_moteur"
                                        label="Lubrifiant"
                                        rules={[
                                            {
                                                required: false,
                                                message: 'Veuillez fournir un lubrifiant moteur...',
                                            },
                                        ]}
                                    >
                                        {
                                            loadingData ? <Skeleton.Input active={true} /> : 
                                            <Select
                                                showSearch
                                                allowClear
                                                options={lubrifiant.map((item) => ({
                                                    value: item.id_lubrifiant                                          ,
                                                    label: item.nom_lubrifiant,
                                                }))}
                                                placeholder="Sélectionnez un lubrifiant..."
                                                optionFilterProp="label"
                                            />
                                        }
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Card>
                        <Col xs={24}>
                            <Form.Item>
                                <Space className="button-group">
                                    <Button type="primary" htmlType="submit" loading={loading} disabled={loading}>
                                        {id_generateur? 'Modifier' : 'Ajouter'}
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
            <Modal
                visible={cropping}
                title="Rogner l'image"
                onCancel={() => setCropping(false)}
                onOk={handleCrop}
                okText="Rogner"
                cancelText="Annuler"
                width={800}
            >
                <div style={{ position: 'relative', height: 400 }}>
                    <Cropper
                        image={previewImage}
                        crop={crop}
                        zoom={zoom}
                        aspect={1}
                        onCropChange={setCrop}
                        onZoomChange={setZoom}
                        onCropComplete={onCropComplete}
                    />
                </div>
            </Modal>
        </div>
        <ConfirmModal
            visible={confirmVisible}
            title={"Confirmer l'enregistrement"}
            content={confirmationMessage}
            onConfirm={onFinish}
            onCancel={() => {
            setConfirmVisible(false);
            setPendingPayload(null);
            }}
            loading={loading}
        />
    </>
  )
}

export default GenerateurForm;