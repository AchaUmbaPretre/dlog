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
  Typography,
} from 'antd';
import moment from 'moment';
import { getChauffeur, getVehicule } from '../../../../services/charroiService';
import { getFournisseur } from '../../../../services/fournisseurService';
import { postCarburant } from '../../../../services/carburantService';

const { Title } = Typography;

const CarburantForm = ({ closeModal, fetchData }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState({ data: false, submit: false });
  const [fournisseurs, setFournisseurs] = useState([]);
  const [vehicules, setVehicules] = useState([]);
  const [chauffeurs, setChauffeurs] = useState([]);

  /**
   * 🔹 Chargement simultané des données
   */
  const fetchInitialData = useCallback(async () => {
    setLoading(prev => ({ ...prev, data: true }));
    try {
      const [vehiculeRes, fournisseurRes, chauffeurRes] = await Promise.all([
        getVehicule(),
        getFournisseur(),
        getChauffeur(),
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

  /**
   * 🔹 Calcul automatique du montant total
   */
  const handleValueChange = (_, allValues) => {
    const { quantite_litres, prix_unitaire } = allValues;
    if (quantite_litres && prix_unitaire) {
      const montant = parseFloat(quantite_litres) * parseFloat(prix_unitaire);
      form.setFieldsValue({ montant_total: montant });
    } else {
      form.setFieldsValue({ montant_total: undefined });
    }
  };

  /**
   * 🔹 Soumission du formulaire
   */
  const handleSubmit = async (values) => {
    setLoading(prev => ({ ...prev, submit: true }));
    try {
      const payload = {
        ...values,
        date_operation: values.date_operation?.format('YYYY-MM-DD'),
      };

      await postCarburant(payload);

      notification.success({
        message: 'Succès',
        description: 'Les informations carburant ont été enregistrées avec succès.',
      });

      form.resetFields();
      closeModal?.();
      fetchData?.();
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
    <div className="controle_form">
        <div className="controle_title_rows">
            <h2 className="controle_h2">Enregistrer un nouveau carburant</h2>
        </div>
        <div className="controle_wrapper">
            <Form
                form={form}
                layout="vertical"
                onValuesChange={handleValueChange}
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

                {/* Numéro PC */}
                <Col xs={24} sm={8}>
                    <Form.Item
                    label="Num PC"
                    name="num_pc"
                    rules={[{ required: true, message: 'Veuillez entrer le numéro PC.' }]}
                    >
                    {renderField(<Input placeholder="ex: PC-2025-01" />)}
                    </Form.Item>
                </Col>

                {/* Numéro facture */}
                <Col xs={24} sm={8}>
                    <Form.Item
                    label="Numéro de facture"
                    name="num_facture"
                    rules={[{ required: true, message: 'Veuillez entrer le numéro de facture.' }]}
                    >
                    {renderField(<Input placeholder="ex: FCT-2025-01" />)}
                    </Form.Item>
                </Col>

                {/* Date */}
                <Col xs={24} sm={8}>
                    <Form.Item
                    label="Date d'opération"
                    name="date_operation"
                    rules={[{ required: true, message: 'Veuillez sélectionner une date.' }]}
                    >
                    {renderField(
                        <DatePicker
                        format="YYYY-MM-DD"
                        style={{ width: '100%' }}
                        placeholder="Sélectionnez une date"
                        />
                    )}
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

                {/* Prix unitaire */}
                <Col xs={24} sm={8}>
                    <Form.Item
                    label="Consom/100km"
                    name="consommation"
                    rules={[{ required: true, message: 'Veuillez entrer la consommation' }]}
                    >
                    {renderField(<Input type="number" placeholder="ex: 2500" />)}
                    </Form.Item>
                </Col>
                
                <Col xs={24} sm={8}>
                    <Form.Item
                    label="Distance parcourue"
                    name="distance"
                    rules={[{ required: true, message: 'Veuillez entrer la distance parcourue.' }]}
                    >
                    {renderField(<Input type="number" placeholder="ex: 2500" />)}
                    </Form.Item>
                </Col>

                {/* Quantité */}
                <Col xs={24} sm={8}>
                    <Form.Item
                    label="Quantité (Litres)"
                    name="quantite_litres"
                    rules={[{ required: true, message: 'Veuillez entrer la quantité.' }]}
                    >
                    {renderField(<Input type="number" placeholder="ex: 50" />)}
                    </Form.Item>
                </Col>

                {/* Prix unitaire */}
                <Col xs={24} sm={8}>
                    <Form.Item
                    label="Prix Unitaire (CDF)"
                    name="prix_unitaire"
                    rules={[{ required: true, message: 'Veuillez entrer le prix unitaire.' }]}
                    >
                    {renderField(<Input type="number" placeholder="ex: 2500" />)}
                    </Form.Item>
                </Col>

                {/* Montant total (calculé automatiquement) */}
                <Col xs={24} sm={8}>
                    <Form.Item
                    label="Montant Total (CDF)"
                    name="montant_total"
                    rules={[{ required: true, message: 'Le montant total est requis.' }]}
                    >
                    {renderField(
                        <Input
                        type="number"
                        placeholder="Calculé automatiquement"
                        disabled
                        style={{ backgroundColor: '#fafafa' }}
                        />
                    )}
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
  );
};

export default CarburantForm;
