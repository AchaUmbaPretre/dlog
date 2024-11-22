import React, { useEffect, useState } from 'react'; 
import { Form, Button, notification, Select } from 'antd';
import { putInspectionTache } from '../../../services/batimentService';
import { getTache } from '../../../services/tacheService';

const { Option } = Select;

const InspectionTache = ({ closeModal, fetchData, idInspection }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  // Fonction pour récupérer les tâches et éliminer les doublons par id_tache
  const fetchDataTache = async () => {
    try {
      const { data } = await getTache();
      
      // Eliminer les doublons en utilisant un Set basé sur id_tache
      const uniqueTasks = data.taches.reduce((acc, task) => {
        if (!acc.some(existingTask => existingTask.id_tache === task.id_tache)) {
          acc.push(task);
        }
        return acc;
      }, []);
      
      setData(uniqueTasks);
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
    fetchDataTache();
  }, []);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await putInspectionTache(idInspection, values);
      notification.success({
        message: 'Succès',
        description: 'Le formulaire a été soumis avec succès.',
      });
      form.resetFields();
      closeModal();
      fetchData();
    } catch (error) {
      notification.error({
        message: 'Erreur',
        description: "Erreur lors de l'enregistrement de la tâche.",
      });
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Échec de la soumission:', errorInfo);
    notification.error({
      message: 'Erreur',
      description: 'Veuillez vérifier les champs du formulaire.',
    });
  };

  return (
    <div className="controle_from">
        <div className="controle_title_rows">
            <h2 className="controle_h2">Relier l'inspection à une tache</h2>
        </div>
        <div className="controle_wrapper">
            <Form
                form={form}
                name="inspectionTache_form"
                layout="vertical"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                style={{ maxWidth: 600, margin: '0 auto' }}
            >
                <Form.Item
                    label="Tâche"
                    name="id_tache"
                    rules={[{ required: true, message: 'Veuillez sélectionner une tâche' }]}
                >
                    <Select placeholder="Sélectionnez une tâche">
                    {/* Affichage des tâches sans doublons */}
                    {data?.map((dd) => (
                        <Option key={dd.id_tache} value={dd.id_tache}>
                        {dd.nom_tache}
                        </Option>
                    ))}
                    </Select>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading} disabled={loading}>
                        Soumettre
                    </Button>
                </Form.Item>
            </Form>
        </div>
    </div>
  );
};

export default InspectionTache;
