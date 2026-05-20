import { useState } from 'react'
import { Form, Row, Modal, Input, Checkbox, Card, Col, DatePicker, message, Skeleton, Select, Button } from 'antd';
import { SendOutlined, PlusOutlined, InfoCircleOutlined } from '@ant-design/icons';

import ReleveBonDeSortie from '../releveBonDeSortie/ReleveBonDeSortie';
import { useBandeSortieForm } from './hooks/useBandeSortieForm';
import { useConfirmAction } from '../../../generateur/composant/pleinGenerateur/formPleinGenerateur/hooks/useConfirmAction';
import ConfirmModal from '../../../../../components/confirmModal/ConfirmModal';
import ClientForm from '../../../../client/clientForm/ClientForm';

const BandeSortieForm = ({closeModal, fetchData, affectationId}) => {
    const [ modalType, setModalType ] = useState(null);
    const [createBS, setCreateBS] = useState(true);
    const [ bonId, setBonId ] = useState('');
    const [selectedTypeMission, setSelectedTypeMission] = useState(null);
    const {     
        form,    
        loadingData,
        vehicule,
        chauffeur,
        motif,
        service,
        client,
        destination,
        societe,
        reload,
        submitting,
        handleFinish,
        doSubmit,
        typesMission
    } = useBandeSortieForm(affectationId)
    const { visible, message, pending, requestConfirm, confirm, cancel } = useConfirmAction();
    

    const closeAllModals = () => {
        setModalType(null);
    };

    const openModal = (type) => {
        closeAllModals();
        setModalType(type);
    };

    const handleClient = () => openModal('Client');

    // ✅ Fonction pour déterminer les champs à afficher selon le type de mission
    const shouldShowField = (fieldCode) => {
        if (!selectedTypeMission) return true;
        
        const typeCode = selectedTypeMission.code;
        
        // Champs communs à tous les types
        const commonFields = ['id_type_mission', 'id_vehicule', 'id_chauffeur', 'date_prevue', 'commentaire', 'id_societe'];
        
        if (commonFields.includes(fieldCode)) return true;
        
        switch (typeCode) {
            case 'bon_sortie':
                return true;
                
            case 'vtc_course':
                return !['date_retour', 'personne_bord', 'id_motif_demande', 'id_demandeur'].includes(fieldCode);
                
            case 'location_heure':
            case 'location_journee':
                return !['id_motif_demande', 'id_demandeur', 'personne_bord'].includes(fieldCode);
                
            case 'transfert':
                return !['id_client', 'id_motif_demande', 'id_demandeur', 'personne_bord', 'id_destination'].includes(fieldCode);
                
            default:
                return true;
        }
    };

    const onFinish = async (values) => {
        const result = await handleFinish(values);
        requestConfirm(result, 'Souhaitez-vous confirmer la création du bon de sortie ?');
    }

    const onConfirm = async () => {
        if (!pending || submitting) return;

        const { payload } = pending;

        const res = await doSubmit({ payload });

        cancel();

        if (res.ok) {
            fetchData();
            form.resetFields();
            closeModal();
        }

        if (createBS) {
            setBonId(res.id);
            setModalType("releve");
        }
    };

    // Suivi du type de mission sélectionné
    const handleTypeChange = (value) => {
        const selectedType = typesMission?.find(t => t.id_type === value);
        setSelectedTypeMission(selectedType);
        // Réinitialiser certains champs quand le type change
        form.setFieldsValue({
            date_retour: undefined,
            id_client: undefined,
            id_motif_demande: undefined,
            id_demandeur: undefined
        });
    };

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
                                {/* Type de mission */}
                                <Col xs={24} md={8}>
                                    <Form.Item
                                        label="Type de mission"
                                        name="id_type_mission"
                                        rules={[{ required: true, message: 'Veuillez sélectionner un type' }]}
                                    >
                                        { loadingData ? <Skeleton.Input active={true} /> : 
                                        <Select
                                            allowClear
                                            showSearch
                                            options={typesMission?.map((item) => ({
                                                value: item.id_type,
                                                label: item.nom,
                                                code: item.code                            
                                            }))}
                                            optionFilterProp="label"
                                            placeholder="Sélectionnez un type..."
                                            onChange={handleTypeChange}
                                        />
                                        }
                                    </Form.Item>
                                </Col>

                                {/* Véhicule */}
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

                                {/* Chauffeur */}
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

                                {/* Départ prévue */}
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
                                
                                {/* Retour prévue - conditionnel */}
                                {shouldShowField('date_retour') && (
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
                                )}
                                
                                {/* Motif - conditionnel */}
                                {shouldShowField('id_motif_demande') && (
                                    <Col xs={24} md={8}>
                                        <Form.Item
                                            label="Motif"
                                            name="id_motif_demande"
                                            rules={[{ required: false, message: 'Veuillez sélectionner un motif' }]}
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
                                )}
                                
                                {/* Service demandeur - conditionnel */}
                                {shouldShowField('id_demandeur') && (
                                    <Col xs={24} md={8}>
                                        <Form.Item
                                            label="Service demandeur"
                                            name="id_demandeur"
                                            rules={[{ required: false, message: 'Veuillez sélectionner un motif' }]}
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
                                )}
                                
                                {/* Client - avec recherche par téléphone */}
                                {shouldShowField('id_client') && (
                                    <Col xs={24} md={8}>
                                        <Form.Item
                                            label="Client"
                                            name="id_client"
                                        >
                                            { loadingData ? <Skeleton.Input active={true} /> : 
                                            <Select
                                                allowClear
                                                showSearch
                                                optionFilterProp="children"
                                                filterOption={(input, option) => {
                                                    const searchTerm = input.toLowerCase();
                                                    const clientNom = option?.props?.dataNom?.toLowerCase() || '';
                                                    const clientTel = option?.props?.dataTel?.toLowerCase() || '';
                                                    const clientId = option?.props?.dataId?.toString() || '';
                                                    return clientNom.includes(searchTerm) || clientTel.includes(searchTerm) || clientId.includes(searchTerm);
                                                }}
                                                placeholder="🔍 Rechercher par nom, téléphone ou ID"
                                                notFoundContent="Aucun client trouvé"
                                            >
                                                {client?.map((item) => {
                                                    let label = '';
                                                    
                                                    if (item.telephone && (!item.nom || item.nom === 'Client anonyme' || item.nom === 'Client occasionnel')) {
                                                        label = `📞 ${item.telephone} (Client sans compte)`;
                                                    } else if (item.nom && item.nom !== 'Client anonyme' && item.nom !== 'Client occasionnel') {
                                                        label = `${item.nom} ${item.telephone ? `(${item.telephone})` : ''}`;
                                                    } else if (item.telephone) {
                                                        label = `📞 ${item.telephone}`;
                                                    } else {
                                                        label = `🆔 Client #${item.id_client}`;
                                                    }
                                                    
                                                    return (
                                                        <Select.Option 
                                                            key={item.id_client} 
                                                            value={item.id_client}
                                                            data-nom={item.nom || ''}
                                                            data-tel={item.telephone || ''}
                                                            data-id={item.id_client}
                                                        >
                                                            {label}
                                                        </Select.Option>
                                                    );
                                                })}
                                            </Select>
                                            }
                                        </Form.Item>
                                        <div style={{ marginTop: 4 }}>
                                            <Button 
                                                type="link" 
                                                icon={<PlusOutlined />} 
                                                onClick={handleClient}
                                                size="small"
                                                style={{ padding: 0, height: 'auto' }}
                                            >
                                                Ajouter un client
                                            </Button>
                                        </div>
                                    </Col>
                                )}
                                
                                {/* Destination - conditionnel */}
                                {shouldShowField('id_destination') && (
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
                                )}
                                
                                {/* Personne(s) à bord - conditionnel */}
                                {shouldShowField('personne_bord') && (
                                    <Col xs={24} md={8}>
                                        <Form.Item
                                            label="Personne(s) à bord"
                                            name="personne_bord"
                                        >
                                            { loadingData ? <Skeleton.Input active={true} /> : 
                                            <Input placeholder="Saisir..." style={{width:'100%'}}/>
                                            }
                                        </Form.Item>
                                    </Col>
                                )}

                                {/* Société */}
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

                                {/* Commentaire */}
                                <Col xs={24} md={24}>
                                    <Form.Item
                                        label="Commentaire"
                                        name="commentaire"
                                    >
                                        <Input.TextArea placeholder="Saisir le commentaire..." style={{width:'100%', resize:'none', height:'70px'}}/>
                                    </Form.Item>
                                </Col>

                                {/* Afficher le BS après validation */}
                                <Col xs={24} md={24}>
                                    <Checkbox
                                        checked={createBS}
                                        onChange={e => setCreateBS(e.target.checked)}
                                    >
                                        Afficher le BS après la validation
                                    </Checkbox>
                                </Col>

                                <div style={{ marginTop: '20px' }}>
                                    <Button type="primary" htmlType="submit" icon={<SendOutlined />} loading={submitting} disabled={submitting} >
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

            <Modal
                title="Ajouter un client"
                visible={modalType === 'Client'}
                onCancel={closeAllModals}
                footer={null}
                width={700}
                centered
            >
                <ClientForm closeModal={() => setModalType(null)} fetchData={reload} />
            </Modal>
        </>
    )
}

export default BandeSortieForm;