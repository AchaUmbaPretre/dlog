import { useEffect, useState } from 'react';
import {
  Form,
  Input,
  message,
  Switch,
  Select,
  Skeleton,
  notification,
  Row,
  Col,
  Button,
  AutoComplete
} from 'antd';
import { getCatVehicule, getMotif, getVisiteurVehiculeSearch, postVisiteurVehicule } from '../../../../../services/charroiService';
import { useSelector } from 'react-redux';
import moment from 'moment';

const VisiteurRetourExcelForm = ({ closeModal }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const userId = useSelector((state) => state.user?.currentUser?.id_utilisateur);
  const [motif, setMotif] = useState([]);
  const [catVehicule, setCatVehicule] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [motifData, catData] = await Promise.all([
          getMotif(),
          getCatVehicule()
        ]);
        setMotif(motifData.data);
        setCatVehicule(catData.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoadingData(false);
      }
    };
    fetch();
  }, []);

  const fetchPlaques = async (value) => {
    if (!value || value.length < 2) {
      setSuggestions([]);
      return;
    }

    try {
      const { data } = await getVisiteurVehiculeSearch(value);

      const formatted = data.map(item => ({
        value: item.immatriculation,
        label: `${item.immatriculation} (${item.nom_chauffeur || 'Inconnu'})`,
        item,
      }));

      setSuggestions(formatted);
    } catch (error) {
      console.error('Erreur lors de la recherche de plaques :', error);
    }
  };

const handleSelectPlaque = (value, option) => {
  console.log('Option sélectionnée:', option);
  const selected = option.item;

  if (selected) {
    form.setFieldsValue({
      nom_chauffeur: selected.nom_chauffeur,
      type_vehicule: selected.type_vehicule,
      entreprise: selected.entreprise,
      id_motif: selected.id_motif,
      proprietaire: selected.proprietaire,
      vehicule_connu: !!selected.vehicule_connu
    });
  }
};

  const onFinish = async (values) => {
    setLoading(true);
    const loadingKey = 'loadingVisiteur';

    try {
      const value = {
        ...values,
        date_sortie : moment().format('YYYY-MM-DD HH:mm:ss'),
        user_cr: userId
      };

      message.loading({ content: 'En cours...', key: loadingKey });
      await postVisiteurVehicule(value);
      message.success({
        content: 'Le visiteur a été enregistré avec succès.',
        key: loadingKey,
      });

      form.resetFields();
      closeModal();
    } catch (error) {
      console.error("Erreur lors de l'ajout d'un visiteur :", error);
      notification.error({
        message: 'Erreur',
        description: error.response?.data?.error || "Une erreur inconnue s'est produite.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="controle_form">
      <div className="controle_title_rows">
        <h2 className="controle_h2">Enregistrer la sortie du visiteur</h2>
      </div>
      <div className="controle_wrapper">
        <Form layout="vertical" onFinish={onFinish} form={form}>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                label="Immatriculation"
                name="immatriculation"
                rules={[{ required: true, message: 'Immatriculation est requise' }]}
              >
                <AutoComplete
                  onSearch={fetchPlaques}
                  onSelect={handleSelectPlaque}
                  options={suggestions}
                  placeholder="Ex: 3FB21..."
                  filterOption={false}
                />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item label="Type véhicule" name="type_vehicule">
                <Select
                  showSearch
                  allowClear
                  options={catVehicule.map((item) => ({
                    value: item.id_cat_vehicule,
                    label: item.nom_cat,
                  }))}
                  placeholder="Sélectionnez une catégorie..."
                  optionFilterProp="label"
                />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item
                label="Chauffeur"
                name="nom_chauffeur"
                rules={[{ required: true, message: 'Le nom du chauffeur est requis' }]}
              >
                <Input placeholder="Entrer le nom du chauffeur..." />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item
                label="Propriétaire"
                name="proprietaire"
                rules={[{ required: true, message: 'Veuillez sélectionner un propriétaire' }]}
              >
                <Select
                  showSearch
                  allowClear
                  placeholder="Sélectionnez une catégorie..."
                  optionFilterProp="label"
                  options={[
                    { value: 'GTM', label: 'GTM' },
                    { value: 'Visiteur GTM', label: 'Visiteur GTM' },
                    { value: 'Visiteur Externe', label: 'Visiteur Externe' },
                  ]}
                />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item label="Entreprise" name="entreprise">
                <Input placeholder="Entrer le nom de l'entreprise..." />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                label="Motif"
                name="id_motif"
                rules={[{ required: true, message: 'Veuillez sélectionner un motif' }]}
              >
                {loadingData ? (
                  <Skeleton.Input active={true} />
                ) : (
                  <Select
                    allowClear
                    showSearch
                    options={motif?.map((item) => ({
                      value: item.id_motif_demande,
                      label: item.nom_motif_demande,
                    }))}
                    optionFilterProp="label"
                    placeholder="Sélectionnez..."
                  />
                )}
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                label="Véhicule déjà connu"
                name="vehicule_connu"
                valuePropName="checked"
                tooltip="Indiquez si le véhicule a déjà été enregistré dans le système"
              >
                <Switch
                  checkedChildren="Oui"
                  unCheckedChildren="Non"
                />
              </Form.Item>
            </Col>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading} disabled={loading}>
                Enregistrer
              </Button>
            </Form.Item>
          </Row>
        </Form>
      </div>
    </div>
  );
};

export default VisiteurRetourExcelForm;