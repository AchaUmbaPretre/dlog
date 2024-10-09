import React, { useEffect, useState } from 'react';
import { Form, Col, Skeleton, notification, Button, Space } from 'antd';
import 'froala-editor/css/froala_editor.pkgd.min.css';
import 'froala-editor/css/froala_style.min.css';
import FroalaEditor from 'react-froala-wysiwyg';
import { getTacheOneV, putTacheDesc } from '../../../services/tacheService';

const EditerDesc = ({ idTache, closeModal, fetchData }) => {
    const [form] = Form.useForm();
    const [editorContent, setEditorContent] = useState('');
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleEditorChange = (content) => {
        setEditorContent(content);
        form.setFieldsValue({ description: content });
    };

    useEffect(() => {
        const fetchTacheData = async () => {
            setIsLoading(true);
            try {
                if (idTache) {
                    const { data: tache } = await getTacheOneV(idTache);
                    if (tache && tache[0]) {
                        setData(tache[0].nom_tache);
                        setEditorContent(tache[0].description);
                        form.setFieldsValue({ description: tache[0].description });
                    }
                }
            } catch (error) {
                notification.error({
                    message: 'Erreur',
                    description: 'Une erreur est survenue lors du chargement des données.',
                });
                console.log(error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTacheData();
    }, [idTache, form]);

    const onFinish = async (values) => {
        setIsLoading(true);
        try {
            await putTacheDesc(idTache, values);
            notification.success({
                message: 'Succès',
                description: 'La description a été mise à jour avec succès.',
            });
            closeModal();
            fetchData();  // Rafraîchir les données après la mise à jour
            form.resetFields();
            setEditorContent('');  // Réinitialiser le contenu de l'éditeur
        } catch (error) {
            notification.error({
                message: 'Erreur',
                description: 'Une erreur est survenue lors de la mise à jour.',
            });
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="controle_form">
            <div className="controle_title_rows">
                <h2 className='controle_h2'>Modifier la description de {data}</h2>  
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
                    <Col xs={24} md={24}>
                        <Form.Item
                            name="description"
                            label="Description"
                            rules={[{ required: true, message: 'Veuillez fournir une description.' }]}
                        >
                            {isLoading ? (
                                <Skeleton.Input active={true} />
                            ) : (
                                <FroalaEditor
                                    tag='textarea'
                                    model={editorContent}
                                    onModelChange={handleEditorChange}
                                    config={{
                                        toolbarButtons: [
                                            'bold', 'italic', 'underline', '|', 
                                            'insertLink', 'insertImage', 'insertHR', '|', 
                                            'undo', 'redo', '|', 
                                            'paragraphFormat', 'align', 'insertTable', 'clearFormatting'
                                        ],
                                        height: 300,
                                        placeholder: 'Entrez votre description ici...'
                                    }}
                                />
                            )}
                        </Form.Item>
                    </Col>
                    <Col xs={24}>
                        <Form.Item>
                            <Space className="button-group">
                                <Button type="primary" htmlType="submit" loading={isLoading} disabled={isLoading}>
                                    { idTache ? 'Modifier' : 'Ajouter' }
                                </Button>
                            </Space>
                        </Form.Item>
                    </Col>
                </Form>
            </div>
        </div>
    );
};

export default EditerDesc;
