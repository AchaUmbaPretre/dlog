import React, { useEffect, useState } from 'react';
import { Form, InputNumber, Select, Button, notification, Table } from 'antd';
import { postBudget } from '../../../services/budgetService';
import { useNavigate } from 'react-router-dom';
import { getBesoinOne } from '../../../services/besoinsService';
import { getOffre, getOffreArticleOne } from '../../../services/offreService';
import './budgetForm.scss'

const { Option } = Select;

const BudgetForm = ({ idProjet }) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [idOffre, setIdOffre] = useState(null);
  const [offreData, setOffreData] = useState([]);
  const [besoin, setBesoin] = useState([]);
  const [nameProjet, setNameProjet] = useState([]);
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

  // Charger les besoins du projet
  useEffect(() => {
    const fetchBesoin = async () => {
      try {
        const response = await getBesoinOne(idProjet);
        console.log('Besoin Data:', response.data);
        setBesoin(response.data);
        setNameProjet(response.data[0].nom_projet)
      } catch (error) {
        handleError('Une erreur est survenue lors du chargement des besoins. Veuillez réessayer plus tard.');
      } finally {
        setLoading(false);
      }
    };

    fetchBesoin();
  }, [idProjet]);

  console.log(besoin)

  // Charger les offres pour un idOffre sélectionné
  useEffect(() => {
    const fetchOffreData = async () => {
      try {
        const response = await getOffreArticleOne(idOffre);
        setOffreData(response.data);
      } catch (error) {
        handleError('Une erreur est survenue lors du chargement des offres.');
      } finally {
        setLoading(false);
      }
    };

      fetchOffreData();
  }, [idOffre]);


  // Charger la liste des offres
  useEffect(() => {
    const fetchFournisseur = async () => {
      try {
        const offreData = await getOffre();
        setOffre(offreData.data);
      } catch (error) {
        handleError('Une erreur est survenue lors du chargement des fournisseurs.');
      }
    };

    fetchFournisseur();
  }, []);

  // Mettre à jour les montants des articles en fonction de l'offre sélectionnée
  useEffect(() => {
    if (offreData.length > 0 && besoin.length > 0) {
      const updatedBesoin = besoin.map((item) => {
        const matchedOffre = offreData.find((offreItem) => offreItem.id_article === item.id_article);
        return {
          ...item,
          montant: matchedOffre ? matchedOffre.prix * item.quantite : 0, // Calculer le montant
        };
      });
      setBesoin(updatedBesoin);
    }
  }, [offreData, besoin]);

  const columns = [
    {
      title: 'Article',
      dataIndex: 'nom_article',
      key: 'nom_article',
    },
    {
      title: 'Qté demandée',
      dataIndex: 'quantite',
      key: 'quantite',
      render: (_, record) => (
        <Form.Item
          name={`quantite_demande_${record.id_article}`}
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
          name={`quantite_validee_${record.id_article}`}
        >
          <InputNumber min={0} />
        </Form.Item>
      ),
    },
    {
      title: 'Montant',
      dataIndex: 'montant',
      key: 'montant',
      render: (_, record) => {
        const offreCorrespondante = offreData.find(
          (offre) => offre.id_article === record.id_article
        );
        const montant = offreCorrespondante ? offreCorrespondante.prix : 0;
  
        return (
          <Form.Item
            name={`montant_${record.id_article}`}
            initialValue={montant}
          >
            <InputNumber min={0} readOnly />
          </Form.Item>
        );
      },
    },
    {
      title: 'MT validé',
      dataIndex: 'montant_valide',
      key: 'montant_valide',
      render: (_, record) => (
        <Form.Item
          name={`montant_valide_${record.id_article}`}
        >
          <InputNumber min={0} />
        </Form.Item>
      ),
    },
  ];
  
  return (
    <>
      <div className="budgetForm">
        <div className="budget-row-h2">
          <h2 className='budget_h2'>{nameProjet}</h2>
        </div>
        <div className="budget_wrapper">
          <Form.Item name="id_offre">
            <Select
              onChange={(value) => setIdOffre(value)}
              placeholder="Sélectionnez une offre"
              showSearch
              options={offre.map((item) => ({
                value: item.id_offre,
                label: item.nom_offre,
              }))}
            />
          </Form.Item>
        </div>
        <Form form={form} layout="vertical" onFinish={handleFinish}>
          <Table columns={columns} dataSource={besoin} rowKey="id_besoin" pagination={false} bordered />
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Soumettre
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

export default BudgetForm;
