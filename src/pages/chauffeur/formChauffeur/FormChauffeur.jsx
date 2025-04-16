import React, { useEffect, useState } from 'react';
import { Button, Form, Upload, Input, Row, Col, Select, DatePicker, Skeleton, Divider, InputNumber, Radio, Space, Modal, message } from 'antd';
import {  PlusOutlined } from '@ant-design/icons';
import Cropper from 'react-easy-crop';
import getCroppedImg from './../../../utils/getCroppedImg';
import moment from 'moment';
import { getPermis, getSexe, getTypeFonction, postChauffeur } from '../../../services/charroiService';
import { getContrat } from '../../../services/templateService';

const { Option } = Select;

const FormChauffeur = ({fetchData, closeModal}) => {
    const [form] = Form.useForm();
    const [loadingData, setLoadingData] = useState(false);
    const [fileList, setFileList] = useState([]);
    const [previewImage, setPreviewImage] = useState('');
    const [cropping, setCropping] = useState(false);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [catPermis, setCatPermis] = useState([]);
    const [typeContrat, setTypeContrat] = useState([]);
    const [etatCivil, setEtatCivil] = useState([]);
    const [fonction, setFonction] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoadingData(true);
    
                const [catPermisData, typeContratData, etatCivilData, typeFonctionData] = await Promise.all([
                    getPermis(),
                    getContrat(),
                    getSexe(),
                    getTypeFonction(),
                ]);
    
                setCatPermis(catPermisData.data);
                setTypeContrat(typeContratData.data);
                setEtatCivil(etatCivilData.data);
                setFonction(typeFonctionData.data);
                
            } catch (error) {
                setError('Une erreur est survenue lors du chargement des données.');
                console.error(error);
            } finally {
                setLoadingData(false);
            }
        };
    
        fetchData();
    }, []);

    
    const onFinish = async (values) => {

        setLoading(true)
        try {
            if (fileList.length > 0) {
                values.profil = fileList[0].originFileObj;
            }

            message.loading({ content: 'En cours...', key: 'submit' });

            await postChauffeur(values);

            message.success({ content: 'Chauffeur ajouté avec succès!', key: 'submit' });

            form.resetFields();
            closeModal();
            fetchData();
            setFileList([])
        } catch (error) {
            message.error({ content: 'Une erreur est survenue.', key: 'submit' });
            console.error('Erreur lors de l\'ajout du chauffeur:', error);
        } finally {
            setLoading(false)
        }
    };

    
      const handleUploadChange = ({ fileList }) => {
        setFileList(fileList.slice(-1));

        if (fileList.length > 0) {
          setPreviewImage(URL.createObjectURL(fileList[0].originFileObj));
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
                    <h2 className="controle_h2">ENREGISTRER UN CHAUFFEUR</h2>
                </div>
                <div className="controle_wrapper">
                    <Form
                        form={form}
                        name="chauffeurForm"
                        layout="vertical"
                        autoComplete="off"
                        className="custom-form"
                        onFinish={onFinish}
                    >
                        <Row gutter={16}>
                        <Divider className='title_row' orientation="left" plain>INFORMATION GENERALE</Divider>
                            <Col xs={24} md={8}>
                                <Form.Item
                                    name="nom"
                                    label="Nom"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Veuillez fournir un nom.',
                                        },
                                    ]}
                                >
                                    {loadingData ? <Skeleton.Input active /> : <Input placeholder="Saisir le nom" />}
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={8}>
                                <Form.Item
                                    name="prenom"
                                    label="Prénom"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Veuillez fournir un prénom.',
                                        },
                                    ]}
                                >
                                    {loadingData ? <Skeleton.Input active /> : <Input placeholder="Saisir le prénom" />}
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={8}>
                                <Form.Item
                                    name="telephone"
                                    label="Téléphone"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Veuillez fournir un numéro de téléphone.',
                                        },
                                    ]}
                                >
                                    {loadingData ? <Skeleton.Input active /> : <Input placeholder="+243..." />}
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={8}>
                                <Form.Item
                                    name="date_naissance"
                                    label="Date de naissance"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Veuillez fournir la date de naissance.',
                                        },
                                    ]}
                                >
                                    {loadingData ? <Skeleton.Input active /> : <DatePicker style={{ width: '100%' }} />}
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={8}>
                                <Form.Item
                                    name="date_engagement"
                                    label="Date d'engagement"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Veuillez fournir la date d\'engagement.',
                                        },
                                    ]}
                                >
                                    {loadingData ? <Skeleton.Input active /> : <DatePicker style={{ width: '100%' }} />}
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={8}>
                                <Form.Item
                                    name="sexe"
                                    label="Sexe"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Veuillez fournir le sexe.',
                                        },
                                    ]}
                                >
                                    <Radio.Group>
                                        <Radio value="M">Homme</Radio>
                                        <Radio value="F">Femme</Radio>
                                    </Radio.Group>
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={8}>
                                <Form.Item
                                    name="id_etat_civil"
                                    label="État civil"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Veuillez fournir l\'état civil.',
                                        },
                                    ]}
                                >
                                    <Select
                                        showSearch
                                        options={etatCivil?.map((item) => ({
                                            value: item.id_etat_civil                                           ,
                                            label: item.nom_etat_civil,
                                        }))}
                                        placeholder="Sélectionnez un etat civil..."
                                        optionFilterProp="label"
                                    />
                                </Form.Item>
                            </Col>

                            <Col xs={24} md={10}>
                                <Form.Item
                                    name="adresse"
                                    label="Adresse"
                                >
                                    {loadingData ? <Skeleton.Input active /> : <Input.TextArea placeholder="Saisir l'adresse" style={{height:'105px', resize:'none'}} />}
                                </Form.Item>
                            </Col>

                            <Col xs={24} md={6}>
                                <Form.Item
                                    name="profil"
                                    label="Photo"
                                    rules={[
                                        {
                                        required: false,
                                        message: 'Veuillez fournir une photo.',
                                        },
                                    ]}
                                >
                                <Upload
                                    accept="image/*"
                                    listType="picture-card"
                                    fileList={fileList}
                                    onChange={handleUploadChange}
                                    beforeUpload={() => false} // Empêche le téléchargement automatique
                                >
                                    {fileList.length < 1 && <div>
                                    <PlusOutlined />
                                    <div style={{ marginTop: 8 }}>Ajouter</div>
                                    </div>}
                                </Upload>
                                </Form.Item>
                            </Col>

                            <Divider className='title_row' orientation="left" plain>AUTRES INFORMATIONS</Divider>

                            <Col xs={24} md={8}>
                                <Form.Item
                                    name="matricule"
                                    label="Matricule"
                                    rules={[
                                        {
                                            required: false,
                                            message: 'Matricule est requis.',
                                        },
                                    ]}
                                >
                                    {loadingData ? <Skeleton.Input active /> : <Input placeholder="B1C21..." />}
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={8}>
                                <Form.Item
                                    name="id_fonction"
                                    label="Fonction"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Veuillez fournir une fonction.',
                                        },
                                    ]}
                                >
                                    <Select
                                        showSearch
                                        options={fonction.map((item) => ({
                                            value: item.id_type_fonction                                           ,
                                            label: item.nom_type_fonction,
                                        }))}
                                        placeholder="Sélectionnez une fonction..."
                                        optionFilterProp="label"
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={8}>
                                <Form.Item
                                    name="id_type_contrat"
                                    label="Type de contrat"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Veuillez fournir un type de contrat.',
                                        },
                                    ]}
                                >
                                    <Select
                                        showSearch
                                        options={typeContrat.map((item) => ({
                                            value: item.id_contrat                                           ,
                                            label: item.nom_type_contrat,
                                        }))}
                                        placeholder="Sélectionnez un type de contrat..."
                                        optionFilterProp="label"
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={8}>
                                <Form.Item
                                    name="type_travail"
                                    label="Type de travail"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Veuillez fournir un type de travail.',
                                        },
                                    ]}
                                >
                                    <Select placeholder="Choisir un type de travail">
                                        <Option value="1">Travail 1</Option>
                                        <Option value="2">Travail 2</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={8}>
                                <Form.Item
                                    name="num_permis"
                                    label="N° Permis de conduire"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Veuillez fournir un numéro de permis.',
                                        },
                                    ]}
                                >
                                    {loadingData ? <Skeleton.Input active /> : <Input placeholder="Saisir le numéro de permis" />}
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={8}>
                                <Form.Item
                                    name="id_permis"
                                    label="Catégorie Permis"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Veuillez fournir la catégorie du permis.',
                                        },
                                    ]}
                                >
                                    <Select
                                        showSearch
                                        options={catPermis.map((item) => ({
                                            value: item.id_cat_permis                                           ,
                                            label: item.nom_cat_permis,
                                        }))}
                                        placeholder="Sélectionnez un type de permis..."
                                        optionFilterProp="label"
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={24}>
                                <Form.Item
                                    name="date_validite"
                                    label="Validité"
                                    initialValue={moment()}
                                >
                                    {loadingData ? <Skeleton.Input active /> : <DatePicker  style={{ width: '100%' }} />}
                                </Form.Item>
                            </Col>
                        </Row>
                        <Divider />
                        <Row justify="center">
                            <Button type="primary" htmlType="submit" loading={loading}>
                                Enregistrer
                            </Button>
                        </Row>
                    </Form>

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
            </div>
        </>
    );
};

export default FormChauffeur;
