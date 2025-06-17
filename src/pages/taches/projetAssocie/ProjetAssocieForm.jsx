import { useEffect, useState } from 'react';
import { Form, Select, Button, notification, Skeleton } from 'antd';
import { getProjet } from '../../../services/projetService';
import { putProjetAssocie } from '../../../services/tacheService';
import { useSelector } from 'react-redux';

const { Option } = Select;

const ProjetAssocieForm = ({ idTache, fetchData, closeModal }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(true);
    const [loadingButton, setLoadingButton] = useState(false);
    const [projet, setProjet] = useState([]);
    const role = useSelector((state) => state.user?.currentUser?.role);
    const userId = useSelector((state) => state.user?.currentUser?.id_utilisateur);

    const handleSubmit = async (values) => {
        setLoadingButton(true);
        const dataLL = {
            id_tache: idTache,
            ...values
        };
    
        try {
            const response = await putProjetAssocie(dataLL);
    
            if (response?.status === 200) {
                notification.success({
                    message: 'Succès',
                    description: 'Les informations ont été enregistrées avec succès.',
                });
                fetchData();
                closeModal();
                form.resetFields();
            } else {
                notification.error({
                    message: 'Erreur',
                    description: response?.data?.message || 'Une erreur s\'est produite lors de l\'enregistrement des informations.',
                });
            }
        } catch (error) {
            console.log(error);
            notification.error({
                message: 'Erreur',
                description: error.response?.data?.message || 'Une erreur inattendue s\'est produite.',
            });
        } finally {
            setLoadingButton(false);
        }
    };

    const fetchDatas = async () => {
        try {
            const { data } = await getProjet(role, userId);
            setProjet(data);
            setLoading(false);
        } catch (error) {
            notification.error({
                message: 'Erreur de chargement',
                description: 'Une erreur est survenue lors du chargement des données.',
            });
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDatas();
    }, [idTache,role, userId]);

    return (
        <div className="controle_form">
            <div className="controle_title_rows">
                <div className="controle_h2">Projet</div>
            </div>
            <div className="controle_wrapper">
                {loading ? (
                    <Skeleton active />
                ) : (
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleSubmit}
                        style={{ maxWidth: '400px', margin: '0 auto' }}
                    >
                        <Form.Item
                            label="Projet Associé"
                            name="id_projet"
                            rules={[{ required: true, message: 'Veuillez sélectionner un projet' }]}
                        >
                            <Select
                                showSearch
                                options={projet?.map((item) => ({
                                    value: item?.id_projet,
                                    label: item?.nom_projet,
                                }))}
                                placeholder="Sélectionnez un projet..."
                                optionFilterProp="label"
                            />
                        </Form.Item>

                        <Form.Item>
                            <Button 
                                type="primary" 
                                htmlType="submit" 
                                block 
                                loading={loadingButton}
                                disabled={loadingButton}
                            >
                                Soumettre
                            </Button>
                        </Form.Item>
                    </Form>
                )}
            </div>
        </div>
    );
};

export default ProjetAssocieForm;
