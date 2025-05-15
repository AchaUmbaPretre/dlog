import { useEffect } from 'react';
import { Form, Button, notification, Row, Col, Select, Card } from 'antd';
import { useState } from 'react';
import { getCommune, getLocalite, getPays, getSiteLoc, getTypeLocalisation, getVille } from '../../../../services/transporteurService';
import { getProvince } from '../../../../services/clientService';

const LocalisationForm = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [site, setSite] = useState([]);
  const [province, setProvince] = useState([]);
  const [localite, setLocalite] = useState([]);
  const [ville, setVille] = useState([]);
  const [type, setType] = useState([]);
  const [pays, setPays] = useState([]);
  const [commune, setCommune] = useState([]);
  const [typeLocId, setTypeLocId] = useState(null)

  const handleError = (message) => {
    notification.error({
        message: 'Erreur de chargement',
        description: message,
    });
};

  useEffect(() => {
    const fetchData = async () => {
        try {
            const [siteData, provinceData, villeData, typeLocData, localiteData, paysData, communeData] = await Promise.all([
                getSiteLoc(),
                getProvince(),
                getVille(),
                getTypeLocalisation(),
                getLocalite(),
                getPays(),
                getCommune()

            ]);
            setSite(siteData.data);
            setProvince(provinceData.data);
            setVille(villeData.data);
            setType(typeLocData.data);
            setLocalite(localiteData.data);
            setPays(paysData.data);
            setCommune(communeData.data)

        } catch (error) {
            handleError('Une erreur est survenue lors du chargement des données.');
        }
    };

    fetchData();
}, []);

  const handleSubmit = async (values) => {
    setLoading(true); 
    try {
        const v = {
            ...values,
            type_loc: typeLocId
        }
        console.log(v)
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
                        <Card style={{width:'100%', marginBottom:'10px'}}>
                            <Col span={24}>
                                <Form.Item
                                    name="nom"
                                    label="Type de localisation"
                                    rules={[{ required: true, message: 'Veuillez sélectionner un type de localisation' }]}
                                >
                                <Select
                                    showSearch
                                    placeholder="Sélectionnez un type..."
                                    optionFilterProp="label"
                                    options={type.map((item) => ({
                                    value: item.id_type_localisation,
                                    label: item.nom_type_loc
                                    }))}
                                    onChange={(value) => {
                                    const selected = type.find(item => item.id_type_localisation === value);
                                    if (selected) {
                                        setTypeLocId(selected.nom_type_loc); // ou selected.id_type_localisation selon besoin
                                    }
                                    }}
                                />
                                </Form.Item>
                            </Col>
                        </Card>

                    { typeLocId === "localité" && 
                        <Col span={24}>
                            <Form.Item
                                name="id_loc"
                                label="Localité"
                            >
                            <Select
                                allowClear
                                showSearch
                                options={localite.map((item) => ({
                                value: item.id_localite,
                                label: item.nom_localite}))}
                                placeholder="Sélectionnez une localité..."
                                optionFilterProp="label"
                            />
                            </Form.Item>
                        </Col>
                    }

                    { typeLocId === "province" &&
                        <Col span={24}>
                            <Form.Item
                                name="id_loc"
                                label="Province"
                            >
                            <Select
                                allowClear
                                showSearch
                                options={province.map((item) => ({
                                value: item.id,
                                label: item.name}))}
                                placeholder="Sélectionnez une province..."
                                optionFilterProp="label"
                            />
                            </Form.Item>
                        </Col>
                    }

                    { typeLocId === "ville" && 
                        <Col span={24}>
                            <Form.Item
                                name="id_loc"
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
                    }

                    { typeLocId === "commune" && 
                        <Col span={24}>
                            <Form.Item
                                name="id_loc"
                                label="Commune"
                            >
                                <Select
                                    showSearch
                                    options={commune.map((item) => ({
                                    value: item.id_commune,
                                    label: item.nom_commune}))}
                                    placeholder="Sélectionnez une commune..."
                                    optionFilterProp="label"
                                />
                            </Form.Item>
                        </Col>
                    }

                    { typeLocId === "site" &&
                        <Col span={24}>
                            <Form.Item
                                name="id_loc"
                                label="Site"
                            >
                            <Select
                                allowClear
                                showSearch
                                options={site.map((item) => ({
                                value: item.id_site_loc,
                                label: item.nom_site_loc}))}
                                placeholder="Sélectionnez un site..."
                                optionFilterProp="label"
                            />
                            </Form.Item>
                        </Col>
                    }

                    { typeLocId === "pays" && 
                        <Col span={24}>
                            <Form.Item
                                name="id_loc"
                                label="RDC"
                            >
                            <Select
                                allowClear
                                showSearch
                                options={pays.map((item) => ({
                                value: item.id_pays ,
                                label: item.nom_pays}))}
                                placeholder="Sélectionnez un pays..."
                                optionFilterProp="label"
                            />
                            </Form.Item>
                        </Col>
                    }
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
