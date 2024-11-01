import { Button, Form, Input, notification, Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import { getCategorieOne, postCategorie, putCategorie } from '../../../services/typeService';


const CatForm = ({idCat, closeModal, fetchData}) => {
    const [form] = Form.useForm();
    const [isLoading, setIsLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [formValues, setFormValues] = useState({});

    useEffect(()=>{
        const fetchData = async() => {
            if(idCat){
                const {data: cat} = await getCategorieOne(idCat)
                form.setFieldsValue({
                    nom_cat : cat[0].nom_cat
                })
            }
        }

        fetchData()
    }, [idCat])
    const showConfirm = (values) => {
        setFormValues(values); 
        setIsModalVisible(true);
    };

    useEffect(() => {
        form.resetFields();
      }, [idCat, form]);

    const handleOk = async () => {
        setIsModalVisible(false);
        setIsLoading(true);
        try {
            if(idCat){
                await putCategorie(idCat, formValues)
                notification.success({
                    message: 'Succès',
                    description: 'Les informations ont été modifiées avec succès.',
                });
            }
            else{
                await postCategorie(formValues);
                notification.success({
                    message: 'Succès',
                    description: 'Les informations ont été enregistrées avec succès.',
                });
            }
            form.resetFields();
            fetchData();
            closeModal();
        } catch (error) {
            notification.error({
                message: 'Erreur',
                description: 'Une erreur s\'est produite lors de l\'enregistrement des informations.',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        setIsModalVisible(false); 
    };

    const onFinish = (values) => {
        showConfirm(values);
    };

    return (
        <div className="controle_form">
            <div className="controle_title_rows">
                <h2 className='controle_h2'>{ idCat ? 'Modifier la categorie'  : 'Ajouter une nouvelle categorie'}</h2>                
            </div>
            <div className="controle_wrapper">
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    autoComplete="off"
                >
                    <Form.Item
                        label="Categorie"
                        name="nom_cat"
                        rules={[{ required: true, message: 'Veuillez entrer le nom de categorie !' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={isLoading} disabled={isLoading}>
                            Ajouter
                        </Button>
                    </Form.Item>
                </Form>

                <Modal
                    title="Confirmer la soumission"
                    visible={isModalVisible}
                    onOk={handleOk}
                    onCancel={handleCancel}
                    okText="Confirmer"
                    cancelText="Annuler"
                >
                    <p>Êtes-vous sûr de vouloir enregistrer ces informations ?</p>
                </Modal>
            </div>
        </div>
    );
};

export default CatForm;
