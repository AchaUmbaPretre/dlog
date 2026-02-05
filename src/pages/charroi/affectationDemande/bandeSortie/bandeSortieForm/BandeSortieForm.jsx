import { useState } from 'react'
import { Form, Row, Modal, Input, Checkbox, Card, Col, DatePicker, message, Skeleton, Select, Button } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import { postBandeSortie } from '../../../../../services/charroiService';

import ReleveBonDeSortie from '../releveBonDeSortie/ReleveBonDeSortie';
import { useBandeSortieForm } from './hooks/useBandeSortieForm';
import { useConfirmAction } from '../../../generateur/composant/pleinGenerateur/formPleinGenerateur/hooks/useConfirmAction';
import ConfirmModal from '../../../../../components/confirmModal/ConfirmModal';

const BandeSortieForm = ({closeModal, fetchData, affectationId}) => {
    const [ loading, setLoading ] = useState(false);
    const [ modalType, setModalType ] = useState(null);
    const [createBS, setCreateBS] = useState(true);
    const [ bonId, setBonId ] = useState('');
    const {     
        form,    
        loadingData,
        vehicule,
        chauffeur,
        userId,
        type,
        motif,
        service,
        client,
        destination,
        societe,
        reload,
        submitting,
        handleFinish,
        doSubmit
    } = useBandeSortieForm(affectationId)
    const { visible, message, pending, requestConfirm, confirm, cancel } = useConfirmAction();
    

    const closeAllModals = () => {
        setModalType(null);
    };

    const onFinish = async (values) => {
        const result = await handleFinish(values);
        requestConfirm(result, 'Voulez-vous enregistrer cet enregistrement ?');
    }

    const onConfirm = async () => {
        const toSubmit = pending ?? null;
        if (!toSubmit) return cancel();

        const { payload } = toSubmit;
        const res = await doSubmit({ payload, affectationId });

        if(res.ok) {
            fetchData();
            form.resetFields();
            closeModal();
            cancel();
        }
        if (createBS) {
            setBonId(res.id);
            setModalType("releve");
        }
    }


  return (
    <>
        <div className="controle_form">
            <div className="controle_title_rows">
                <div className="controle_h2">Form de bon de sortie</div>
            </div>
            <div className="controle_wrapper">
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    initialValues={{ id_societe: 1 }}
                >
                    <Card>
                        <Row gutter={12}>

                            <Col xs={24} md={6}>
                                <Form.Item
                                    label="Véhicule"
                                    name="id_vehicule"
                                    rules={[{ required: true, message: 'Veuillez sélectionner un véhicule' }]}
                                >
                                { loadingData ? <Skeleton.Input active={true} /> : 
                                    <Select
                                        allowClear
                                        showSearch
                                        options={vehicule?.map((item) => ({
                                            value: item.id_vehicule,
                                            label: [
                                            item.immatriculation || '', 
                                            item.nom_marque || '', 
                                            item.modele || ''
                                            ]
                                            .filter(val => val)
                                            .join(' / ')
                                        }))}
                                        optionFilterProp="label"
                                        placeholder="Sélectionnez un véhicule..."
                                    />
                                }
                                </Form.Item>
                            </Col>

                            <Col xs={24} md={6}>
                                <Form.Item
                                    label="Chauffeur"
                                    name="id_chauffeur"
                                    rules={[{ required: true, message: 'Veuillez sélectionner un chauffeur' }]}
                                >
                                { loadingData ? <Skeleton.Input active={true} /> : 
                                <Select
                                    allowClear
                                    showSearch
                                    options={chauffeur?.map((item) => ({
                                        value: item.id_chauffeur,
                                        label: item.nom
                                    }))}
                                    optionFilterProp="label"
                                    placeholder="Sélectionnez un chauffeur..."
                                />}
                                </Form.Item>
                            </Col>

                            <Col xs={24} md={6}>
                                <Form.Item
                                    label="Départ prévue"
                                    name="date_prevue"
                                    rules={[{ required: false, message: "Veuillez fournir la date et l'heure"}]}
                                >
                                    <DatePicker 
                                        style={{width:'100%'}}
                                        showTime={{ format: 'HH:mm' }} 
                                        format="YYYY-MM-DD HH:mm" 
                                        placeholder="Choisir date et heure" 
                                    />
                                </Form.Item>
                            </Col>
                            
                            <Col xs={24} md={6}>
                                <Form.Item
                                    label="Retour prévue"
                                    name="date_retour"
                                    rules={[{ required: false, message: "Veuillez fournir la date et l'heure"}]}
                                >
                                    <DatePicker 
                                        style={{width:'100%'}}
                                        showTime={{ format: 'HH:mm' }} 
                                        format="YYYY-MM-DD HH:mm" 
                                        placeholder="Choisir date et heure" 
                                    />
                                </Form.Item>
                            </Col>
                            
                            <Col xs={24} md={8}>
                                <Form.Item
                                    label="Motif"
                                    name="id_motif_demande"
                                    rules={[{ required: true, message: 'Veuillez sélectionner un motif' }]}
                                >
                                    { loadingData ? <Skeleton.Input active={true} /> : 
                                    <Select
                                        allowClear
                                        showSearch
                                        options={motif?.map((item) => ({
                                            value: item.id_motif_demande,
                                            label: `${item.nom_motif_demande}`,
                                        }))}
                                        optionFilterProp="label"
                                        placeholder="Sélectionnez..."
                                    />
                                    }
                                </Form.Item>
                            </Col>
                            
                            <Col xs={24} md={8}>
                                <Form.Item
                                    label="Service demandeur"
                                    name="id_demandeur"
                                    rules={[{ required: true, message: 'Veuillez sélectionner un motif' }]}
                                >
                                    { loadingData ? <Skeleton.Input active={true} /> : 
                                    <Select
                                        allowClear
                                        showSearch
                                        options={service?.map((item) => ({
                                            value: item.id_service_demandeur,
                                            label: `${item.nom_service}`,
                                        }))}
                                        optionFilterProp="label"
                                        placeholder="Sélectionnez..."
                                    />
                                    }
                                </Form.Item>
                            </Col>
                            
                            <Col xs={24} md={8}>
                                <Form.Item
                                    label="Client"
                                    name="id_client"
                                >
                                    { loadingData ? <Skeleton.Input active={true} /> : 
                                    <Select
                                        allowClear
                                        showSearch
                                        options={client?.map((item) => ({
                                            value: item.id_client,
                                            label: `${item.nom}`,
                                        }))}
                                        optionFilterProp="label"
                                        placeholder="Sélectionnez..."
                                    />
                                    }
                                </Form.Item>
                            </Col>
                            
                            <Col xs={24} md={8}>
                                <Form.Item
                                    label="Destination"
                                    name="id_destination"
                                >
                                    { loadingData ? <Skeleton.Input active={true} /> : 
                                    <Select
                                        allowClear
                                        showSearch
                                        options={destination?.map((item) => ({
                                            value: item.id_destination,
                                            label: `${item.nom_destination}`,
                                        }))}
                                        optionFilterProp="label"
                                        placeholder="Sélectionnez..."
                                    />
                                    }
                                </Form.Item>
                            </Col>
                            
                            <Col xs={24} md={8}>
                                <Form.Item
                                    label="Personne(s) à bord"
                                    name="personne_bord"
                                >
                                    { loadingData ? <Skeleton.Input active={true} /> : 
                                    <Input  placeholder="Saisir..." style={{width:'100%'}}/>
                                    }
                                </Form.Item>
                            </Col>

                            <Col xs={24} md={8}>
                                <Form.Item
                                    label="Société"
                                    name="id_societe"
                                    value={1}
                                    rules={[{ required: true, message: 'Veuillez sélectionner une société' }]}
                                >
                                    { loadingData ? <Skeleton.Input active={true} /> : 
                                    <Select
                                        allowClear
                                        showSearch
                                        options={societe?.map((item) => ({
                                            value: item.id_societe,
                                            label: `${item.nom_societe}`,
                                        }))}
                                        optionFilterProp="label"
                                        placeholder="Sélectionnez..."
                                    />
                                    }
                                </Form.Item>
                            </Col>

                            <Col xs={24} md={24}>
                                <Form.Item
                                    label="Commentaire"
                                    name="commentaire"
                                >
                                    <Input.TextArea placeholder="Saisir le commentaire..." style={{width:'100%', resize:'none', height:'70px'}}/>
                                </Form.Item>
                            </Col>

                            <Col xs={24} md={24}>
                                <Checkbox
                                    checked={createBS}
                                    onChange={e => setCreateBS(e.target.checked)}
                                >
                                    Afficher le BS aprés la validation
                                </Checkbox>
                            </Col>

                            <div style={{ marginTop: '20px' }}>
                                <Button type="primary" htmlType="submit" icon={<SendOutlined />} loading={loading} disabled={loading} >
                                    Soumettre
                                </Button>
                            </div>
                        </Row>
                    </Card>
                </Form>
            </div>
        </div>
            <ConfirmModal
                visible={visible}
                title={"Confirmer l'enregistrement"}
                content={message}
                onConfirm={onConfirm}
                onCancel={cancel}
                loading={submitting}
            />
        <Modal
            title=""
            visible={modalType === 'releve'}
            onCancel={closeAllModals}
            footer={null}
            width={800}
            centered
        >
            <ReleveBonDeSortie closeModal={() => setModalType(null)} fetchData={fetchData} id_bon={bonId} />
        </Modal>
    </>
  )
}

export default BandeSortieForm