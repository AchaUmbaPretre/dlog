import React, { useEffect, useState } from 'react';
import { Form, InputNumber, Select, Button, Row, Col, notification } from 'antd';
import { getArticle, getArticleOne } from '../../../services/typeService';
import { getFournisseur } from '../../../services/fournisseurService';
import { postBudget } from '../../../services/budgetService';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;

const BudgetForm = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [article, setArticle] = useState([]);
  const [articleId, setArticleId] = useState(null);
  const [fournisseurId, setFournisseurId] = useState(null);
  const [fournisseur, setFournisseur] = useState([]);
  const [loading, setLoading] = useState(false);


  const handleFinish = async(values) => {
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

  const calculateMontant = (quantite, prixUnitaire) => {
    return (quantite * prixUnitaire).toFixed(2);
  };

  const handleFieldChange = () => {
    const quantiteDemande = form.getFieldValue('quantite_demande') || 0;
    const prixUnitaire = form.getFieldValue('prix_unitaire') || 0;
    const montant = calculateMontant(quantiteDemande, prixUnitaire);
    form.setFieldsValue({ montant });
  };

  const handleQuantiteValideeChange = (value) => {
    const prixUnitaire = form.getFieldValue('prix_unitaire') || 0;
    const montantValide = calculateMontant(value, prixUnitaire);
    form.setFieldsValue({ montant_valide: montantValide });
  };

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const articleData = await getArticle();
        setArticle(articleData.data);
      } catch (error) {
        handleError('Une erreur est survenue lors du chargement des articles.');
      }
    };

    fetchArticle();
  }, []);

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

  useEffect(() => {
    const fetchArticleData = async () => {
      if (articleId && fournisseurId) {
        try {
          const articleOneData = await getArticleOne(articleId, fournisseurId);
          const articleData = articleOneData.data[0];
          form.setFieldsValue({
            prix_unitaire: articleData.prix_unitaire || 0,
            quantite_demande: articleData.quantite || 0,
          });
          handleFieldChange(); // Calculate montant after setting fields
        } catch (error) {
          handleError("Une erreur est survenue lors du chargement des données de l'article.");
        }
      }
    };

    fetchArticleData();
  }, [articleId, fournisseurId]);

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFinish}
      initialValues={{
        quantite_demande: 0.00,
        montant: calculateMontant(0, 0),
      }}
    >
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label="Article"
            name="article"
            rules={[{ required: true, message: 'Veuillez sélectionner un article' }]}
          >
            <Select onChange={(value) => setArticleId(value)} placeholder="Sélectionnez un article">
              {article.map((art) => (
                <Option key={art.id_article} value={art.id_article}>
                  {art.nom_article}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            label="Fournisseur"
            name="fournisseur"
          >
            <Select onChange={(value) => setFournisseurId(value)} placeholder="Sélectionnez un fournisseur">
              {fournisseur.map((f) => (
                <Option key={f.id_fournisseur} value={f.id_fournisseur}>
                  {f.nom_fournisseur}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>

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
              onChange={handleFieldChange}
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
              onChange={handleFieldChange}
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
              onChange={handleQuantiteValideeChange}
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
  );
};

export default BudgetForm;
