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
  getTypeCarburant
} from '../../../../../services/charroiService';
import './carburantForm.scss';
import CarburantTableDetail from '../carburantTableDetail/CarburantTableDetail';
import moment from 'moment';
import ConfirmModal from '../../../../../components/confirmModal/ConfirmModal';
import { useSelector } from 'react-redux';
import { getCarburantLimitTen, getCarburantOne, getCarburantPriceLimit, getCarburantVehicule, postCarburant, putCarburant } from '../../../../../services/carburantService';
import { getFournisseur_activiteOne } from '../../../../../services/fournisseurService';
import CarburantTableDetailThree from '../carburantTableDetailThree/CarburantTableDetailThree';

const CarburantForm = ({ closeModal, fetchData, idCarburant }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState({ data: false, submit: false });
  const [fournisseurs, setFournisseurs] = useState([]);
  const [vehicules, setVehicules] = useState([]);
  const [chauffeurs, setChauffeurs] = useState([]);
  const [data, setData] = useState([]);
  const [type, setType] = useState([]);
  const [idType, setIdType] = useState(null);
  const [vehiculeDataId, setVehiculeDataId] = useState('');
  const [vehiculeId, setVehiculeId] = useState(null);
  const [carburantId, setCarburantId] = useState(null);

  const [prixCDF, setPrixCDF] = useState(0);
  const [prixUSD, setPrixUSD] = useState(0);
  const [montantTotalCDF, setMontantTotalCDF] = useState(0);
  const [montantTotalUSD, setMontantTotalUSD] = useState(0);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [pendingPayload, setPendingPayload] = useState(null);
  const [loadingConfirm, setLoadingConfirm] = useState(false);
  const [forceConfirmation, setForceConfirmation] = useState(false); // Pour le 409
  const [confirmationMessage, setConfirmationMessage] = useState(""); // Message spécifique 409
  const userId = useSelector((state) => state.user?.currentUser?.id_utilisateur);

  const fetchDatas = async () => {
    try {
      const [carburantData, typeData] = await Promise.all([
        getCarburantLimitTen(vehiculeDataId),
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

      if(idCarburant) {
        const { data: vehicules } = await getCarburantOne(vehiculeId,idCarburant);
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
  }, [ carburantId, idType, idCarburant, vehiculeDataId]);

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
  }, [fetchInitialData, form, carburantId]);

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

  const handleSubmit = (values) => {
    const payload = {
      ...values,
      date_operation: values.date_operation?.format('YYYY-MM-DD HH:mm:ss'),
      prix_cdf: prixCDF,
      prix_usd: prixUSD,
      montant_total_cdf: montantTotalCDF,
      montant_total_usd: montantTotalUSD,
      user_cr: userId,
      id_carburant: idCarburant,
    };

    setPendingPayload(payload);
    setForceConfirmation(false);

    setConfirmationMessage(
      idCarburant
        ? "Voulez-vous vraiment modifier ces informations carburant ?"
        : "Voulez-vous vraiment enregistrer ces informations carburant ?"
    );

    setConfirmVisible(true);
  };

  const handleConfirm = async () => {
    if (!pendingPayload) return;
    setLoadingConfirm(true);

    try {
      const payloadToSend = forceConfirmation
        ? { ...pendingPayload, force: 1 }
        : pendingPayload;

      if (idCarburant) {
        await putCarburant(payloadToSend);
      } else {
        await postCarburant(payloadToSend);
      }

      notification.success({
        message: "Succès",
        description: forceConfirmation
          ? "Le plein a été enregistré malgré l'alerte de kilométrage incohérent."
          : idCarburant
          ? "Les informations carburant ont été modifiées avec succès."
          : "Les informations carburant ont été enregistrées avec succès.",
      });

      form.resetFields();
      closeModal?.();
      fetchData?.();
      fetchDatas();
      resetConfirmationState();

    } catch (error) {

      if (
        !forceConfirmation &&
        error?.response?.status === 409 &&
        error?.response?.data?.askConfirmation
      ) {
        setForceConfirmation(true);
        setConfirmationMessage(error.response.data.message);
        return;
      }

      notification.error({
        message: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement.",
      });

      console.error(error);
      resetConfirmationState();

    } finally {
      setLoadingConfirm(false);
    }
  };

  const resetConfirmationState = () => {
    setConfirmVisible(false);
    setPendingPayload(null);
    setForceConfirmation(false);
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
            <h2 className="controle_h2"> {idCarburant ? 'MODIFICATION DU PLEIN' : 'ENREGISTRER UN NOUVEAU PLEIN'}</h2>
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
                        onChange={setVehiculeDataId}
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
                <Col xs={24} sm={16}>
                  <Form.Item
                    label="Compteur KM (actuel)"
                    name="compteur_km"
                    rules={[{ required: true, message: 'Veuillez entrer le compteur actuel.' }]}
                  >
                    {renderField(<Input type="number" placeholder="ex: 45000" />)}
                  </Form.Item>
                </Col>

                {/* Commentaire */}
                <Col xs={24} sm={24}>
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
        { !idCarburant && 
        <div className="controle_right">
          <CarburantTableDetail data={data} setCarburantId={setCarburantId} loading={loading.data} />
          { vehiculeDataId && 
          <CarburantTableDetailThree setCarburantId={setCarburantId} loading={loading.data} vehiculeDataId={vehiculeDataId} />
          }
        </div>
        }
      </div>
      <ConfirmModal
        visible={confirmVisible}
        title={forceConfirmation ? "Kilométrage incohérent" : "Confirmer l'enregistrement"}
        content={confirmationMessage}
        onConfirm={handleConfirm}
        onCancel={() => {
          setConfirmVisible(false);
          setPendingPayload(null);
          setForceConfirmation(false);
        }}
        loading={loadingConfirm}
      />

    </div>
  );
};

export default CarburantForm;
