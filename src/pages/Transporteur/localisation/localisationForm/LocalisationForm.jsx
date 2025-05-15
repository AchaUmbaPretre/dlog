import { useEffect } from 'react';
import { Form, Input, Button, notification, Row, Col, Select, Card } from 'antd';
import { useState } from 'react';
import { getLocalite, getSiteLoc, getTypeLocalisation, getVille } from '../../../../services/transporteurService';
import { getProvince } from '../../../../services/clientService';

const LocalisationForm = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [site, setSite] = useState([]);
  const [province, setProvince] = useState([]);
  const [localite, setLocalite] = useState([]);
  const [ville, setVille] = useState([]);
  const [type, setType] = useState([]);

  const handleError = (message) => {
    notification.error({
        message: 'Erreur de chargement',
        description: message,
    });
};

  useEffect(() => {
    const fetchData = async () => {
        try {
            const [siteData, provinceData, villeData, typeLocData, localiteData] = await Promise.all([
                getSiteLoc(),
                getProvince(),
                getVille(),
                getTypeLocalisation(),
                getLocalite()
            ]);
            setSite(siteData.data);
            setProvince(provinceData.data);
            setVille(villeData.data);
            setType(typeLocData.data);
            setLocalite(localiteData.data)

        } catch (error) {
            handleError('Une erreur est survenue lors du chargement des données.');
        }
    };

    fetchData();
}, []);

  const handleSubmit = async (values) => {
    setLoading(true); 
    try {
/*       await postFournisseur(values);
 */      notification.success({
        message: 'Succès',
        description: 'Le fournisseur a été enregistré avec succès.',
      });
      form.resetFields();
      window.location.reload();
    } catch (error) {
      notification.error({
        message: 'Erreur',
        description: 'Erreur lors de l\'enregistrement du fournisseur.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
        <div className="controle_form">
            <div className="controle_title_rows">
                <h2 className='controle_h2'>FORM LOCALISATION</h2>                
            </div>
            <div className="controle_wrapper">
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                >
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="id_parent"
                                label="Localité"
                            >
                            <Select
                                mode="multiple"
                                showSearch
                                options={localite.map((item) => ({
                                value: item.id_localite,
                                label: item.nom_localite}))}
                                placeholder="Sélectionnez une localité..."
                                optionFilterProp="label"
                            />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                name="id_parent"
                                label="Province"
                            >
                            <Select
                                mode="multiple"
                                showSearch
                                options={province.map((item) => ({
                                value: item.id,
                                label: item.name}))}
                                placeholder="Sélectionnez une province..."
                                optionFilterProp="label"
                            />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                name="id_parent"
                                label="Ville"
                            >
                                <Select
                                    showSearch
                                    options={ville.map((item) => ({
                                    value: item.id_ville,
                                    label: item.nom_ville}))}
                                    placeholder="Sélectionnez une ville..."
                                    optionFilterProp="label"
                                />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                name="id_parent"
                                label="Site"
                            >
                            <Select
                                mode="multiple"
                                showSearch
                                options={site.map((item) => ({
                                value: item.id_site_loc,
                                label: item.nom_site_loc}))}
                                placeholder="Sélectionnez un site..."
                                optionFilterProp="label"
                            />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading} disabled={loading}>
                        Soumettre
                    </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    </Card>

  );
};

export default LocalisationForm;
