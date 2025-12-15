import { useEffect, useState } from 'react'
import { Col, DatePicker, Form, Modal, Card, notification, Input, InputNumber, Row, Select, Skeleton, Button, Divider, message } from 'antd';
import { SendOutlined, PlusCircleOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { getFournisseur } from '../../../../services/fournisseurService';
import { getInspectionValide, getReparationOneV, getStatutVehicule, getTypeReparation, getVehicule, postReparation, putReparation } from '../../../../services/charroiService';
import { useSelector } from 'react-redux';
import { getTypes } from '../../../../services/typeService';
import moment from 'moment';
import ReparationDetail from '../reparationDetail/ReparationDetail';
import { useMenu } from '../../../../context/MenuProvider';

const ReparationForm = ({closeModal, fetchData, subInspectionId, idReparations}) => {
    const [form] = Form.useForm();
    const [loadingData, setLoadingData] = useState(false);
    const [fournisseur, setFournisseur] = useState([]);
    const [vehicule, setVehicule] = useState([]);
    const [reparation, setReparation] = useState([]);
    const userId = useSelector((state) => state.user?.currentUser?.id_utilisateur);
    const [loading, setLoading] = useState(false);
    const [ statut, setStatut ] = useState([]);
    const [modalType, setModalType] = useState(null);
    const [idReparation, setIdReparation] = useState(null)
    const [data, setData] = useState([]);
    const { fetchDataInsp } = useMenu();
    
    const fetchDatas = async () => {
        try {
            const [vehiculeData, fournisseurData, reparationData,typeData, statutData] = await Promise.all([
                getVehicule(),
                getFournisseur(),
                getTypeReparation(),
                getTypes(),
                getStatutVehicule(),
            ])

            setFournisseur(fournisseurData.data)
            setVehicule(vehiculeData.data.data)
            setReparation(reparationData.data.data)
            setStatut(statutData.data)

            if(subInspectionId){
                const { data : d } = await getInspectionValide(subInspectionId)
                form.setFieldsValue({
                    id_vehicule: d[0]?.id_vehicule,
                    cout: d[0]?.manoeuvre,
                    montant : d[0]?.cout,
                    commentaire : d[0]?.avis,
                    id_statut_vehicule: d[0]?.id_statut_vehicule,
                    kilometrage: d[0]?.kilometrage,
                    reparations: d.map((item) => ({
                        id_type_reparation: item.id_type_reparation,
                        montant: item.budget_valide,
                        description: item.description || ''
                    }))
                })
            }

            if(idReparations) {
                const { data : r } = await getReparationOneV(idReparations)
                setData(r)
                form.setFieldsValue({
                    id_vehicule : r[0]?.id_vehicule,
                    date_entree: moment(r[0]?.date_entree),
                    date_prevu: moment(r[0]?.date_prevu),
                    cout: r[0]?.cout,
                    id_fournisseur: r[0]?.id_fournisseur,
                    code_rep: r[0]?.code_rep,
                    id_statut_vehicule: r[0]?.id_statut_vehicule,
                    kilometrage:r[0]?.kilometrage,
                    commentaire: r[0]?.commentaire,
                    reparations: r?.map((item, index) => ({
                        id_type_reparation: item.id_type_reparation,
                        montant: item.montant,
                        description: item.description
                    }))
                })
            }
            
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoadingData(false);
        }
    }

    const closeAllModals = () => {
        setModalType(null);
    };

    useEffect(()=> {
        fetchDatas()
    }, [subInspectionId, idReparations])

    const openModal = (type, idReparation = '') => {
        closeAllModals();
        setModalType(type);
        setIdReparation(idReparation)
      };
        
    const onFinish = async (values) => {
        await form.validateFields();
        const loadingKey = 'loadingReparation';
        message.loading({ content: 'Traitement en cours, veuillez patienter...', key: loadingKey, duration: 0 });
        
        setLoading(true)
        try {
            if(idReparations) {
                const Allvalue = {
                    ...values,
                    user_cr : userId,
                }
                await putReparation({
                    id_sud_reparation: data[0]?.id_sud_reparation,
                    id_reparation: data[0]?.id_reparation,
                    formData: Allvalue,
                  });
                  
            } else {
                const res = await postReparation({
                    ...values,
                    user_cr : userId,
                    id_sub_inspection_gen : subInspectionId
                })

                if(subInspectionId) {
                    const id = res?.data.data.id
                    openModal('Detail', id)
                }
            }

            message.success({ content: 'La réparation a été enregistrée avec succès.', key: loadingKey });
            fetchData();
            form.resetFields();
            closeModal();
            fetchDataInsp();
        } catch (error) {
            console.error("Erreur lors de l'ajout de controle technique:", error);
            message.error({ content: 'Une erreur est survenue.', key: loadingKey });
            notification.error({
                message: 'Erreur',
                description: `${error.response?.data?.error}`,
            });
        } finally {
            setLoading(false);
        }
    }

  return (
    <>
        <div className="controle_form">
            <div className="controle_title_rows">
                <h2 className="controle_h2">{idReparations ? 'MODIFIER UNE REPARATION' : 'ENREGISTRER UNE REPARATION'}</h2>
            </div>
            <div className="controle_wrapper">
                <Form
                    form={form}
                    name="chauffeurForm"
                    layout="vertical"
                    autoComplete="off"
                    className="custom-form"
                    onFinish={onFinish}
                >
                    <Card>
                        <Row gutter={12}>

                            <Col xs={24} md={8}>
                                <Form.Item
                                    name="id_vehicule"
                                    label="Matricule"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Veuillez sélectionner un groupe...',
                                        }
                                    ]}
                                >
                                    {loadingData ? (
                                    <Skeleton.Input active={true} />
                                    ) : (
                                        <Select
                                            allowClear
                                            showSearch
                                            options={vehicule.map((item) => ({
                                                    value: item.id_vehicule                                           ,
                                                    label: `${item.immatriculation} / ${item.nom_marque} / ${item.modele}`,
                                            }))}
                                                placeholder="Sélectionnez un vehicule..."
                                                optionFilterProp="label"
                                         />
                                        )}
                                </Form.Item>
                            </Col>

                            <Col xs={24} md={8}>
                                    <Form.Item
                                        name="id_fournisseur"
                                        label="Fournisseur"
                                        rules={[
                                                {
                                                    required: true,
                                                    message: 'Veuillez selectionner un fournisseur...',
                                                },
                                            ]}
                                    >
                                        {loadingData ? <Skeleton.Input active={true} /> : 
                                        <Select
                                            allowClear
                                                showSearch
                                                options={fournisseur.map((item) => ({
                                                    value: item.id_fournisseur                                           ,
                                                    label: `${item.nom_fournisseur}`,
                                                }))}
                                                placeholder="Sélectionnez un fournisseur..."
                                                optionFilterProp="label"
                                        /> }
                                    </Form.Item>
                            </Col>

                            <Col xs={24} md={8}>
                                        <Form.Item
                                            name="id_statut_vehicule"
                                            label="Statut véhicule"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Veuillez selectionner un statut...',
                                                },
                                                ]}
                                        >
                                            {loadingData ? <Skeleton.Input active={true} /> : 
                                            <Select
                                                allowClear
                                                showSearch
                                                options={statut?.map((item) => ({
                                                value: item.id_statut_vehicule                                           ,
                                                label: `${item.nom_statut_vehicule}`,
                                                    }))}
                                                placeholder="Sélectionnez un statut..."
                                                optionFilterProp="label"
                                            /> }
                                        </Form.Item>
                            </Col>

                            <Col xs={24} md={8}>
                                    <Form.Item
                                        name="date_entree"
                                        label="Date entrée"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Veuillez fournir une date...',
                                            },
                                        ]}
                                        initialValue={moment()}
                                    >
                                            {loadingData ? (
                                                <Skeleton.Input active={true} />
                                            ) : (
                                                <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
                                            )}
                                        </Form.Item>
                            </Col>

                            <Col xs={24} md={8}>
                                    <Form.Item
                                        name="date_prevu"
                                        label="Date prevue"
                                        rules={[
                                            {
                                                required: false,
                                                message: 'Veuillez fournir une date...',
                                            },
                                        ]}
                                >
                                    {loadingData ? (
                                        <Skeleton.Input active={true} />
                                    ) : (
                                        <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
                                    )}
                                    </Form.Item>
                            </Col>

                            <Col xs={24} md={8}>
                                        <Form.Item
                                            name="cout"
                                            label="Cout(devise)"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Veuillez fournir un cout...',
                                                }
                                            ]}
                                        >
                                            {loadingData ? <Skeleton.Input active={true} /> : <InputNumber min={0} placeholder="Saisir le cout..." style={{width:'100%'}}/>}
                                        </Form.Item>
                            </Col>

                            <Col xs={24} md={8}>
                                <Form.Item
                                    name="code_rep"
                                    label="Code de réparation"
                                    rules={[
                                        {
                                            required: false,
                                            message: 'Veuillez fournir une référence...',
                                        }
                                    ]}
                                >
                                    {loadingData ? <Skeleton.Input active={true} /> : <Input placeholder="Saisir le code de réparation..." />}
                                </Form.Item>
                            </Col>

                            <Col xs={24} md={8}>
                                <Form.Item
                                    name="kilometrage"
                                    label="Kilometrage"
                                    rules={[
                                        {
                                            required: false,
                                            message: 'Veuillez fournir une date...',
                                        },
                                    ]}
                                >
                                    {loadingData ? (
                                        <Skeleton.Input active={true} />
                                        ) : (
                                            <InputNumber style={{width:'100%'}} />
                                        )}
                                </Form.Item>
                            </Col>

                            <Col xs={24} md={8}>
                                <Form.Item
                                    name="commentaire"
                                    label="Commentaire"
                                    rules={[
                                        {
                                            required: false,
                                            message: 'Veuillez fournir un commentaire...',
                                        }
                                    ]}
                                >
                                    {loadingData ? <Skeleton.Input active={true} /> : <Input.TextArea placeholder="Saisir le commentaire..." style={{width:'100%', resize:'none', height:'80px'}}/>}
                                </Form.Item>
                            </Col>

                        </Row>
                    </Card>

                        {/* Réparations dynamiques */}
                        <Form.List name="reparations">
                                {(fields, { add, remove }) => (
                                    <>
                                    <Divider className='title_row'>Réparations</Divider>
                                    {fields.map(({ key, name, ...restField }) => (
                                        <Card>
                                            <Row key={key} gutter={12} align="middle">

                                                <Col xs={24} md={7}>
                                                    <Form.Item
                                                    {...restField}
                                                    name={[name, 'id_type_reparation']}
                                                    label="Type de réparation"
                                                    rules={[
                                                        { required: true, message: 'Veuillez fournir une réparation...' },
                                                    ]}
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

                                                <Col xs={24} md={7}>
                                                    <Form.Item
                                                    {...restField}
                                                    name={[name, 'montant']}
                                                    label="Montant"
                                                    rules={[
                                                        { required: false, message: 'Veuillez fournir le montant...' },
                                                    ]}
                                                    >
                                                        <InputNumber min={0} placeholder="Saisir le montant..." style={{width:'100%'}}/>
                                                    </Form.Item>
                                                </Col>
                                                
                                                <Col xs={24} md={8}>
                                                    <Form.Item
                                                    {...restField}
                                                    name={[name, 'description']}
                                                    label="Description"
                                                    rules={[
                                                        { required: true, message: 'Veuillez fournir une description...' },
                                                    ]}
                                                    >
                                                        <Input.TextArea
                                                            placeholder="Saisir la description"
                                                            style={{ width: '100%', resize: 'none' }}
                                                        />
                                                    </Form.Item>
                                                </Col>

                                                <Col xs={24} md={2}>
                                                    <Button
                                                    type="text"
                                                    danger
                                                    icon={<MinusCircleOutlined />}
                                                    onClick={() => remove(name)}
                                                    >
                                                    </Button>
                                                </Col>
                                            </Row>
                                        </Card>
                                    ))}
                                    { subInspectionId == null &&
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
                                    }
                                </>
                                )}
                        </Form.List>
                        <div style={{ marginTop: '20px' }}>
                            <Button type="primary" htmlType="submit" loading={loading} icon={<SendOutlined />}>
                                { idReparations ? 'Modifier' : 'Soumettre'}
                            </Button>
                        </div>
                </Form>
            </div>
        </div>
        <Modal
            title=""
            visible={modalType === 'Detail'}
            onCancel={closeAllModals}
            footer={null}
            width={900}
            centered
        >
            <ReparationDetail closeModal={() => setModalType(null)} fetchData={fetchData} idReparation={idReparation} />
        </Modal>
    </>
  )
}

export default ReparationForm