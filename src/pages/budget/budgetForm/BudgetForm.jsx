import React, { useEffect, useState } from 'react';
import { Form, InputNumber, Select, Button, notification, Table } from 'antd';
import { postBudget } from '../../../services/budgetService';
import { useNavigate } from 'react-router-dom';
import { getBesoinOne } from '../../../services/besoinsService';
import { getOffre, getOffreArticleOne } from '../../../services/offreService';

const { Option } = Select;

const BudgetForm = ({ idProjet }) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [idOffre, setIdOffre] = useState(null);
  const [offreData, setOffreData] = useState([]);
  const [besoin, setBesoin] = useState([]);
  const [offre, setOffre] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFinish = async (values) => {
    console.log(values);
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
        console.log('Besoin Data:', response.data);
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
    const fetchOffreData = async () => {
      try {
        const response = await getOffreArticleOne(idOffre);
        console.log('Fetched Offre Data:', response.data);
        setOffreData(response.data);
      } catch (error) {
        handleError('Une erreur est survenue lors du chargement des offres.');
      } finally {
        setLoading(false);
      }
    };
  
    if (idOffre) {
      fetchOffreData();
    }
  }, [idOffre]);
  

  useEffect(() => {
    const fetchFournisseur = async () => {
      try {
        const offreData = await getOffre();
        console.log('Offre List:', offreData.data);
        setOffre(offreData.data);
      } catch (error) {
        handleError('Une erreur est survenue lors du chargement des fournisseurs.');
      }
    };

    fetchFournisseur();
  }, []);

  const handleOfferChange = (value, record) => {
    setIdOffre(value);
    
    setTimeout(() => {
      const selectedOffer = offreData.filter((item) => item.id_offre === value);  
      if (selectedOffer.length > 0) {
        const totalMontant = selectedOffer.reduce((total, article) => total + article.prix, 0);
        form.setFieldsValue({
          [`montant[${record.id_besoin}]`]: totalMontant
        });
        
      } else {
        form.setFieldsValue({
          [`montant[${record.id_besoin}]`]: 0
        });
      }
    }, 0);
  };
  
  

  const columns = [
    {
      title: 'Article',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Qté demandée',
      dataIndex: 'quantite',
      key: 'quantite',
      render: (_, record) => (
        <Form.Item
          name={['quantite_demande', record.id_besoin]}
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
          name={['quantite_validee', record.id_besoin]}
        >
          <InputNumber min={0} />
        </Form.Item>
      ),
    },
    {
      title: 'Offre',
      dataIndex: 'id_offre',
      key: 'id_offre',
      render: (_, record) => (
        <Form.Item
          name={['id_offre', record.id_besoin]}
        >
          <Select
            placeholder="Sélectionnez une offre"
            onChange={(value) => handleOfferChange(value, record)}
            showSearch
            options={offre.map((item) => ({
              value: item.id_offre,
              label: item.nom_offre,
            }))}
          />
        </Form.Item>
      ),
    },
    {
      title: 'Montant',
      dataIndex: 'montant',
      key: 'montant',
      render: (_, record) => (
        <Form.Item
          name={['montant', record.id_besoin]}
          initialValue={0}
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
          name={['montant_valide', record.id_besoin]}
        >
          <InputNumber min={0} />
        </Form.Item>
      ),
    }
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
        bordered
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
