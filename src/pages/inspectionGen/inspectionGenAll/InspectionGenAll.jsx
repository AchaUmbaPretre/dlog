import React, { useState, useEffect } from 'react'
import { Form, Select, Input, Button, Divider, Card, Row, Col, InputNumber, message, notification, Space, Tag } from 'antd';
import { MinusCircleOutlined, PlusCircleOutlined, SendOutlined, CarOutlined, CalendarOutlined } from '@ant-design/icons';
import { getTypeReparation, postReparation } from '../../../services/reparateurService';
import { getFournisseur } from '../../../services/fournisseurService';
import moment from 'moment';

const InspectionGenAll = ({ inspectionId, closeModal, fetchDatas }) => {
  const [loading, setLoading] = useState(false);
  const [fournisseur, setFournisseur] = useState([]);
  const [reparation, setReparation] = useState([]);
  const [form] = Form.useForm();
  const [globalDate, setGlobalDate] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const applyGlobalDate = () => {
    if (!globalDate) {
      message.warning('Veuillez d\'abord sélectionner une date');
      return;
    }

    const reparations = form.getFieldValue('reparations') || [];
    reparations.forEach((_, index) => {
      form.setFieldValue(['reparations', index, 'date_reparation'], globalDate);
    });
    message.success(`Date appliquée à toutes les réparations : ${globalDate}`);
  };

  const fetchData = async() => {
    setLoading(true);
    try {
      const [fournisseurData, reparationData] = await Promise.all([
        getFournisseur(),
        getTypeReparation()
      ]);

      setFournisseur(fournisseurData.data);
      setReparation(reparationData.data.data);

    } catch (error) {
      console.error('Error fetching data:', error);
      notification.error({
        message: 'Erreur',
        description: 'Impossible de charger les données nécessaires.',
      });
    } finally {
      setLoading(false);
    }
  };

  const onFinish = async (values) => {
    const loadingKey = 'loadingReparation';
    message.loading({ content: 'Traitement en cours, veuillez patienter...', key: loadingKey, duration: 0 });
    
    setLoading(true);
    try {
      const totalCout = values.reparations.reduce((sum, rep) => sum + (rep.montant || 0), 0);

      const requestData = {
        id_vehicule: inspectionId?.id_vehicule,
        cout: totalCout,
        id_fournisseur: values.id_fournisseur,
        reparations: values.reparations.map(rep => ({
          id_type_reparation: rep.id_type_reparation,
          montant: rep.montant || 0,
          description: rep.description,
          id_statut : 9,
          date_reparation: rep.date_reparation || globalDate || moment().format('YYYY-MM-DD')
        })),
        
        date_entree: moment().format('YYYY-MM-DD'),
        date_prevu: moment().add(3, 'days').format('YYYY-MM-DD'),
        commentaire: values.commentaire || null,
        code_rep: values.code_rep || `REP-${Date.now()}`,
        kilometrage: inspectionId?.kilometrage || null,
        id_statut_vehicule: 2,
        id_sub_inspection_gen: inspectionId?.id_sub_inspection_gen || null,
        inspection_gen: inspectionId?.id_inspection_gen || null
      };

       await postReparation(requestData);
      
      message.success({ content: 'La réparation a été enregistrée avec succès.', key: loadingKey });
      form.resetFields();
      form.setFieldsValue({ reparations: [{}] });
      setGlobalDate('');
      fetchDatas();
      closeModal();
    } catch (error) {
      console.error("Erreur lors de l'ajout de la réparation:", error);
      message.error({ content: 'Une erreur est survenue.', key: loadingKey });
      notification.error({
        message: 'Erreur',
        description: `${error.response?.data?.error || 'Une erreur est survenue lors de l\'enregistrement.'}`,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {inspectionId && (
        <>
          <Divider orientation="left">Informations du véhicule</Divider>
          <Card style={{ marginBottom: 20, backgroundColor: '#f0f5ff' }}>
            <Row gutter={16}>
              <Col xs={24} md={8}>
                <Space>
                  <CarOutlined style={{ fontSize: 20, color: '#1890ff' }} />
                  <div>
                    <div style={{ fontSize: 12, color: '#666' }}>Immatriculation</div>
                    <div style={{ fontSize: 16, fontWeight: 'bold' }}>
                      {inspectionId.immatriculation || 'Non renseignée'}
                    </div>
                  </div>
                </Space>
              </Col>
              <Col xs={24} md={8}>
                <Space>
                  <div>
                    <div style={{ fontSize: 12, color: '#666' }}>Marque</div>
                    <div style={{ fontSize: 16, fontWeight: 'bold' }}>
                      {inspectionId.nom_marque || 'Non renseignée'}
                    </div>
                  </div>
                </Space>
              </Col>
              <Col xs={24} md={8}>
                <Space>
                  <div>
                    <div style={{ fontSize: 12, color: '#666' }}>Chauffeur</div>
                    <div style={{ fontSize: 16, fontWeight: 'bold' }}>
                      {inspectionId.nom_chauffeur && inspectionId.prenom_chauffeur 
                        ? `${inspectionId.nom_chauffeur} ${inspectionId.prenom_chauffeur}`
                        : 'Non renseigné'}
                    </div>
                  </div>
                </Space>
              </Col>
            </Row>
            <Row gutter={16} style={{ marginTop: 12 }}>
              <Col xs={24} md={6}>
                <div style={{ fontSize: 12, color: '#666' }}>Kilométrage</div>
                <div style={{ fontSize: 14 }}>
                  {inspectionId.kilometrage ? `${inspectionId.kilometrage} km` : 'Non renseigné'}
                </div>
              </Col>
              <Col xs={24} md={6}>
                <div style={{ fontSize: 12, color: '#666' }}>Statut</div>
                <Tag color={inspectionId.nom_statut_vehicule === 'Immobile' ? 'red' : 'green'}>
                  {inspectionId.nom_statut_vehicule || 'Non renseigné'}
                </Tag>
              </Col>
              <Col xs={24} md={6}>
                <div style={{ fontSize: 12, color: '#666' }}>Type de statut</div>
                <div style={{ fontSize: 14 }}>{inspectionId.nom_type_statut || 'Non renseigné'}</div>
              </Col>
              <Col xs={24} md={6}>
                <div style={{ fontSize: 12, color: '#666' }}>Budget validé</div>
                <div style={{ fontSize: 14, fontWeight: 'bold', color: '#52c41a' }}>
                  {inspectionId.budget_valide ? `${inspectionId.budget_valide} $` : 'Non renseigné'}
                </div>
              </Col>
            </Row>
          </Card>
        </>
      )}

      <Form 
        form={form} 
        onFinish={onFinish} 
        initialValues={{ reparations: [{}] }}
      >
        <Divider orientation="left">Informations complémentaires</Divider>
        <Card style={{ marginBottom: 20 }}>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="id_fournisseur"
                label="Fournisseur"
                rules={[
                  { required: true, message: 'Veuillez sélectionner un fournisseur' }
                ]}
              >
                <Select
                  showSearch
                  optionFilterProp="label"
                  options={fournisseur.map((item) => ({
                    value: item.id_fournisseur,
                    label: `${item.nom_fournisseur}`,
                  }))}
                  placeholder="Sélectionnez un fournisseur"
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="code_rep"
                label="Code réparation"
              >
                <Input 
                  placeholder="Code réparation (optionnel)"
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={24}>
              <Form.Item
                name="commentaire"
                label="Commentaire"
              >
                <Input.TextArea
                  placeholder="Commentaire (optionnel)"
                  rows={3}
                />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        <Divider orientation="left">Réparations</Divider>
        <Card style={{ marginBottom: 20 }}>
          <Row gutter={12} align="bottom">
            <Col xs={24} md={16}>
              <div style={{ marginBottom: 8, fontWeight: 500 }}>
                <CalendarOutlined /> Date globale pour toutes les réparations
              </div>
              <Input 
                type="date"
                value={globalDate}
                onChange={(e) => setGlobalDate(e.target.value)}
                style={{ width: '100%' }}
                placeholder="Sélectionner une date pour toutes les réparations"
              />
            </Col>
            <Col xs={24} md={8}>
              <Button 
                type="default" 
                icon={<CalendarOutlined />}
                onClick={applyGlobalDate}
                style={{ width: '100%' }}
              >
                Appliquer à toutes les lignes
              </Button>
            </Col>
          </Row>
        </Card>

        <Form.List name="reparations">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Card key={key} style={{ marginBottom: 16 }}>
                  <Row gutter={12}>
                    {/* Type de réparation */}
                    <Col xs={24} md={6}>
                      <div style={{ marginBottom: 8, fontWeight: 500 }}>
                        Type de réparation *
                      </div>
                      <Form.Item
                        {...restField}
                        name={[name, 'id_type_reparation']}
                        rules={[
                          { required: true, message: 'Veuillez fournir une réparation...' },
                        ]}
                        style={{ marginBottom: 0 }}
                      >
                        <Select
                          allowClear
                          showSearch
                          options={reparation.map((item) => ({
                            value: item.id_type_reparation,
                            label: `${item.type_rep}`,
                          }))}
                          placeholder="Sélectionnez un type de réparation..."
                          optionFilterProp="label"
                        />
                      </Form.Item>
                    </Col>

                    {/* Montant */}
                    <Col xs={24} md={5}>
                      <div style={{ marginBottom: 8, fontWeight: 500 }}>
                        Montant
                      </div>
                      <Form.Item
                        {...restField}
                        name={[name, 'montant']}
                        rules={[
                          { required: false, message: 'Veuillez fournir le montant...' },
                        ]}
                        style={{ marginBottom: 0 }}
                      >
                        <InputNumber 
                          min={0} 
                          placeholder="Saisir le montant..." 
                          style={{ width: '100%' }}
                          formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
                          parser={value => value.replace(/\s?/g, '')}
                        />
                      </Form.Item>
                    </Col>

                    <Col xs={24} md={5}>
                      <div style={{ marginBottom: 8, fontWeight: 500 }}>
                        Date de réparation
                      </div>
                      <Form.Item
                        {...restField}
                        name={[name, 'date_reparation']}
                        style={{ marginBottom: 0 }}
                      >
                        <Input 
                          type="date"
                          placeholder="Sélectionner la date"
                          style={{ width: '100%' }}
                        />
                      </Form.Item>
                    </Col>
                    
                    {/* Description */}
                    <Col xs={24} md={6}>
                      <div style={{ marginBottom: 8, fontWeight: 500 }}>
                        Description *
                      </div>
                      <Form.Item
                        {...restField}
                        name={[name, 'description']}
                        rules={[
                          { required: true, message: 'Veuillez fournir une description...' },
                        ]}
                        style={{ marginBottom: 0 }}
                      >
                        <Input.TextArea
                          placeholder="Saisir la description"
                          style={{ width: '100%', resize: 'none' }}
                          rows={1}
                        />
                      </Form.Item>
                    </Col>

                    <Col xs={24} md={2}>
                      <div style={{ marginBottom: 8, fontWeight: 500, visibility: 'hidden' }}>
                        Action
                      </div>
                      <Button
                        type="text"
                        danger
                        icon={<MinusCircleOutlined />}
                        onClick={() => remove(name)}
                        style={{ marginTop: 0 }}
                      >
                      </Button>
                    </Col>
                  </Row>
                </Card>
              ))}
              
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  icon={<PlusCircleOutlined />}
                  style={{ width: '100%' }}
                >
                  Ajouter une réparation
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
        
        <div style={{ marginTop: '20px' }}>
          <Button type="primary" htmlType="submit" loading={loading} icon={<SendOutlined />}>
            Soumettre
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default InspectionGenAll;