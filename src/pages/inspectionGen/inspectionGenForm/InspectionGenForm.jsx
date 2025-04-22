import React, { useEffect, useRef, useState } from 'react'
import { Form, Row, Divider, Card, Col, Upload, message, notification, InputNumber, Skeleton, Select, Button, Input, DatePicker } from 'antd';
import { SendOutlined, UploadOutlined, PlusCircleOutlined, MinusCircleOutlined, CheckCircleOutlined, CloseCircleOutlined, ShopOutlined, WarningOutlined, UserOutlined  } from '@ant-design/icons';
import { getCarateristiqueRep, getChauffeur, getStatutVehicule, getTypeReparation, getVehicule, postInspectionGen } from '../../../services/charroiService';
import { getFournisseur } from '../../../services/fournisseurService';
import { useSelector } from 'react-redux';
import { getCat_inspection } from '../../../services/batimentService';
import { Rnd } from 'react-rnd';
import { icons } from '../../../utils/prioriteIcons';
import html2canvas from 'html2canvas';

const InspectionGenForm = ({closeModal, fetchData}) => {
    const [form] = Form.useForm();
    const [ loading, setLoading ] = useState(false);
    const [ chauffeur, setChauffeur ] = useState([]);
    const [ vehicule, setVehicule ] = useState([]);
    const [cat, setCat] = useState([]);
    const [catRep, setCatRep] = useState([]);
    const [ loadingData, setLoadingData ] = useState(false);
    const [ fournisseur, setFournisseur ] = useState([]);
    const [ reparation, setReparation ] = useState([]);
    const [ statut, setStatut ] = useState([]);
    const userId = useSelector((state) => state.user?.currentUser?.id_utilisateur);
    const canvasRef = useRef(null);
    const [uploadedImage, setUploadedImage] = useState(null);
    const [uploadedImages, setUploadedImages] = useState({});
    const [iconPositionsMap, setIconPositionsMap] = useState({});
    const [iconPositions, setIconPositions] = useState([]);

    const fetchDatas = async () => {

        try {
            const [ vehiculeData, fournisseurData, reparationData, statutData, chauffeurData, catData, catRep] = await Promise.all([
                getVehicule(),
                getFournisseur(),
                getTypeReparation(),
                getStatutVehicule(),
                getChauffeur(),
                getCat_inspection(),
                getCarateristiqueRep()
            ])
            setVehicule(vehiculeData.data.data)
            setFournisseur(fournisseurData.data)
            setReparation(reparationData.data.data)
            setStatut(statutData.data)
            setChauffeur(chauffeurData.data.data)
            setCat(catData.data)
            setCatRep(catRep.data)

        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoadingData(false);
        }
    }

    useEffect(()=> {
        fetchDatas()
    }, [])

    const onFinish = async (values) => {
        await form.validateFields();
    
        const loadingKey = 'loadingReparation';
        message.loading({ content: 'Traitement en cours, veuillez patienter...', key: loadingKey, duration: 0 });
    
        setLoading(true);
    
        try {
            const formData = new FormData();
    
            // Champs principaux
            formData.append('id_vehicule', values.id_vehicule);
            formData.append('id_chauffeur', values.id_chauffeur);
            formData.append('date_inspection', values.date_inspection);
            formData.append('date_prevu', values.date_prevu);
            formData.append('id_statut_vehicule', values.id_statut_vehicule);
            formData.append('kilometrage', values.kilometrage);
            formData.append('user_cr', userId);
    
            // Récupération de l'élément image-container
            const imageContainer = document.querySelector('.image-container');
/*             if (!imageContainer) {
                throw new Error("L'élément .image-container n'a pas été trouvé dans le DOM.");
            } */
    
            // Traitement des réparations
            for (let index = 0; index < values.reparations.length; index++) {
                const rep = values.reparations[index];
                formData.append(`reparations[${index}][id_type_reparation]`, rep.id_type_reparation);
                formData.append(`reparations[${index}][id_cat_inspection]`, rep.id_cat_inspection);
                formData.append(`reparations[${index}][id_carateristique_rep]`, rep.id_carateristique_rep);
                formData.append(`reparations[${index}][montant]`, rep.montant || 0);
                formData.append(`reparations[${index}][commentaire]`, rep.commentaire);
                formData.append(`reparations[${index}][avis]`, rep.avis);
    
                const file = rep.img?.[0]?.originFileObj;
    
                if (file) {
                    // Capture et redimensionnement de l'image
                    const canvas = await html2canvas(imageContainer);
                    const originalWidth = canvas.width;
                    const originalHeight = canvas.height;
    
                    let targetWidth = 500;
                    let targetHeight;
    
                    if (originalWidth < targetWidth) {
                        const ratio = targetWidth / originalWidth;
                        targetHeight = originalHeight * ratio;
                    } else {
                        targetWidth = originalWidth;
                        targetHeight = originalHeight;
                    }
    
                    const resizedCanvas = document.createElement('canvas');
                    const ctx = resizedCanvas.getContext('2d');
                    resizedCanvas.width = targetWidth;
                    resizedCanvas.height = targetHeight;
    
                    ctx.drawImage(canvas, 0, 0, originalWidth, originalHeight, 0, 0, targetWidth, targetHeight);
    
                    const blob = await new Promise((resolve) => resizedCanvas.toBlob(resolve, 'image/png'));
                    const finalFile = new File([blob], `image_${index}.png`, { type: 'image/png' });
                    formData.append(`img_${index}`, finalFile);
                }
            }
    
            await postInspectionGen(formData);
    
            message.success({ content: 'La réparation a été enregistrée avec succès.', key: loadingKey });
            form.resetFields();
            fetchData();
            closeModal();
    
        } catch (error) {
            console.error("Erreur lors de l'ajout de contrôle technique :", error);
            message.error({ content: 'Une erreur est survenue.', key: loadingKey });
    
            notification.error({
                message: 'Erreur',
                description:
                    error.response?.data?.error?.sqlMessage ||
                    error.response?.data?.error?.message ||
                    error.response?.data?.error ||
                    error.message ||
                    'Une erreur est survenue.',
            });
            
        } finally {
            setLoading(false);
        }
    };
    
    const addIcon = (icon) => {
        setIconPositions([...iconPositions, { icon, x: 50, y: 50, width: 50, height: 50 }]);
      };

      const handleImageUpload = (info, fieldName) => {
        const file = info.fileList[0]?.originFileObj;
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setUploadedImages(prev => ({ ...prev, [fieldName]: e.target.result }));
                setIconPositionsMap(prev => ({ ...prev, [fieldName]: [] })); // reset icons
            };
            reader.readAsDataURL(file);
        }
    };

    const addIconToField = (icon, fieldName) => {
        setIconPositionsMap(prev => ({
            ...prev,
            [fieldName]: [...(prev[fieldName] || []), { icon, x: 0, y: 0, width: 50, height: 50 }]
        }));
    };
    
    const updateIconPosition = (fieldName, index, updatedPos) => {
        setIconPositionsMap(prev => {
            const updated = [...(prev[fieldName] || [])];
            updated[index] = { ...updated[index], ...updatedPos };
            return { ...prev, [fieldName]: updated };
        });
    };
    

  return (
    <>
        <div className="controle_form">
            <div className="controle_title_rows">
                <div className="controle_h2">Form inspection</div>
            </div>
            <div className="controle_wrapper">
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                >
                    <Card>
                        <Row gutter={12}>
                            <Col xs={24} md={8}>
                                <Form.Item
                                    label="Véhicule"
                                    name="id_vehicule"
                                    rules={[{ required: false, message: 'Veuillez sélectionner un véhicule' }]}
                                >
                                    { loadingData ? <Skeleton.Input active={true} /> : 
                                    <Select
                                        allowClear
                                        showSearch
                                        options={vehicule.map((item) => ({
                                            value: item.id_vehicule,
                                            label: `${item.immatriculation} / ${item.nom_marque} / ${item.modele}`,
                                        }))}
                                        optionFilterProp="label"
                                        placeholder="Sélectionnez un vehicule..."
                                    /> }
                                </Form.Item>
                            </Col>

                            <Col xs={24} md={8}>
                                <Form.Item
                                    label="Chauffeur"
                                    name="id_chauffeur"
                                    rules={[{ required: false, message: 'Veuillez sélectionner un chauffeur' }]}
                                >
                                    { loadingData ? <Skeleton.Input active={true} /> : 
                                    <Select
                                        allowClear
                                        showSearch
                                        options={chauffeur.map((item) => ({
                                                value: item.id_chauffeur,
                                                label: item.nom,
                                            }))}
                                        optionFilterProp="label"
                                        placeholder="Sélectionnez une categorie..."
                                    />}
                                </Form.Item>
                            </Col>

                            <Col xs={24} md={8}>
                                <Form.Item
                                    name="date_inspection"
                                    label="Date"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Veuillez fournir une date...',
                                        },
                                    ]}
                                >
                                        {loadingData ? (
                                            <Skeleton.Input active={true} />
                                        ) : (
                                            <DatePicker style={{ width: '100%' }} />
                                        )}
                                </Form.Item>
                            </Col>

                            <Col xs={24} md={8}>
                                <Form.Item
                                    name="kilometrage"
                                    label="Kilometrage"
                                    rules={[
                                        {
                                            required: false,
                                            message: 'Veuillez fournir une date...',
                                        },
                                    ]}
                                >
                                        {loadingData ? (
                                            <Skeleton.Input active={true} />
                                        ) : (
                                            <InputNumber style={{width:'100%'}} />
                                        )}
                                </Form.Item>
                            </Col>

                            <Col xs={24} md={8}>
                                <Form.Item
                                    name="date_prevu"
                                    label="Date prevue"
                                    rules={[
                                        {
                                            required: false,
                                            message: 'Veuillez fournir une date...',
                                        },
                                    ]}
                            >
                                {loadingData ? (
                                    <Skeleton.Input active={true} />
                                ) : (
                                    <DatePicker style={{ width: '100%' }} />
                                )}
                                </Form.Item>
                            </Col>

                            <Col xs={24} md={8}>
                                <Form.Item
                                    name="id_statut_vehicule"
                                    label="Statut véhicule"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Veuillez selectionner un statut...',
                                        },
                                    ]}
                                >
                                    {loadingData ? <Skeleton.Input active={true} /> : 
                                    <Select
                                        allowClear
                                        showSearch
                                        options={statut.map((item) => ({
                                            value: item.id_statut_vehicule                                           ,
                                            label: `${item.nom_statut_vehicule}`,
                                        }))}
                                        placeholder="Sélectionnez un statut..."
                                        optionFilterProp="label"
                                    /> }
                                </Form.Item>
                            </Col>
                        </Row>
                    </Card>
                    {/* Réparations dynamiques */}
                    <Form.List name="reparations">
                        {(fields, { add, remove }) => (
                        <>
                            <Divider className='title_row'>Problèmes techniques</Divider>
                            {fields.map(({ key, name, ...restField }) => (
                            <Card style={{marginBottom:'10px'}}>
                                <Row key={key} gutter={12} align="middle">
                                    <Col xs={24} md={8}>
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'id_type_reparation']}
                                            label="Type de réparation"
                                            rules={[
                                                { required: true, message: 'Veuillez fournir une réparation...' },
                                            ]}
                                        >
                                            <Select
                                                allowClear
                                                showSearch
                                                options={reparation.map((item) => ({
                                                    value: item.id_type_reparation,
                                                    label: `${item.type_rep}`,
                                                }))}
                                                placeholder="Sélectionnez un type de réparation..."
                                                optionFilterProp="label"
                                            />
                                        </Form.Item>
                                    </Col>

                                    <Col xs={24} md={8}>
                                        <Form.Item
                                            label="Catégorie d'Inspection"
                                            {...restField}
                                            name={[name, 'id_cat_inspection']}
                                            rules={[{ required: true, message: 'Veuillez sélectionner une catégorie' }]}
                                        >
                                            { loadingData ? <Skeleton.Input active={true} /> : 
                                            <Select
                                                allowClear
                                                showSearch
                                                options={cat.map((item) => ({
                                                    value: item.id_cat_inspection,
                                                    label: item.nom_cat_inspection,
                                                }))}
                                                placeholder="Sélectionnez une categorie..."
                                                optionFilterProp="label"
                                            /> }
                                        </Form.Item>
                                    </Col>

                                    <Col xs={24} md={8}>
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'montant']}
                                            label="Budget ($)"
                                            rules={[{ required: false, message: 'Veuillez fournir le montant...' },]}
                                        >
                                            <InputNumber min={0} placeholder="Saisir le budget..." style={{width:'100%'}}/>
                                        </Form.Item>
                                    </Col>

                                    <Col xs={24} md={8}>
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'commentaire']}
                                            label="Préoccupations"
                                            rules={[
                                                {
                                                    required: false,
                                                    message: 'Veuillez fournir un commentaire...',
                                                }
                                            ]}
                                        >
                                            {loadingData ? <Skeleton.Input active={true} /> : <Input.TextArea placeholder="Saisir le commentaire..." style={{width:'100%', resize:'none', height:'50px'}}/>}
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} md={8}>
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'avis']}
                                            label="Avis d'expert"
                                        >
                                            {loadingData ? <Skeleton.Input active={true} /> : <Input.TextArea placeholder="Saisir l'avis d'expert..." style={{width:'100%', resize:'none', height:'50px'}}/>}
                                        </Form.Item>
                                    </Col>

                                    <Col xs={24} md={7}>
                                        <Form.Item
                                            label="Image"
                                            name={[name, 'img']}
                                            valuePropName="fileList"
                                            getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
                                            rules={[{ required: false, message: 'Veuillez télécharger une image' }]}
                                        >
                                            <Upload
                                                name="img"
                                                listType="picture"
                                                beforeUpload={() => false}
                                                onChange={(info) => handleImageUpload(info, name)}
                                            >
                                                <Button icon={<UploadOutlined />} className="custom-button">
                                                    Télécharger une image
                                                </Button>
                                            </Upload>
                                        </Form.Item>

                                    </Col>
                                    {uploadedImages[name] && (
                                        <div className="image-editor">
                                            <div className="icon-toolbar">
                                                {icons.map((icon) => (
                                                    <Button key={icon.id} onClick={() => addIconToField(icon.icon, name)}>
                                                        {icon.icon} {icon.label}
                                                    </Button>
                                                ))}
                                            </div>
                                            <div className="image-container">
                                                <img src={uploadedImages[name]} alt="Uploaded" className="uploaded-image" />
                                                {(iconPositionsMap[name] || []).map((pos, index) => (
                                                    <Rnd
                                                        key={index}
                                                        bounds="parent"
                                                        size={{ width: pos.width, height: pos.height }}
                                                        position={{ x: pos.x, y: pos.y }}
                                                        onDragStop={(e, d) => updateIconPosition(name, index, { x: d.x, y: d.y })}
                                                        onResizeStop={(e, direction, ref, delta, position) =>
                                                            updateIconPosition(name, index, {
                                                                width: ref.offsetWidth,
                                                                height: ref.offsetHeight,
                                                                ...position,
                                                            })
                                                        }
                                                    >
                                                        <div style={{
                                                            fontSize: '30px',
                                                            display: 'flex',
                                                            justifyContent: 'center',
                                                            alignItems: 'center',
                                                            width: '100%',
                                                            height: '100%',
                                                            cursor: 'move',
                                                        }}>
                                                            {pos.icon}
                                                        </div>
                                                    </Rnd>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <Col xs={24} md={2}>
                                        <Button
                                            type="text"
                                            danger
                                            icon={<MinusCircleOutlined />}
                                            onClick={() => {
                                                remove(name);

                                                setUploadedImages(prev => {
                                                    const newState = { ...prev };
                                                    delete newState[name];
                                                    return newState;
                                                });

                                                setIconPositionsMap(prev => {
                                                    const newState = { ...prev };
                                                    delete newState[name];
                                                    return newState;
                                                });
                                            }}

                                        >
                                        </Button>
                                    </Col>

                                </Row>
                            </Card>
                            ))}
                            <Form.Item>
                                <Button
                                    type="dashed"
                                    onClick={() => add()}
                                    icon={<PlusCircleOutlined />}
                                    style={{ width: '100%' }}
                                >
                                    Signaler un problème technique
                                </Button>
                            </Form.Item>
                        </>
                        )}
                    </Form.List>
                    <div style={{ marginTop: '20px' }}>
                        <Button size='large' type="primary" htmlType="submit" icon={<SendOutlined />} loading={loading} disabled={loading} >
                            Soumettre
                        </Button>
                    </div>
                </Form>
            </div>
        </div>
    </>
  )
}

export default InspectionGenForm