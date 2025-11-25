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
  Modal,
  InputNumber
} from 'antd';
import {
  FireOutlined
} from "@ant-design/icons";
import { 
  getChauffeur,
  getTypeCarburant
} from '../../../../services/charroiService';
import { 
  getFournisseur_activiteOne 
} from '../../../../services/fournisseurService';
import { 
  getCarburantLimitTen, 
  getCarburantOne, 
  getCarburantPriceLimit, 
  getCarburantVehicule, 
  postCarburant 
} from '../../../../services/carburantService';
import './carburantForm.scss';
import CarburantTableDetail from '../carburantTableDetail/CarburantTableDetail';
import moment from 'moment';

const CarburantForm = ({ closeModal, fetchData }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState({ data: false, submit: false });
  const [fournisseurs, setFournisseurs] = useState([]);
  const [vehicules, setVehicules] = useState([]);
  const [chauffeurs, setChauffeurs] = useState([]);
  const [data, setData] = useState([]);
  const [type, setType] = useState([]);
  const [idType, setIdType] = useState(null);
  const [vehiculeData, setVehiculeData] = useState([]);
  const [vehiculeId, setVehiculeId] = useState(null);
  const [carburantId, setCarburantId] = useState(null);

  const [prixCDF, setPrixCDF] = useState(0);
  const [prixUSD, setPrixUSD] = useState(0);
  const [montantTotalCDF, setMontantTotalCDF] = useState(0);
  const [montantTotalUSD, setMontantTotalUSD] = useState(0);

  const fetchDatas = async () => {
    try {
      const [carburantData, typeData] = await Promise.all([
        getCarburantLimitTen(vehiculeData),
        getTypeCarburant()
      ]);

      setData(carburantData.data);
      setType(typeData.data);

      if(idType) {
        const { data } = await getCarburantPriceLimit(idType);
        if (data) {
          const lastPrix = data;
          setPrixCDF(lastPrix.prix_cdf);
          setPrixUSD(lastPrix.taux_usd);
        }
      }

      if(carburantId) {
        const { data: vehicules } = await getCarburantOne(vehiculeId,carburantId);
        if(vehicules && vehicules[0]) {
          form.setFieldsValue({
            ...vehicules[0],
            date_operation: moment(vehicules[0].date_operation, 'YYYY-MM-DD')
          })
        }
      } 

    } catch (error) {
      console.error("Erreur chargement prix carburant :", error);
    }
  };

  useEffect(() => {
    fetchDatas();
  }, [vehiculeData, carburantId, idType]);

  // Chargement des véhicules, chauffeurs et fournisseurs
  const fetchInitialData = useCallback(async () => {
    setLoading(prev => ({ ...prev, data: true }));
    try {
      const [vehiculeRes, fournisseurRes, chauffeurRes] = await Promise.all([
        getCarburantVehicule(),
        getFournisseur_activiteOne(5),
        getChauffeur()
      ]);

      setVehicules(vehiculeRes?.data|| []);
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
  }, [fetchInitialData, form, carburantId, vehiculeData]);

  // Calcul automatique du montant total en CDF et USD
  const handleQuantiteChange = (value) => {
    const quantite = parseFloat(value || 0);
    const totalCDF = quantite * prixCDF;
    const totalUSD = prixUSD > 0 ? totalCDF / prixUSD : 0;
;

    setMontantTotalCDF(totalCDF);
    setMontantTotalUSD(totalUSD);

    form.setFieldsValue({
      montant_total_cdf: totalCDF,
      montant_total_usd: totalUSD,
    });
  };

  // Envoi au backend
const handleSubmit = async (values) => {
  setLoading(prev => ({ ...prev, submit: true }));

  const payload = {
    ...values,
    date_operation: values.date_operation?.format('YYYY-MM-DD HH:mm:ss'),
    prix_cdf: prixCDF,
    prix_usd: prixUSD,
    montant_total_cdf: montantTotalCDF,
    montant_total_usd: montantTotalUSD,
  };

  try {

    // Première tentative d’enregistrement
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

    if (error?.response?.status === 409 && error.response.data?.askConfirmation) {

      Modal.confirm({
        title: "Kilométrage incohérent",
        content: error.response.data.message,
        okText: "Enregistrer quand même",
        cancelText: "Annuler",
        onOk: async () => {
          try {

            // Envoi avec force = 1
            await postCarburant({ ...payload, force: 1 });

            notification.success({
              message: 'Enregistré malgré incohérence',
              description: "Le plein a été enregistré avec l'alerte kilométrage incohérent.",
            });

            form.resetFields();
            closeModal?.();
            fetchData?.();
            fetchDatas();

          } catch (forceError) {
            notification.error({
              message: "Erreur",
              description: "L'enregistrement confirmé a échoué.",
            });
            console.error(forceError);
          }
        },
      });

      return; // IMPORTANT : ne pas continuer l'exécution normale
    }

    // ❌ Autres erreurs normales
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
                          value: v.id_enregistrement,
                          label: `${v.immatriculation} / ${v.nom_marque}`,
                        }))}
                        onChange={setVehiculeData}
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

                <Col xs={24} sm={8}>
                  <Form.Item label="Numéro de facture" name="num_facture">
                    {renderField(<Input placeholder="ex: FCT-2025-01" />)}
                  </Form.Item>
                </Col>

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

                <Col xs={24} sm={8}>
                  <Form.Item
                    label="Type de carburant"
                    name="id_type_carburant"
                    rules={[{ required: true, message: 'Veuillez sélectionner un type.' }]}
                  >
                    {renderField(
                      <Select
                        showSearch
                        placeholder="Sélectionnez un type de carburant"
                        optionFilterProp="label"
                        options={type.map(t => ({
                          value: t.id_type_carburant,
                          label: t.nom_type_carburant,
                        }))}
                        onChange={setIdType}
                      />
                    )}
                  </Form.Item>
                </Col>

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
                <Col xs={24} sm={8}>
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
          <CarburantTableDetail data={data} setCarburantId={setCarburantId} loading={loading.data} />
        </div>
      </div>
    </div>
  );
};

export default CarburantForm;
