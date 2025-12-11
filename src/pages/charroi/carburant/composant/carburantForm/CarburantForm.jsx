import { useEffect, useState, useCallback } from "react";
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
  InputNumber,
} from "antd";
import {
  FireOutlined,
  ClearOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import moment from "moment";
import { useSelector } from "react-redux";

import {
  getChauffeur,
  getTypeCarburant,
} from "../../../../../services/charroiService";

import {
  getCarburantLimitTen,
  getCarburantOne,
  getCarburantPriceLimit,
  getCarburantVehicule,
  postCarburant,
  putCarburant,
} from "../../../../../services/carburantService";

import { getFournisseur_activiteOne } from "../../../../../services/fournisseurService";

import CarburantTableDetail from "../carburantTableDetail/CarburantTableDetail";
import CarburantTableDetailThree from "../carburantTableDetailThree/CarburantTableDetailThree";
import ConfirmModal from "../../../../../components/confirmModal/ConfirmModal";

import "./carburantForm.scss";
import { renderField } from "../../../../../utils/renderFieldSkeleton";

const CarburantForm = ({ closeModal, fetchData, idCarburant }) => {
  const [form] = Form.useForm();

  const [loading, setLoading] = useState({ data: false, submit: false });
  const [fournisseurs, setFournisseurs] = useState([]);
  const [vehicules, setVehicules] = useState([]);
  const [chauffeurs, setChauffeurs] = useState([]);

  const [data, setData] = useState([]);
  const [type, setType] = useState([]);

  const [idType, setIdType] = useState(null);
  const [vehiculeDataId, setVehiculeDataId] = useState("");
  const [vehiculeId, setVehiculeId] = useState(null);
  const [carburantId, setCarburantId] = useState(null);

  const [prixCDF, setPrixCDF] = useState(0);
  const [prixUSD, setPrixUSD] = useState(0);

  const [montantTotalCDF, setMontantTotalCDF] = useState(0);
  const [montantTotalUSD, setMontantTotalUSD] = useState(0);

  const [confirmVisible, setConfirmVisible] = useState(false);
  const [pendingPayload, setPendingPayload] = useState(null);
  const [loadingConfirm, setLoadingConfirm] = useState(false);
  const [forceConfirmation, setForceConfirmation] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState("");
  
  const userId = useSelector(
    (state) => state.user?.currentUser?.id_utilisateur
  );

  const fetchDatas = async () => {
    try {
      const [carburantData, typeData] = await Promise.all([
        getCarburantLimitTen(''),
        getTypeCarburant(),
      ]);

      setData(carburantData.data);
      setType(typeData.data);

      if (idType) {
        const { data } = await getCarburantPriceLimit(idType);
        if (data) {
          setPrixCDF(data.prix_cdf);
          setPrixUSD(data.taux_usd);
        }
      }

      const carburantToLoad = carburantId || idCarburant;
      if (carburantToLoad) {
        const { data: vehiculeRes } = await getCarburantOne(
          vehiculeId,
          carburantToLoad
        );

        if (vehiculeRes?.[0]) {
          form.setFieldsValue({
            ...vehiculeRes[0],
            date_operation: moment(vehiculeRes[0].date_operation),
          });
        }
      }
    } catch (error) {
      console.error("Erreur chargement prix carburant :", error);
    }
  };

  useEffect(() => {
    fetchDatas();
  }, [carburantId, idType, idCarburant, vehiculeDataId]);
  
  const fetchInitialData = useCallback(async () => {
    setLoading((prev) => ({ ...prev, data: true }));
    try {
      const [vehiculeRes, fournisseurRes, chauffeurRes] = await Promise.all([
        getCarburantVehicule(),
        getFournisseur_activiteOne(5),
        getChauffeur(),
      ]);

      setVehicules(vehiculeRes?.data || []);
      setFournisseurs(fournisseurRes?.data || []);
      setChauffeurs(chauffeurRes?.data?.data || []);
    } catch (error) {
      notification.error({
        message: "Erreur de chargement",
        description: "Impossible de charger les données initiales.",
      });
      console.error(error);
    } finally {
      setLoading((prev) => ({ ...prev, data: false }));
    }
  }, []);

  useEffect(() => {
    fetchInitialData();
    form.resetFields();
  }, [fetchInitialData, form, carburantId]);

  const handleQuantiteChange = (value) => {
    const quantite = parseFloat(value || 0);
    const totalCDF = quantite * prixCDF;
    const totalUSD = prixUSD ? totalCDF / prixUSD : 0;

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
      date_operation: values.date_operation?.format("YYYY-MM-DD HH:mm:ss"),
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
        ? "Voulez-vous vraiment modifier ces informations ?"
        : "Voulez-vous vraiment enregistrer ce plein ?"
    );

    setConfirmVisible(true);
  };

  const handleConfirm = async () => {
    if (!pendingPayload) return;

    setLoadingConfirm(true);
    try {
      const finalPayload = forceConfirmation
        ? { ...pendingPayload, force: 1 }
        : pendingPayload;

      if (idCarburant) {
        await putCarburant(finalPayload);
      } else {
        await postCarburant(finalPayload);
      }

      notification.success({
        message: "Succès",
        description: forceConfirmation
          ? "Le plein a été enregistré malgré la cohérence kilométrique."
          : idCarburant
          ? "Carburant modifié avec succès."
          : "Carburant enregistré avec succès.",
      });

      form.resetFields();

      setIdType(null);
      setVehiculeDataId("");
      setPrixCDF(0);
      setPrixUSD(0);
      setMontantTotalCDF(0);
      setMontantTotalUSD(0);

      resetConfirmationState();

      fetchData?.();
      fetchDatas();

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
        description: "Échec de l'enregistrement.",
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

  const resetFields = () => {
    form.resetFields();
    setIdType(null);
    setVehiculeDataId("");
    setPrixCDF(0);
    setPrixUSD(0);
    setMontantTotalCDF(0);
    setMontantTotalUSD(0);
  };

  return (
    <div className="carburant_container">
      <h2 className="carburant_h2">
        <FireOutlined style={{ color: "#fa541c", marginRight: 8 }} />
        Gestion des carburants
      </h2>

      <Divider />

      <div className="carburant_wrapper">
        {/* FORMULAIRE */}
        <div className="controle_form">
          <div className="controle_title_rows">
            <h2 className="controle_h2">
              {idCarburant
                ? "MODIFICATION DU PLEIN"
                : "ENREGISTRER UN NOUVEAU PLEIN"}
            </h2>
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
                    rules={[
                      {
                        required: true,
                        message: "Veuillez sélectionner un véhicule.",
                      },
                    ]}
                  >
                    {renderField(
                      loading.data,
                      <Select
                        showSearch
                        placeholder="Sélectionnez un véhicule"
                        optionFilterProp="label"
                        options={vehicules.map((v) => ({
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
                    rules={[
                      { required: true, message: "Veuillez sélectionner une date." },
                    ]}
                  >
                    <DatePicker
                      format="YYYY-MM-DD"
                      style={{ width: "100%" }}
                      placeholder="Sélectionnez une date"
                    />
                  </Form.Item>
                </Col>

                {/* Num PC */}
                <Col xs={24} sm={8}>
                  <Form.Item label="Num PC" name="num_pc">
                    {renderField(loading.data, <Input placeholder="ex: PC-2025-01" />)}
                  </Form.Item>
                </Col>

                {/* Facture */}
                <Col xs={24} sm={8}>
                  <Form.Item label="Numéro de facture" name="num_facture">
                    {renderField(loading.data, <Input placeholder="ex: FCT-2025-01" />)}
                  </Form.Item>
                </Col>

                {/* Chauffeur */}
                <Col xs={24} sm={8}>
                  <Form.Item
                    label="Chauffeur"
                    name="id_chauffeur"
                    rules={[
                      { required: true, message: "Veuillez sélectionner un chauffeur." },
                    ]}
                  >
                    {renderField(
                      loading.data,
                      <Select
                        showSearch
                        placeholder="Sélectionnez un chauffeur"
                        optionFilterProp="label"
                        options={chauffeurs.map((c) => ({
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
                    rules={[
                      {
                        required: true,
                        message: "Veuillez sélectionner un fournisseur.",
                      },
                    ]}
                  >
                    {renderField(
                      loading.data,
                      <Select
                        showSearch
                        placeholder="Sélectionnez un fournisseur"
                        optionFilterProp="label"
                        options={fournisseurs.map((f) => ({
                          value: f.id_fournisseur,
                          label: f.nom_fournisseur,
                        }))}
                      />
                    )}
                  </Form.Item>
                </Col>

                {/* Type Carburant */}
                <Col xs={24} sm={8}>
                  <Form.Item
                    label="Type de carburant"
                    name="id_type_carburant"
                    rules={[
                      {
                        required: true,
                        message: "Veuillez sélectionner un type de carburant.",
                      },
                    ]}
                  >
                    {renderField(
                      loading.data,
                      <Select
                        showSearch
                        placeholder="Sélectionnez un type"
                        options={type.map((t) => ({
                          value: t.id_type_carburant,
                          label: t.nom_type_carburant,
                        }))}
                        onChange={setIdType}
                      />
                    )}
                  </Form.Item>
                </Col>

                {/* Quantité */}
                <Col xs={24} sm={8}>
                  <Form.Item
                    label="Quantité (Litres)"
                    name="quantite_litres"
                    rules={[
                      { required: true, message: "Veuillez entrer la quantité." },
                    ]}
                  >
                    {renderField(
                      loading.data,
                      <InputNumber
                        placeholder="ex: 50"
                        style={{ width: "100%" }}
                        onChange={handleQuantiteChange}
                      />
                    )}
                  </Form.Item>
                </Col>

                {/* Prix */}
                <Col xs={24} sm={8}>
                  <Form.Item label="Prix du litre (CDF)">
                    <InputNumber
                      value={prixCDF}
                      readOnly
                      style={{ width: "100%" }}
                    />
                  </Form.Item>
                </Col>

                {/* Montant */}
                <Col xs={24} sm={8}>
                  <Form.Item label="Montant total (CDF)">
                    <InputNumber
                      value={montantTotalCDF}
                      readOnly
                      style={{ width: "100%" }}
                    />
                  </Form.Item>
                </Col>

                {/* Compteur */}
                <Col xs={24} sm={16}>
                  <Form.Item
                    label="Compteur KM (actuel)"
                    name="compteur_km"
                    rules={[
                      {
                        required: true,
                        message: "Veuillez entrer le compteur actuel.",
                      },
                    ]}
                  >
                    {renderField(
                      loading.data,
                      <Input type="number" placeholder="ex: 45000" />
                    )}
                  </Form.Item>
                </Col>

                {/* Commentaire */}
                <Col xs={24}>
                  <Form.Item label="Commentaire" name="commentaire">
                    {renderField(
                      loading.data,
                      <Input.TextArea
                        placeholder="Écrire..."
                        style={{ height: 50, resize: "none" }}
                      />
                    )}
                  </Form.Item>
                </Col>
              </Row>

              {/* Boutons */}
              <Row justify="end" style={{ marginTop: 20 }}>
                <Col>
                  <Button
                    type="primary"
                    htmlType="submit"
                    icon={<SaveOutlined />}
                    loading={loading.submit}
                    disabled={loading.data}
                  >
                    Enregistrer
                  </Button>
                </Col>

                <Col>
                  <Button
                    onClick={resetFields}
                    icon={<ClearOutlined />}
                    disabled={loading.data}
                    className="vehicule-btn"
                    style={{ marginLeft: 10 }}
                  >
                    Annuler
                  </Button>
                </Col>
              </Row>
            </Form>
          </div>
        </div>

        {/* TABLEAUX DROITE */}
        {!idCarburant && (
          <div className="controle_right">
            <CarburantTableDetail
              data={data}
              setCarburantId={setCarburantId}
              loading={loading.data}
            />

            {vehiculeDataId && (
              <CarburantTableDetailThree
                setCarburantId={setCarburantId}
                loading={loading.data}
                vehiculeDataId={vehiculeDataId}
              />
            )}
          </div>
        )}
      </div>

      <ConfirmModal
        visible={confirmVisible}
        title={
          forceConfirmation
            ? "Kilométrage incohérent"
            : "Confirmer l'enregistrement"
        }
        content={confirmationMessage}
        onConfirm={handleConfirm}
        onCancel={resetConfirmationState}
        loading={loadingConfirm}
      />
    </div>
  );
};

export default CarburantForm;