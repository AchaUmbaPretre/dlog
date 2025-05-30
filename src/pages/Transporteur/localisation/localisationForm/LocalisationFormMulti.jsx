import { useEffect } from 'react';
import { Form, Button, notification, message, Upload, Input, Row, Col, Select, Card } from 'antd';
import { useState } from 'react';
import { PlusCircleOutlined, MinusCircleOutlined, UploadOutlined } from '@ant-design/icons'
import { getLocalite, getPays, getTypeLocalisation, getVille, postLocalisation } from '../../../../services/transporteurService';
import { getProvince } from '../../../../services/clientService';
import * as XLSX from 'xlsx';

const LocalisationFormMulti = ({closeModal, fetchData}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [province, setProvince] = useState([]);
  const [localite, setLocalite] = useState([]);
  const [ville, setVille] = useState([]);
  const [type, setType] = useState([]);
  const [pays, setPays] = useState([]);
  const [typeLocId, setTypeLocId] = useState(null);

    const handleExcelImport = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (evt) => {
        const bstr = evt.target.result;
        const workbook = XLSX.read(bstr, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        // Ignorer les lignes vides
        const filteredRows = rows.filter(row => row.length > 0 && row[0]);

        // Map vers le format attendu par Form.List
        const nomsData = filteredRows.map((row) => ({ nom: row[0] }));

        if (nomsData.length > 0) {
        form.setFieldsValue({ noms: nomsData });
        message.success(`Importé ${nomsData.length} nom(s) depuis le fichier.`);
        } else {
        message.warning("Le fichier ne contient pas de données valides.");
        }
    };

    reader.readAsBinaryString(file);
    };

    const handleError = (message) => {
    notification.error({
        message: 'Erreur de chargement',
        description: message,
    });
    };

    useEffect(() => {
    const fetchData = async () => {
        try {
            const [ provinceData, villeData, typeLocData, localiteData, paysData ] = await Promise.all([
                getProvince(),
                getVille(),
                getTypeLocalisation(),
                getLocalite(),
                getPays(),
            ]);
            setProvince(provinceData.data);
            setVille(villeData.data);
            setType(typeLocData.data);
            setLocalite(localiteData.data);
            setPays(paysData.data);

        } catch (error) {
            handleError('Une erreur est survenue lors du chargement des données.');
        }
    };

    fetchData();
    }, []);

    const handleSubmit = async (values) => {
    await form.validateFields();
    const loadingKey = 'loadingLocalisation';
    message.loading({ content: 'Traitement en cours...', key: loadingKey, duration: 0 });
    setLoading(true);

    try {
        for (const nom of values.noms) {
        const payload = {
            nom : nom.nom,
            type_loc: typeLocId,
            id_parent: values.id_parent,
            commentaire: values.commentaire || ''
        };
        await postLocalisation(payload);
        }

        message.success({ content: 'Localisations enregistrées.', key: loadingKey });
        form.resetFields();
        fetchData();
        closeModal();
    } catch (error) {
        notification.error({
        message: 'Erreur',
        description: 'Erreur lors de l\'enregistrement.',
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

            <Col span={24} style={{ marginBottom: 16 }}>
                <Upload
                    accept=".xlsx,.xls"
                    showUploadList={false}
                    beforeUpload={(file) => {
                    handleExcelImport({ target: { files: [file] } });
                    return false;
                    }}
                >
                    <Button icon={<UploadOutlined />}>Importer depuis Excel</Button>
                </Upload>
            </Col>


            <div className="controle_wrapper">
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                >
                    <Row gutter={16}>
                        <Form.List name="noms" initialValue={[{ nom: '' }]} rules={[{ required: true, message: 'Ajoutez au moins un nom' }]}>
                        {(fields, { add, remove }) => (
                            <>
                            {fields.map(({ key, name, ...restField }) => (
                                <Row key={key} gutter={8} align="middle" style={{ marginBottom: 8, display: 'flex', alignItems:'center', justifyContent:'center'}}>
                                    <Col span={22}>
                                        <Form.Item
                                        {...restField}
                                        name={[name, 'nom']}
                                        rules={[{ required: true, message: 'Nom requis' }]}
                                        >
                                        <Input placeholder="Nom de la localisation..." />
                                        </Form.Item>
                                    </Col>
                                    <Col span={1}>
                                        {fields.length > 1 && (
                                        <Button
                                            danger
                                            type="text"
                                            onClick={() => remove(name)}
                                            style={{ width: '100%', marginBottom:'25px' }}
                                            icon={<MinusCircleOutlined /> }
                                        >
                                        </Button>
                                        )}
                                    </Col>
                                </Row>
                            ))}

                            <Row>
                                <Col span={24}>
                                    <Button
                                        onClick={() => add()}
                                        type="text"
                                        block
                                        icon={<PlusCircleOutlined />}
                                        style={{marginLeft:'5px'}}
                                    >
                                    </Button>
                                </Col>
                            </Row>
                            </>
                        )}
                        </Form.List>

                        <Col span={24}>
                            <Form.Item
                                name="type_loc"
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
                    
                    { typeLocId === "Localité" && 
                        <Col span={24}>
                            <Form.Item
                                name="id_parent"
                                label="Localisation parente (ville)"
                            >
                                <Select
                                    allowClear
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

                    { typeLocId === "Province" &&
                        <Col span={24}>
                            <Form.Item
                                name="id_parent"
                                label="Localisation parente (pays)"
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

                    { typeLocId === "Ville" && 
                        <Col span={24}>
                            <Form.Item
                                name="id_parent"
                                label="Localisation parente (province)"
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

                    { typeLocId === "Commune" && 
                        <Col span={24}>
                            <Form.Item
                                name="id_parent"
                                label="Localisation parente (province)"
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

                    { typeLocId === "Site" &&
                        <Col span={24}>
                            <Form.Item
                                name="id_parent"
                                label="Localisation parente (localité)"
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
                        <Button type="primary" htmlType="submit" loading={loading} disabled={loading}  icon={<PlusCircleOutlined />}>
                            Soumettre
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    </Card>
  );
};

export default LocalisationFormMulti;