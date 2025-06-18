import { useEffect, useState } from 'react';
import { Form, Input, Select, Button, notification } from 'antd';
import { getInspectionOneV, getType_instruction, postInspection, putInspection } from '../../../services/batimentService';
import { getBatiment } from '../../../services/typeService';

const { TextArea } = Input;
const { Option } = Select;

const InstructionFormEdit = ({idBatiment, closeModal, fetchData, idInspection}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [batiment, setBatiment] = useState([]);
  const [instructionData, setInstructionData] = useState([]);

  const fetchDataAll = async() => {
    try {
        const [batimentData, typeInspe] = await Promise.all([
            getBatiment(),
            getType_instruction(),
        ])
        setBatiment(batimentData.data)
        setInstructionData(typeInspe.data)
        if(idInspection){
            const { data: inspect} = await getInspectionOneV(idInspection);
            form.setFieldsValue({
                id_batiment: inspect[0].id_batiment,
                commentaire: inspect[0].commentaire,
                id_cat_instruction: inspect[0].id_cat_instruction,
                id_type_instruction: inspect[0].id_type_instruction,
            });
        }   
    } catch (error) {
        console.log(error)
    }
  }

    useEffect(() => {
        fetchDataAll();
    }, [form, idInspection]);

  const handleSubmit = async (values) => {
    setLoading(true);
    const formData = new FormData();
    formData.append('commentaire', values.commentaire);
    formData.append('id_cat_instruction', values.id_cat_instruction);
    formData.append('id_type_instruction', values.id_type_instruction);

    try {
        if(idInspection){
            await putInspection(idInspection, values)
            notification.success({
                message: 'Succès',
                description: 'Les informations ont été mise à jour avec succès.',
            });
        }
        else{
            await postInspection(formData);
            notification.success({
                message: 'Succès',
                description: 'Les informations ont été enregistrées avec succès.',
            });
        }
        
        form.resetFields();
        closeModal();
        fetchData()
    } catch (error) {
        console.error(error);
        notification.error({
            message: 'Erreur',
            description: "Une erreur s'est produite lors de l'enregistrement.",
        });
    } finally {
        setLoading(false);
    }
};

  return (
    <div className="controle_form">
        <div className="controle_title_rows">
            <h2 className="controle_h2">{ idInspection ? 'Modifier une inspection' : 'Insérer une inspection'}</h2>
        </div>
        <div className="controle_wrapper">
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                initialValues={{
                id_batiment: '',
                commentaire: '',
                id_cat_instruction: '',
                id_type_instruction: 1
                }}
            >
                {/* ID Bâtiment */}
                <Form.Item
                label="Bâtiment"
                name="id_batiment"
                rules={[{ required: false, message: 'Veuillez entrer l’ID du bâtiment' }]}
                >
                    <Select
                        showSearch
                        options={batiment.map((item) => ({
                                value: item.id_batiment,
                                label: item.nom_batiment,
                            }))}
                        placeholder="Sélectionnez un batiment..."
                        optionFilterProp="label"
                    />
                </Form.Item>

                {/* Commentaire */}
                <Form.Item
                label="Commentaire"
                name="commentaire"
                rules={[{ required: true, message: 'Veuillez entrer un commentaire' }]}
                >
                <TextArea rows={4} placeholder="Entrez votre commentaire" />
                </Form.Item>


                {/* Catégorie d'instruction */}
                <Form.Item
                label="Catégorie d'Instruction"
                name="id_cat_instruction"
                rules={[{ required: true, message: 'Veuillez sélectionner une catégorie' }]}
                >
                <Select placeholder="Sélectionnez une catégorie">
                    <Option value={1}>Catégorie 1</Option>
                    <Option value={2}>Catégorie 2</Option>
                    <Option value={3}>Catégorie 3</Option>
                </Select>
                </Form.Item>

                {/* Type instruction */}
                <Form.Item
                label="Type d'inspection"
                name="id_type_instruction"
                rules={[{ required: true, message: 'Veuillez sélectionner un type d inspection' }]}
                >
                    <Select 
                        showSearch
                        options={instructionData.map((item) => ({
                            value: item.id_type_instruction,
                            label: item.nom_type_instruction,
                        }))}
                        placeholder="Sélectionnez un type d inspection" 

                    />
                </Form.Item>

                {/* Bouton de soumission */}
                <Form.Item>
                    <Button type="primary" htmlType="submit" disabled={loading} loading={loading}>
                        Soumettre
                    </Button>
                </Form.Item>
            </Form>
        </div>
    </div>
  );
};

export default InstructionFormEdit;
