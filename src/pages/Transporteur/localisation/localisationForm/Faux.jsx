import { useEffect } from 'react';
import { Form, Button, notification, message, Input, Row, Col, Select, Card } from 'antd';
import { useState } from 'react';
import { getCommune, getLocalite, getPays, getSiteLoc, getTypeLocalisation, getVille, postLocalisation } from '../../../../services/transporteurService';
import { getProvince } from '../../../../services/clientService';

const LocalisationFormF = ({closeModal, fetchData}) => {
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
  const [idParent, setIdParent] = useState(null)


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
    await form.validateFields();
        
    const loadingKey = 'loadingLocalisation';
    message.loading({ content: 'Traitement en cours, veuillez patienter...', key: loadingKey, duration: 0 });
        
    setLoading(true); 

    try {
        const v = {
            ...values,
            type_loc: typeLocId,
            id_parent : idParent
        }
        await postLocalisation(v)
        message.success({ content: 'La localisation a été enregistrée avec succès.', key: loadingKey });
        form.resetFields();
        fetchData();
        closeModal();
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
                <h2 className='controle_h2'>CREER UNE LOCALISATION</h2>                
            </div>
            <div className="controle_wrapper">
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                >
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                name="nom"
                                label="Type de localisation"
                                rules={[{ required: true, message: 'Veuillez sélectionner un type de localisation' }]}
                            >
                                <Select
                                    allowClear
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
                    
                    { typeLocId === "localité" && 
                        <Col span={24}>
                            <Form.Item
                                name="id_titre"
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
                                onChange={(value) => {
                                    const selected = localite.find(item => item.id_localite === value);
                                    if (selected) {
                                        setIdParent(selected.id_parent); 
                                    }
                                    }}
                            />
                            </Form.Item>
                        </Col>
                    }

                    { typeLocId === "province" &&
                        <Col span={24}>
                            <Form.Item
                                name="id_titre"
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
                                onChange={(value) => {
                                    const selected = province.find(item => item.id === value);
                                    if (selected) {
                                        setIdParent(selected.id_parent); 
                                    }
                                    }}
                            />
                            </Form.Item>
                        </Col>
                    }

                    { typeLocId === "ville" && 
                        <Col span={24}>
                            <Form.Item
                                name="id_titre"
                                label="Ville"
                            >
                                <Select
                                    allowClear
                                    showSearch
                                    options={ville.map((item) => ({
                                    value: item.id_ville,
                                    label: item.nom_ville}))}
                                    placeholder="Sélectionnez une ville..."
                                    optionFilterProp="label"
                                    onChange={(value) => {
                                    const selected = ville.find(item => item.id_ville === value);
                                    if (selected) {
                                        setIdParent(selected.id_parent); 
                                    }
                                    }}
                                />
                            </Form.Item>
                        </Col>
                    }

                    { typeLocId === "commune" && 
                        <Col span={24}>
                            <Form.Item
                                name="id_titre"
                                label="Commune"
                            >
                                <Select
                                    allowClear
                                    showSearch
                                    options={commune.map((item) => ({
                                    value: item.id_commune,
                                    label: item.nom_commune}))}
                                    placeholder="Sélectionnez une commune..."
                                    optionFilterProp="label"
                                    onChange={(value) => {
                                    const selected = commune.find(item => item.id_commune === value);
                                    if (selected) {
                                        setIdParent(selected.id_parent); 
                                    }
                                    }}
                                />
                            </Form.Item>
                        </Col>
                    }

                    { typeLocId === "site" &&
                        <Col span={24}>
                            <Form.Item
                                name="id_titre"
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
                                onChange={(value) => {
                                    const selected = site.find(item => item.id_site_loc === value);
                                        if (selected) {
                                            setIdParent(selected.id_parent); 
                                        }
                                    }}
                            />
                            </Form.Item>
                        </Col>
                    }

                    { typeLocId === "pays" && 
                        <Col span={24}>
                            <Form.Item
                                name="id_titre"
                                label="Pays"
                            >
                                <Select
                                    allowClear
                                    showSearch
                                    options={pays.map((item) => ({
                                    value: item.id_pays ,
                                    label: item.nom_pays}))}
                                    placeholder="Sélectionnez un pays..."
                                    optionFilterProp="label"
                                    onChange={(value) => {
                                        const selected = pays.find(item => item.id_pays === value);
                                        if (selected) {
                                            setIdParent(selected.id_parent); 
                                        }
                                        }}
                                />
                            </Form.Item>
                        </Col>
                    }

{/*                         <Col span={24}>
                            <Form.Item
                                name="id_parent"
                                label="Localisation parente"
                            >
                                <Select
                                    allowClear
                                    showSearch
                                    options={pays.map((item) => ({
                                    value: item.id_pays ,
                                    label: item.nom_pays}))}
                                    placeholder="Sélectionnez un pays..."
                                    optionFilterProp="label"
                                    onChange={(value) => {
                                        const selected = pays.find(item => item.id_pays === value);
                                        if (selected) {
                                            setIdParent(selected.id_parent); 
                                        }
                                        }}
                                />
                            </Form.Item>
                        </Col> */}

                        <Col span={24}>
                            <Form.Item
                                name="commentaire"
                                label="Commentaire"
                            >
                                <Input.TextArea placeholder="Saisir le commentaire..." style={{width:'100%', resize:'none', height:'80px'}}/>
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

export default LocalisationFormF;
