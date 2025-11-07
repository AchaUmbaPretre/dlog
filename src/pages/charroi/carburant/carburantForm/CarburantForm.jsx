import { useEffect, useState, useCallback } from 'react';
import {
  Button,
  Form,
  Input,
  Select,
  Row,
  Col,
  DatePicker,
  notification,
  Skeleton,
  Divider,
  InputNumber
} from 'antd';
import {
  FireOutlined
} from "@ant-design/icons";
import { 
  getChauffeur, 
  getVehicule 
} from '../../../../services/charroiService';
import { 
  getFournisseur_activiteOne 
} from '../../../../services/fournisseurService';
import { 
  getCarburantLimitTen, 
  getCarburantPriceLimit, 
  postCarburant 
} from '../../../../services/carburantService';
import './carburantForm.scss';
import CarburantTableDetail from '../carburantTableDetail/CarburantTableDetail';

const CarburantForm = ({ closeModal, fetchData }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState({ data: false, submit: false });
  const [fournisseurs, setFournisseurs] = useState([]);
  const [vehicules, setVehicules] = useState([]);
  const [chauffeurs, setChauffeurs] = useState([]);
  const [data, setData] = useState([]);

  // 💰 États pour les prix et montants
  const [prixCDF, setPrixCDF] = useState(0);
  const [prixUSD, setPrixUSD] = useState(0);
  const [montantTotalCDF, setMontantTotalCDF] = useState(0);
  const [montantTotalUSD, setMontantTotalUSD] = useState(0);

  // 🔹 Chargement du tableau et du prix carburant
  const fetchDatas = async () => {
    try {
      const [carburantData, prixData] = await Promise.all([
        getCarburantLimitTen(),
        getCarburantPriceLimit()
      ]);

      setData(carburantData.data);

      if (prixData.data && prixData.data.length > 0) {
        const lastPrix = prixData.data[0];
        setPrixCDF(lastPrix.prix_cdf);
        setPrixUSD(lastPrix.taux_usd);
      }
    } catch (error) {
      console.error("Erreur chargement prix carburant :", error);
    }
  };

  useEffect(() => {
    fetchDatas();
  }, []);

  // 🔹 Chargement des véhicules, chauffeurs et fournisseurs
  const fetchInitialData = useCallback(async () => {
    setLoading(prev => ({ ...prev, data: true }));
    try {
      const [vehiculeRes, fournisseurRes, chauffeurRes] = await Promise.all([
        getVehicule(),
        getFournisseur_activiteOne(5),
        getChauffeur()
      ]);

      setVehicules(vehiculeRes?.data?.data || []);
      setFournisseurs(fournisseurRes?.data || []);
      setChauffeurs(chauffeurRes?.data?.data || []);
    } catch (error) {
      notification.error({
        message: 'Erreur de chargement',
        description: 'Impossible de charger les données nécessaires.',
      });
      console.error(error);
    } finally {
      setLoading(prev => ({ ...prev, data: false }));
    }
  }, []);

  useEffect(() => {
    fetchInitialData();
    form.resetFields();
  }, [fetchInitialData, form]);

  // 🔹 Calcul automatique du montant total en CDF et USD
  const handleQuantiteChange = (value) => {
    const quantite = parseFloat(value || 0);
    const totalCDF = quantite * prixCDF;
    const totalUSD = prixUSD > 0 ? totalCDF / prixCDF * prixUSD : 0;

    setMontantTotalCDF(totalCDF);
    setMontantTotalUSD(totalUSD);

    form.setFieldsValue({
      montant_total_cdf: totalCDF,
      montant_total_usd: totalUSD,
    });
  };

  // 🔹 Envoi au backend
  const handleSubmit = async (values) => {
    setLoading(prev => ({ ...prev, submit: true }));
    try {
      const payload = {
        ...values,
        date_operation: values.date_operation?.format('YYYY-MM-DD HH:mm:ss'),
        prix_cdf: prixCDF,
        prix_usd: prixUSD,
        montant_total_cdf: montantTotalCDF,
        montant_total_usd: montantTotalUSD,
      };

      await postCarburant(payload);

      notification.success({
        message: 'Succès',
        description: 'Les informations carburant ont été enregistrées avec succès.',
      });

      form.resetFields();
      closeModal?.();
      fetchData?.();
      fetchDatas();
    } catch (error) {
      notification.error({
        message: 'Erreur',
        description: "Une erreur est survenue lors de l'enregistrement.",
      });
      console.error(error);
    } finally {
      setLoading(prev => ({ ...prev, submit: false }));
    }
  };

  const renderField = (component) =>
    loading.data ? <Skeleton.Input active style={{ width: '100%' }} /> : component;

  return (
    <div className="carburant_container">
      <h2 className="carburant_h2">
        <FireOutlined style={{ color: "#fa541c", marginRight: 8 }} />
        Gestion des carburants
      </h2>
      <Divider />
      <div className="carburant_wrapper">
        <div className="controle_form">
          <div className="controle_title_rows">
            <h2 className="controle_h2">Enregistrer un nouveau carburant</h2>
          </div>
          <div className="controle_wrapper">
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              disabled={loading.data}
            >
              <Row gutter={[16, 16]}>

                {/* Véhicule */}
                <Col xs={24} sm={8}>
                  <Form.Item
                    label="Véhicule"
                    name="id_vehicule"
                    rules={[{ required: true, message: 'Veuillez sélectionner un véhicule.' }]}
                  >
                    {renderField(
                      <Select
                        showSearch
                        placeholder="Sélectionnez un véhicule"
                        optionFilterProp="label"
                        options={vehicules.map(v => ({
                          value: v.id_vehicule,
                          label: `${v.immatriculation} / ${v.nom_marque}`,
                        }))}
                      />
                    )}
                  </Form.Item>
                </Col>

                {/* Date */}
                <Col xs={24} sm={8}>
                  <Form.Item
                    label="Date d'opération"
                    name="date_operation"
                    rules={[{ required: true, message: 'Veuillez sélectionner une date.' }]}
                  >
                    <DatePicker
                      format="YYYY-MM-DD"
                      style={{ width: '100%' }}
                      placeholder="Sélectionnez une date"
                    />
                  </Form.Item>
                </Col>

                {/* Num PC */}
                <Col xs={24} sm={8}>
                  <Form.Item label="Num PC" name="num_pc">
                    {renderField(<Input placeholder="ex: PC-2025-01" />)}
                  </Form.Item>
                </Col>

                {/* Num Facture */}
                <Col xs={24} sm={8}>
                  <Form.Item label="Numéro de facture" name="num_facture">
                    {renderField(<Input placeholder="ex: FCT-2025-01" />)}
                  </Form.Item>
                </Col>

                {/* Chauffeur */}
                <Col xs={24} sm={8}>
                  <Form.Item
                    label="Chauffeur"
                    name="id_chauffeur"
                    rules={[{ required: true, message: 'Veuillez sélectionner un chauffeur.' }]}
                  >
                    {renderField(
                      <Select
                        showSearch
                        placeholder="Sélectionnez un chauffeur"
                        optionFilterProp="label"
                        options={chauffeurs.map(c => ({
                          value: c.id_chauffeur,
                          label: `${c.nom} ${c.prenom}`,
                        }))}
                      />
                    )}
                  </Form.Item>
                </Col>

                {/* Fournisseur */}
                <Col xs={24} sm={8}>
                  <Form.Item
                    label="Fournisseur"
                    name="id_fournisseur"
                    rules={[{ required: true, message: 'Veuillez sélectionner un fournisseur.' }]}
                  >
                    {renderField(
                      <Select
                        showSearch
                        placeholder="Sélectionnez un fournisseur"
                        optionFilterProp="label"
                        options={fournisseurs.map(f => ({
                          value: f.id_fournisseur,
                          label: f.nom_fournisseur,
                        }))}
                      />
                    )}
                  </Form.Item>
                </Col>

                {/* Quantité */}
                <Col xs={24} sm={8}>
                  <Form.Item
                    label="Quantité (Litres)"
                    name="quantite_litres"
                    rules={[{ required: true, message: 'Veuillez entrer la quantité.' }]}
                  >
                    {renderField(
                      <InputNumber
                        placeholder="ex: 50"
                        style={{ width: '100%' }}
                        onChange={handleQuantiteChange}
                      />
                    )}
                  </Form.Item>
                </Col>

                {/* Prix CDF */}
                <Col xs={24} sm={8}>
                  <Form.Item label={`Prix du litre (CDF)`}>
                    <InputNumber value={prixCDF} readOnly style={{ width: '100%' }} />
                  </Form.Item>
                </Col>

                {/* Montant total */}
                <Col xs={24} sm={8}>
                  <Form.Item label="Montant total (CDF)">
                    <InputNumber value={montantTotalCDF} readOnly style={{ width: '100%' }} />
                  </Form.Item>
                </Col>

                {/* Compteur */}
                <Col xs={24} sm={8}>
                  <Form.Item
                    label="Compteur KM (actuel)"
                    name="compteur_km"
                    rules={[{ required: true, message: 'Veuillez entrer le compteur actuel.' }]}
                  >
                    {renderField(<Input type="number" placeholder="ex: 45000" />)}
                  </Form.Item>
                </Col>

                {/* Commentaire */}
                <Col xs={24} sm={16}>
                  <Form.Item label="Commentaire" name="commentaire">
                    {renderField(<Input.TextArea placeholder="Écrire..." style={{ height: '50px', resize: 'none' }} />)}
                  </Form.Item>
                </Col>
              </Row>

              <Row justify="end" style={{ marginTop: 20 }}>
                <Col>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading.submit}
                    disabled={loading.data}
                  >
                    Enregistrer
                  </Button>
                </Col>
              </Row>
            </Form>
          </div>
        </div>

        <div className="controle_right">
          <CarburantTableDetail data={data} loading={loading.data} />
        </div>
      </div>
    </div>
  );
};

export default CarburantForm;
