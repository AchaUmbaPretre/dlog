import React, { useState, useEffect } from 'react';
import { Form, Input, InputNumber, Button, Select, notification, Spin, Row, Col } from 'antd';
import axios from 'axios';
import { postBudget } from '../../../services/budgetService';
import { getTache } from '../../../services/tacheService';
import { getControle } from '../../../services/controleService';

const { Option } = Select;

const BudgetForm = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [controls, setControls] = useState([]);
  const [showAdvancedFields, setShowAdvancedFields] = useState(false);

  useEffect(() => {
    fetchTasks();
    fetchControls();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await getTache();
      setTasks(response.data);
    } catch (error) {
      notification.error({
        message: 'Erreur',
        description: 'Erreur lors du chargement des tâches.',
      });
    }
  };

  const fetchControls = async () => {
    try {
      const response = await getControle();
      setControls(response.data);
    } catch (error) {
      notification.error({
        message: 'Erreur',
        description: 'Erreur lors du chargement des contrôles.',
      });
    }
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      await postBudget(values)
      notification.success({
        message: 'Succès',
        description: 'Le budget a été enregistré avec succès.',
      });
      form.resetFields();
    } catch (error) {
      notification.error({
        message: 'Erreur',
        description: 'Erreur lors de l\'enregistrement du budget.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Spin spinning={loading}>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="article"
              label="Article"
              rules={[{ required: true, message: 'Veuillez entrer un article' }]}
            >
              <Input placeholder="Nom de l'article" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="quantite_demande"
              label="Quantité Demandée"
              rules={[{ required: true, message: 'Veuillez entrer la quantité demandée' }]}
            >
              <InputNumber min={0} placeholder="Quantité demandée" style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="prix_unitaire"
              label="Prix Unitaire"
              rules={[{ required: true, message: 'Veuillez entrer le prix unitaire' }]}
            >
              <InputNumber
                min={0}
                placeholder="Prix unitaire"
                style={{ width: '100%' }}
                formatter={value => `${value} $`}
                parser={value => value.replace(' $', '')}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="fournisseur"
              label="Fournisseur"
              rules={[{ required: true, message: 'Veuillez entrer le nom du fournisseur' }]}
            >
              <Input placeholder="Nom du fournisseur"  />
            </Form.Item>
          </Col>
        </Row>

        {showAdvancedFields && (
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="id_tache"
                label="Tâche Associée"
              >
                <Select placeholder="Sélectionnez une tâche">
                  {tasks.map(task => (
                    <Option key={task.id_tache } value={task.id_tache}>{task.nom_tache}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="id_controle"
                label="Contrôle Associé"
              >
                <Select placeholder="Sélectionnez un contrôle">
                  {controls.map(control => (
                    <Option key={control.id_controle} value={control.id_controle}>{control.controle_de_base}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
        )}

        <Form.Item>
          <Button type="dashed" onClick={() => setShowAdvancedFields(!showAdvancedFields)} style={{ marginBottom: 16 }}>
            {showAdvancedFields ? 'Masquer les Champs Avancés' : 'Afficher les Champs Avancés'}
          </Button>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Enregistrer le budget
          </Button>
        </Form.Item>
      </Form>
    </Spin>
  );
};

export default BudgetForm;
