import React, { useEffect, useState } from 'react';
import { Form, InputNumber, Select, Button, Row, Col, notification, Table } from 'antd';
import { getArticle, getArticleOne } from '../../../services/typeService';
import { getFournisseur } from '../../../services/fournisseurService';
import { postBudget } from '../../../services/budgetService';
import { useNavigate } from 'react-router-dom';
import { getBesoinOne } from '../../../services/besoinsService';

const { Option } = Select;

const BudgetForm = ({ idProjet }) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [besoins, setBesoins] = useState([]);
  const [fournisseurs, setFournisseurs] = useState([]);
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

  // Fonction pour gérer les erreurs de chargement
  const handleError = (message) => {
    notification.error({
      message: 'Erreur de chargement',
      description: message,
    });
  };

  // Récupérer les besoins liés au projet
  useEffect(() => {
    const fetchBesoin = async () => {
      try {
        const response = await getBesoinOne(idProjet);
        setBesoins(response.data);
      } catch (error) {
        notification.error({
          message: 'Erreur de chargement',
          description: 'Une erreur est survenue lors du chargement des besoins. Veuillez réessayer plus tard.',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBesoin();
  }, [idProjet]);

  // Récupérer les fournisseurs
  useEffect(() => {
    const fetchFournisseur = async () => {
      try {
        const fournisseurData = await getFournisseur();
        setFournisseurs(fournisseurData.data);
      } catch (error) {
        handleError('Une erreur est survenue lors du chargement des fournisseurs.');
      }
    };

    fetchFournisseur();
  }, []);

  // Récupérer les articles liés aux besoins
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        // Supposons que chaque besoin a un champ 'id_article' pour identifier l'article
        const articlePromises = besoins.map(besoin => getArticleOne(besoin.id_article));
        const articlesData = await Promise.all(articlePromises);
        const articlesList = articlesData.map(res => res.data);
        setArticles(articlesList);
      } catch (error) {
        handleError('Une erreur est survenue lors du chargement des articles.');
      }
    };

    if (besoins.length > 0) {
      fetchArticles();
    }
  }, [besoins]);

  const columns = [
    {
      title: 'Article',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Quantité demandée',
      dataIndex: 'quantite_demande',
      key: 'quantite_demande',
    },
    {
      title: 'Quantité validée',
      dataIndex: 'quantite_validee',
      key: 'quantite_validee',
      render: (text, record) => (
        <InputNumber
          min={0}
          defaultValue={record.quantite_validee || 0}
          onChange={(value) => handleQuantiteValideeChange(record.id_besoin, value)}
        />
      ),
    },
    {
      title: 'Offre',
      dataIndex: 'offre',
      key: 'offre',
    },
    {
      title: 'Montant',
      dataIndex: 'montant',
      key: 'montant',
      render: (text, record) => (
        <span>{(record.quantite_demande * record.prix_unitaire).toFixed(2)}</span>
      ),
    },
    {
      title: 'Montant validé',
      dataIndex: 'montant_valide',
      key: 'montant_valide',
      render: (text, record) => (
        <span>{(record.quantite_validee * record.prix_unitaire).toFixed(2)}</span>
      ),
    },
  ];

  // Fonction pour gérer le changement de quantité validée
  const handleQuantiteValideeChange = (idBesoin, value) => {
    setBesoins(prevBesoins =>
      prevBesoins.map(besoin =>
        besoin.id_besoin === idBesoin
          ? { ...besoin, quantite_validee: value }
          : besoin
      )
    );
  };

  // Préparer les données pour le tableau
  const dataSource = besoins.map(besoin => {
    return {
      key: besoin.id_besoin,
      id_besoin: besoin.id_besoin,
      description: besoin.description || 'N/A',
      quantite_demande: besoin.quantite,
      quantite_validee: besoin.quantite_validee || 0,
      offre: besoin.offre || 'N/A',
      prix_unitaire:  0,
      montant: 0,
      montant_valide: 0
    };
  });

  return (
    <>
      {/* Tableau des articles */}
      <Table
        columns={columns}
        dataSource={dataSource}
        pagination={false}
        bordered
        title={() => 'Liste des Articles'}
      />

      {/* Formulaire de budget */}
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{
          quantite_demande: 0.00
        }}
        style={{ marginTop: '20px' }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Article"
              name="article"
              rules={[{ required: true, message: 'Veuillez sélectionner un article' }]}
            >
              <Select placeholder="Sélectionnez un article">
                {besoins.map((b) => (
                  <Option key={b.id_besoin} value={b.id_besoin}>
                    {b.description}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Fournisseur"
              name="fournisseur"
              rules={[{ required: true, message: 'Veuillez sélectionner un fournisseur' }]}
            >
              <Select onChange={(value) => form.setFieldsValue({ fournisseur: value })} placeholder="Sélectionnez un fournisseur">
                {fournisseurs.map((f) => (
                  <Option key={f.id_fournisseur} value={f.id_fournisseur}>
                    {f.nom_fournisseur}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        {/* Autres champs du formulaire */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Quantité demandée"
              name="quantite_demande"
              rules={[{ required: true, message: 'Veuillez entrer la quantité demandée' }]}
            >
              <InputNumber
                min={0}
                style={{ width: '100%' }}
                placeholder="0.00"
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Prix unitaire"
              name="prix_unitaire"
              rules={[{ required: true, message: 'Veuillez entrer le prix unitaire' }]}
            >
              <InputNumber
                min={0}
                style={{ width: '100%' }}
                placeholder="0.00"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Montant"
              name="montant"
            >
              <InputNumber
                style={{ width: '100%' }}
                placeholder="0.00"
                readOnly
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Quantité validée"
              name="quantite_validee"
              rules={[{ type: 'number', min: 0, message: 'Veuillez entrer une quantité validée positive' }]}
            >
              <InputNumber
                min={0}
                style={{ width: '100%' }}
                placeholder="0.00"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              label="Montant validé"
              name="montant_valide"
            >
              <InputNumber
                min={0}
                style={{ width: '100%' }}
                placeholder="0.00"
                readOnly
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Soumettre
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default BudgetForm;
