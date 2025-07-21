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
  AutoComplete,
  Upload
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import {
  getCatVehicule,
  getMotif,
  getVisiteurVehiculeSearch,
  postVisiteurVehicule
} from '../../../../../services/charroiService';
import { useSelector } from 'react-redux';

const SecuriteVisiteurForm = ({ closeModal }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [motif, setMotif] = useState([]);
  const [catVehicule, setCatVehicule] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [imageUrl, setPreviewImage] = useState(null);

  const userId = useSelector((state) => state.user?.currentUser?.id_utilisateur);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [motifData, catData] = await Promise.all([getMotif(), getCatVehicule()]);
        setMotif(motifData.data);
        setCatVehicule(catData.data);
      } catch (error) {
        console.error('Erreur lors du chargement des données :', error);
      } finally {
        setLoadingData(false);
      }
    };
    fetchData();
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
    const selected = option.item;
    if (selected) {
      form.setFieldsValue({
        nom_chauffeur: selected.nom_chauffeur,
        type_vehicule: selected.type_vehicule,
        entreprise: selected.entreprise,
        id_motif: selected.id_motif,
        proprietaire: selected.proprietaire,
        vehicule_connu: !!selected.vehicule_connu,
      });
    }
  };

  const handleChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    if (newFileList.length > 0 && newFileList[0].originFileObj) {
      setPreviewImage(URL.createObjectURL(newFileList[0].originFileObj));
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    const loadingKey = 'loadingVisiteur';

    try {
      const values = await form.validateFields();

      const formData = new FormData();
      formData.append("immatriculation", values.immatriculation);
      formData.append("type_vehicule", values.type_vehicule);
      formData.append("nom_chauffeur", values.nom_chauffeur);
      formData.append("proprietaire", values.proprietaire);
      formData.append("id_motif", values.id_motif);
      formData.append("entreprise", values.entreprise || '');
      formData.append("vehicule_connu", values.vehicule_connu ? '1' : '0');
      formData.append("user_cr", userId);

      if (fileList.length > 0 && fileList[0].originFileObj) {
        formData.append("img", fileList[0].originFileObj);
      }

      message.loading({ content: 'Enregistrement...', key: loadingKey });
      await postVisiteurVehicule(formData);
      message.success({
        content: 'Visiteur enregistré avec succès.',
        key: loadingKey,
      });

      form.resetFields();
      setFileList([]);
      setPreviewImage(null);
      closeModal();

    } catch (error) {
      console.error("Erreur soumission :", error);
      notification.error({
        message: 'Erreur',
        description: error.response?.data?.error || "Une erreur est survenue.",
      });
    } finally {
      setLoading(false);
    }
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Ajouter</div>
    </div>
  );

  return (
    <div className="controle_form">
      <div className="controle_title_rows">
        <h2 className="controle_h2">FORM DU VISITEUR</h2>
      </div>
      <div className="controle_wrapper">
        <Form layout="vertical" form={form}>
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
                  placeholder="Sélectionnez une catégorie..."
                  optionFilterProp="children"
                  options={catVehicule.map(item => ({
                    value: item.id_cat_vehicule,
                    label: item.nom_cat,
                  }))}
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
                  placeholder="Sélectionnez un propriétaire..."
                  optionFilterProp="children"
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
                  <Skeleton.Input active />
                ) : (
                  <Select
                    allowClear
                    showSearch
                    placeholder="Sélectionnez..."
                    optionFilterProp="children"
                    options={motif.map(item => ({
                      value: item.id_motif_demande,
                      label: item.nom_motif_demande,
                    }))}
                  />
                )}
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item label="Image" name="img">
                <Upload
                  accept="image/*"
                  listType="picture-card"
                  beforeUpload={() => false}
                  fileList={fileList}
                  onChange={handleChange}
                >
                  {imageUrl ? (
                    <img src={imageUrl} alt="Aperçu" style={{ width: '100%' }} />
                  ) : (
                    uploadButton
                  )}
                </Upload>
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                label="Véhicule déjà connu"
                name="vehicule_connu"
                valuePropName="checked"
                tooltip="Indiquez si le véhicule a déjà été enregistré dans le système"
              >
                <Switch checkedChildren="Oui" unCheckedChildren="Non" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Button type="primary" onClick={handleSubmit} loading={loading}>
              Enregistrer
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default SecuriteVisiteurForm;
