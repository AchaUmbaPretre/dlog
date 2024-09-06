import React, { useEffect, useState } from 'react';
import { Form, InputNumber, Select, Button, notification, Typography, Spin } from 'antd';
import { postBudget } from '../../../services/budgetService';
import { getBesoinOne } from '../../../services/besoinsService';
import { getOffre, getOffreArticleOne } from '../../../services/offreService';
import './budgetForm.scss';
import { useSelector } from 'react-redux';

const { Option } = Select;
const { Title } = Typography;

const BudgetForm = ({ idProjet }) => {
  const [form] = Form.useForm();
  const [besoin, setBesoin] = useState([]);
  const [nameProjet, setNameProjet] = useState([]);
  const [offre, setOffre] = useState([]);
  const [validatedData, setValidatedData] = useState({});
  const [loading, setLoading] = useState(false);
  const userId = useSelector((state) => state.user?.currentUser.id_utilisateur);

  useEffect(() => {
    const fetchBesoin = async () => {
      try {
        const response = await getBesoinOne(idProjet);
        setBesoin(response.data);
        setNameProjet(response.data[0]?.nom_projet)
      } catch (error) {
        notification.error({ message: 'Erreur lors du chargement des besoins' });
      }
    };

    fetchBesoin();
  }, [idProjet]);

  useEffect(() => {
    const fetchOffres = async () => {
      try {
        const response = await getOffre();
        setOffre(response.data);
      } catch (error) {
        notification.error({ message: 'Erreur lors du chargement des offres' });
      }
    };

    fetchOffres();
  }, []);

  const handleOffreChange = async (id_article, id_offre) => {
    try {
      const response = await getOffreArticleOne(id_offre);
      const articleData = response.data.find(item => item.id_article === id_article);

      if (!articleData) {
        notification.error({ message: "Aucun article trouvé pour cette offre" });
        return;
      }

      setValidatedData((prevState) => ({
        ...prevState,
        [id_article]: { ...prevState[id_article], id_offre, prix: articleData.prix },
      }));
    } catch (error) {
      notification.error({ message: "Erreur lors du chargement de l'offre" });
    }
  };

  const handleQuantityChange = (id_article, quantiteValide) => {
    const prix = validatedData[id_article]?.prix || 0;
    const montantValide = quantiteValide * prix;
    const item = besoin.find(b => b.id_article === id_article);
    const montantDemande = (item?.quantite || 0) * (prix || 0);

    setValidatedData((prevState) => ({
      ...prevState,
      [id_article]: { ...prevState[id_article], quantiteValide, montantValide, montantDemande },
    }));
  };

  const handleSubmitLine = async (id_article) => {
    try {
      const { id_offre, quantiteValide, montantValide, prix, montantDemande } = validatedData[id_article] || {};
      const item = besoin.find(b => b.id_article === id_article);

      if (!id_offre || !quantiteValide) {
        notification.error({ message: 'Veuillez sélectionner une offre et entrer une quantité validée' });
        return;
      }

      setLoading(true);

      const lineData = {
        id_projet: idProjet,
        article: id_article,
        id_offre,
        quantite_validee: quantiteValide,
        montant_valide: montantValide,
        prix_unitaire: prix,
        montant: montantDemande,
        quantite_demande: item.quantite,
        user_cr: userId
      };

      await postBudget(lineData);
      notification.success({ message: `Ligne soumise pour l'article ${id_article}` });
    } catch (error) {
      notification.error({ message: 'Erreur lors de la soumission de la ligne' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="budgetForm">
      <div className="budget-row-h2">
        <h1 className="budget_h1">Titre : {nameProjet}</h1>
      </div>
      <Title level={3} className="form-title">Formulaire de Budget</Title>
      <Spin spinning={loading}>
        <Form form={form} layout="vertical">
          {besoin.length > 0 ? (
            <table className="budget-table">
              <thead>
                <tr>
                  <th>Article</th>
                  <th>Qté demandée</th>
                  <th>Offre</th>
                  <th>P.U</th>
                  <th>Montant</th>
                  <th>Qté validée</th>
                  <th>$ validé</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {besoin.map((item) => {
                  const validatedInfo = validatedData[item.id_article] || {};
                  const montantDemande = item.quantite * validatedInfo.prix || 0;

                  return (
                    <tr key={item.id_article} className="table-row">
                      <td>{item.nom_article}</td>
                      <td>{item.quantite}</td>
                      <td>
                        <Select
                          placeholder="Sélectionner une offre"
                          onChange={(value) => handleOffreChange(item.id_article, value)}
                          className="select-offre"
                          allowClear
                        >
                          {offre.map((offreItem) => (
                            <Option key={offreItem.id_offre} value={offreItem.id_offre}>
                              {offreItem.nom_offre}
                            </Option>
                          ))}
                        </Select>
                      </td>
                      <td>{validatedInfo.prix !== undefined ? validatedInfo.prix : 'Non défini'} {validatedInfo.prix !== undefined && '$'}</td>                      <td>{montantDemande.toFixed(2)}</td>
                      <td>
                        <InputNumber
                          min={0}
                          value={validatedInfo.quantiteValide}
                          onChange={(value) => handleQuantityChange(item.id_article, value)}
                          className="input-quantity"
                        />
                      </td>
                      <td>{validatedInfo.montantValide?.toFixed(2) || 0}</td>
                      <td>
                        <Button
                          type="primary"
                          onClick={() => handleSubmitLine(item.id_article)}
                          loading={loading}
                          className="submit-button"
                          disabled={loading}
                        >
                          Soumettre
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <p>Aucun besoin trouvé pour ce projet.</p>
          )}
        </Form>
      </Spin>
    </div>
  );
};

export default BudgetForm;
