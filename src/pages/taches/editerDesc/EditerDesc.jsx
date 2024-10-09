import React, { useEffect, useState } from 'react'
import { Form, Col, Skeleton } from 'antd';
import 'froala-editor/css/froala_editor.pkgd.min.css';
import 'froala-editor/css/froala_style.min.css';
import FroalaEditor from 'react-froala-wysiwyg'
import { getTacheOneV } from '../../../services/tacheService';


const EditerDesc = ({idTache, closeModal, fetchData}) => {
    const [form] = Form.useForm();
    const [editorContent, setEditorContent] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleEditorChange = (content) => {
        setEditorContent(content);
        form.setFieldsValue({ description: content });
    };

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);

            try {
                

                if(idTache){
                    const { data: tache } = await getTacheOneV(idTache);
                    
                    if (tache && tache[0]) {
                        setEditorContent(tache[0].description)
                    }
                }

            } catch (error) {
                console.log(error)
            }finally {
                setIsLoading(false); 
            }
        };

        fetchData();
    }, [idTache]);

    const onFinish = async (values) => {
        /* const dataAll = {
            ...values,
            id_control : idControle,
            id_projet: idProjet
        }
        setIsLoading(true);
        try {
                await putTache(idTache, dataAll)
            notification.success({
                message: 'Succès',
                description: 'Les informations ont été enregistrées avec succès.',
            });
            closeModal();
            fetchData();
            form.resetFields();
            setEditorContent();
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false);
        } */
    };


  return (
    <>
        <div className="controle_form">
            <div className="controle_title_rows">
                <h2 className='controle_h2'>Modifier la description</h2>  
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
                        rules={[
                            {
                                required: true,
                                message: 'Veuillez fournir une description.',
                            },
                        ]}
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
                                            height: 300,
                                            placeholder: 'Entrez votre description ici...'
                                        }}
                                    />
                                )}
                    </Form.Item>
                </Col>
            </Form>
            </div>
        </div>
    </>
  )
}

export default EditerDesc