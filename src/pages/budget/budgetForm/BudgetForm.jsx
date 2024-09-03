import React, { useEffect, useState } from 'react';
import { Form, InputNumber, Select, Button, Row, Col, notification, Table } from 'antd';
import { getFournisseur } from '../../../services/fournisseurService';
import { postBudget } from '../../../services/budgetService';
import { useNavigate } from 'react-router-dom';
import { getBesoinOne } from '../../../services/besoinsService';

const { Option } = Select;

const BudgetForm = ({ idProjet }) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [besoin, setBesoin] = useState([]);
  const [fournisseur, setFournisseur] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFinish = async (values) => {
    setLoading(true);
    try {
      await postBudget(values);
      notification.success({
        message: 'Succès',
        description: 'Le budget a été enregistré avec succès.',
      });
      form.resetFields();
      navigate('/budget');
      window.location.reload();
    } catch (error) {
      notification.error({
        message: 'Erreur',
        description: 'Erreur lors de l\'enregistrement du projet.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleError = (message) => {
    notification.error({
      message: 'Erreur de chargement',
      description: message,
    });
  };

  useEffect(() => {
    const fetchBesoin = async () => {
      try {
        const response = await getBesoinOne(idProjet);
        setBesoin(response.data);
      } catch (error) {
        handleError('Une erreur est survenue lors du chargement des besoins. Veuillez réessayer plus tard.');
      } finally {
        setLoading(false);
      }
    };

    fetchBesoin();
  }, [idProjet]);

  useEffect(() => {
    const fetchFournisseur = async () => {
      try {
        const fournisseurData = await getFournisseur();
        setFournisseur(fournisseurData.data);
      } catch (error) {
        handleError('Une erreur est survenue lors du chargement des fournisseurs.');
      }
    };

    fetchFournisseur();
  }, []);

  const columns = [
    {
      title: 'Article',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Qté demandée',
      dataIndex: 'quantite_demande',
      key: 'quantite_demande',
      render: (_, record) => (
        <Form.Item
          name={['besoins', record.id_besoin, 'quantite_demande']}
          initialValue={record.quantite}
        >
          <InputNumber min={0} />
        </Form.Item>
      ),
    },
    {
      title: 'Qté validée',
      dataIndex: 'quantite_validee',
      key: 'quantite_validee',
      render: (_, record) => (
        <Form.Item
          name={['besoins', record.id_besoin, 'quantite_validee']}
        >
          <InputNumber min={0} />
        </Form.Item>
      ),
    },
    {
      title: 'Offre',
      dataIndex: 'offre',
      key: 'offre',
      render: (_, record) => (
        <Form.Item
          name={['besoins', record.id_besoin, 'offre']}
        >
          <Select placeholder="Sélectionnez une offre">
            {/* Remplacez les valeurs d'offre ici par celles disponibles */}
            <Option value="offre1">Offre 1</Option>
            <Option value="offre2">Offre 2</Option>
            <Option value="offre3">Offre 3</Option>
          </Select>
        </Form.Item>
      ),
    },
    {
      title: 'Montant',
      dataIndex: 'montant',
      key: 'montant',
      render: (_, record) => (
        <Form.Item
          name={['besoins', record.id_besoin, 'montant']}
        >
          <InputNumber min={0} readOnly />
        </Form.Item>
      ),
    },
    {
      title: 'MT validé',
      dataIndex: 'montant_valide',
      key: 'montant_valide',
      render: (_, record) => (
        <Form.Item
          name={['besoins', record.id_besoin, 'montant_valide']}
        >
          <InputNumber min={0} readOnly />
        </Form.Item>
      ),
    },
  ];

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFinish}
    >

      <Table
        columns={columns}
        dataSource={besoin}
        rowKey="id_besoin"
        pagination={false}
      />

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Soumettre
        </Button>
      </Form.Item>
    </Form>
  );
};

export default BudgetForm;
