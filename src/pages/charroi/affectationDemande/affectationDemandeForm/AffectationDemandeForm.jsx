import { useState, useEffect } from 'react'
import { Form, Row, Checkbox, Modal, Tooltip, Input, Card, Col, DatePicker, Skeleton, Select, Button } from 'antd';
import { SendOutlined, PlusOutlined } from '@ant-design/icons';
import DestinationForm from '../../demandeVehicule/destination/destinationForm/DestinationForm';
import ClientForm from '../../../client/clientForm/ClientForm';
import BandeSortieForm from '../bandeSortie/bandeSortieForm/BandeSortieForm';
import { useAffectationForm } from './hooks/useAffectationForm';
import { useConfirmAction } from '../../generateur/composant/pleinGenerateur/formPleinGenerateur/hooks/useConfirmAction';
import ConfirmModal from '../../../../components/confirmModal/ConfirmModal';

const AffectationDemandeForm = ({closeModal, fetchData, id_demande_vehicule}) => {
    const [form] = Form.useForm();
    const [ affectationId, setAffectationId ] = useState('')
    const [ modalType, setModalType ] = useState(null);
    const [createBS, setCreateBS] = useState(true);
    const [selectedTypeMission, setSelectedTypeMission] = useState(null);

    const {         
        destination,
        loadingData,
        vehicule,
        chauffeur,
        motif,
        service,
        client,
        reload,
        submitting,
        handleFinish,
        doSubmit,
        types
     } = useAffectationForm(id_demande_vehicule);
    const { visible, message, pending, requestConfirm, confirm, cancel } = useConfirmAction();

    // Suivi du type de mission sélectionné
    useEffect(() => {
        const typeId = form.getFieldValue('id_type_mission');
        const selectedType = types?.find(t => t.id_type === typeId);
        setSelectedTypeMission(selectedType);
    }, [form.getFieldValue('id_type_mission'), types]);

    const closeAllModals = () => {
        setModalType(null);
    };
      
    const openModal = (type) => {
        closeAllModals();
        setModalType(type);
    };

    const handleDestination = () => openModal('Destination');
    const handleClient = () => openModal('Client')

    const onFinish = async (values) => {
        const result = await handleFinish(values);
        requestConfirm(result, 'Souhaitez-vous valider l’affectation du véhicule à cette demande ?');
    }

    const onConfirm = async () => {
        const toSubmit = pending ?? null;
        if (!toSubmit) return cancel();

        const { payload } = toSubmit;

        try {
            const res = await doSubmit({ payload });

            if (!res.ok) return;

            const newAffectationId = res.id;
            setAffectationId(newAffectationId);

            form.resetFields();
            fetchData();
            closeModal()

            cancel();

            if (createBS) {
                setModalType('Bande');
            } else {
                closeModal();
            }

        } catch (error) {
            console.error("Erreur lors de l'enregistrement de l'affectation :", error);
        }
    };

    // ✅ Vérifier si le champ doit être affiché selon le type de mission
    const shouldShowField = (fieldCode) => {
        if (!selectedTypeMission) return true; // Par défaut, afficher tout
        
        const typeCode = selectedTypeMission.code;
        
        // Champs communs à tous les types
        const commonFields = ['id_type_mission', 'id_vehicule', 'id_chauffeur', 'date_prevue', 'commentaire'];
        
        if (commonFields.includes(fieldCode)) return true;
        
        // Champs spécifiques selon le type
        switch (typeCode) {
            case 'bon_sortie':
                // Bon de sortie classique : tous les champs
                return true;
                
            case 'vtc_course':
                // Course VTC : pas besoin de retour prévu, ni personne à bord
                return !['date_retour', 'personne_bord', 'id_motif_demande', 'id_demandeur'].includes(fieldCode);
                
            case 'location_heure':
                // Location à l'heure : retour obligatoire, pas de motif/demandeur
                return !['id_motif_demande', 'id_demandeur', 'personne_bord'].includes(fieldCode);
                
            case 'location_journee':
                // Location à la journée : retour obligatoire, pas de motif/demandeur
                return !['id_motif_demande', 'id_demandeur', 'personne_bord'].includes(fieldCode);
                
            case 'transfert':
                // Transfert interne : pas de client, pas de destination externe
                return !['id_client', 'id_motif_demande', 'id_demandeur', 'personne_bord'].includes(fieldCode);
                
            default:
                return true;
        }
    };

    // ✅ Labels dynamiques
    const getDynamicLabel = (fieldCode) => {
        if (!selectedTypeMission) return null;
        
        const typeCode = selectedTypeMission.code;
        
        switch (fieldCode) {
            case 'date_prevue':
                if (typeCode === 'location_heure') return 'Date & heure de début de location';
                if (typeCode === 'location_journee') return 'Date de début de location';
                if (typeCode === 'vtc_course') return 'Date & heure de prise en charge';
                return 'Date & heure de départ prévue';
                
            case 'date_retour':
                if (typeCode === 'location_heure') return 'Date & heure de fin de location';
                if (typeCode === 'location_journee') return 'Date de fin de location';
                return 'Date & heure de retour prévue';
                
            case 'destination':
                if (typeCode === 'vtc_course') return 'Destination de la course';
                if (typeCode === 'transfert') return 'Lieu de transfert';
                return 'Destination';
                
            default:
                return null;
        }
    };

    return (
        <>
            <div className="controle_form">
                <div className="controle_title_rows">
                    <div className="controle_h2">Formulaire de validation de course</div>
                </div>
                <div className="controle_wrapper">
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={onFinish}
                    >
                        <Card>
                            <Row gutter={12}>
                                {/* Type de mission - Toujours visible */}
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
                                            options={types?.map((item) => ({
                                                value: item.id_type,
                                                label: item.nom                            
                                            }))}
                                            optionFilterProp="label"
                                            placeholder="Sélectionnez un type..."
                                            onChange={() => {
                                                // Réinitialiser certains champs quand le type change
                                                form.setFieldsValue({
                                                    date_retour: undefined,
                                                    id_client: undefined,
                                                    id_motif_demande: undefined,
                                                    id_demandeur: undefined
                                                });
                                            }}
                                        />
                                        }
                                    </Form.Item>
                                </Col>

                                {/* Véhicule - Toujours visible */}
                                <Col xs={24} md={8}>
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
                                            label: item.modele
                                            ? `${item.immatriculation} / ${item.nom_marque} / ${item.modele}`
                                            : `${item.immatriculation} / ${item.nom_marque}`,
                                        }))}
                                        optionFilterProp="label"
                                        placeholder="Sélectionnez un vehicule..."
                                    />
                                    }
                                    </Form.Item>
                                </Col>

                                {/* Chauffeur - Toujours visible */}
                                <Col xs={24} md={8}>
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
                                            label: `${item.nom} - ${item.prenom}`
                                        }))}
                                        optionFilterProp="label"
                                        placeholder="Sélectionnez un chauffeur..."
                                    />}
                                    </Form.Item>
                                </Col>

                                {/* Date départ - Visible selon type */}
                                {shouldShowField('date_prevue') && (
                                    <Col xs={24} md={8}>
                                        <Form.Item
                                            label={getDynamicLabel('date_prevue') || "Date & heure de départ prévue"}
                                            name="date_prevue"
                                            rules={[{ required: true, message: "Veuillez fournir la date et l'heure" }]}
                                        >
                                            <DatePicker
                                                style={{ width: '100%' }}
                                                showTime={{ format: 'HH:mm' }}
                                                format="YYYY-MM-DD HH:mm"
                                                placeholder="Choisir date et heure"
                                            />
                                        </Form.Item>
                                    </Col>
                                )}

                                {/* Date retour - Pas pour VTC */}
                                {shouldShowField('date_retour') && (
                                    <Col xs={24} md={8}>
                                        <Form.Item
                                            label={getDynamicLabel('date_retour') || "Date & heure de retour prévue"}
                                            name="date_retour"
                                            dependencies={['date_prevue']}
                                            rules={[
                                                { required: selectedTypeMission?.code !== 'vtc_course', message: "Veuillez fournir la date et l'heure de retour" },
                                                ({ getFieldValue }) => ({
                                                    validator(_, value) {
                                                        const depart = getFieldValue('date_prevue');
                                                        if (!value || !depart) return Promise.resolve();
                                                        if (value.isAfter(depart)) {
                                                            return Promise.resolve();
                                                        }
                                                        return Promise.reject(
                                                            new Error("La date de retour doit être strictement postérieure à la date de départ.")
                                                        );
                                                    },
                                                }),
                                            ]}
                                        >
                                            <DatePicker
                                                style={{ width: '100%' }}
                                                showTime={{ format: 'HH:mm' }}
                                                format="YYYY-MM-DD HH:mm"
                                                placeholder="Choisir date et heure"
                                            />
                                        </Form.Item>
                                    </Col>
                                )}

                                {/* Motif - Seulement pour bon_sortie */}
                                {shouldShowField('id_motif_demande') && (
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
                                )}

                                {/* Service demandeur - Seulement pour bon_sortie */}
                                {shouldShowField('id_demandeur') && (
                                    <Col xs={24} md={8}>
                                        <Form.Item
                                            label="Service demandeur"
                                            name="id_demandeur"
                                            rules={[{ required: true, message: 'Veuillez sélectionner un demandeur' }]}
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

                                {/* Client - Pas pour transfert interne */}
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
                                                    // Recherche par nom ET par téléphone
                                                    const searchTerm = input.toLowerCase();
                                                    const clientNom = option?.nom?.toLowerCase() || '';
                                                    const clientTel = option?.telephone?.toLowerCase() || '';
                                                    return clientNom.includes(searchTerm) || clientTel.includes(searchTerm);
                                                }}
                                                placeholder="Rechercher par nom ou téléphone..."
                                                notFoundContent="Aucun client trouvé"
                                            >
                                                {client?.map((item) => {
                                                    // Déterminer l'affichage du label
                                                    let label = '';
                                                    let searchNom = item.nom || '';
                                                    
                                                    if (item.nom && item.nom !== 'Client anonyme' && item.nom !== 'Client occasionnel') {
                                                        // Client normal avec nom
                                                        label = `${item.nom} ${item.telephone ? `(${item.telephone})` : ''}`;
                                                    } else if (item.telephone) {
                                                        // Client anonyme - afficher seulement le téléphone
                                                        label = `📞 ${item.telephone} (Client sans compte)`;
                                                    } else {
                                                        // Client sans aucune info
                                                        label = `🆔 Client #${item.id_client}`;
                                                    }
                                                    
                                                    return (
                                                        <Select.Option 
                                                            key={item.id_client} 
                                                            value={item.id_client}
                                                            nom={item.nom || ''}
                                                            telephone={item.telephone || ''}
                                                        >
                                                            {label}
                                                        </Select.Option>
                                                    );
                                                })}
                                            </Select>
                                            }
                                        </Form.Item>
                                        <Tooltip title={'Ajouter un client'}>
                                            <Button 
                                                style={{ width:'19px', height:'19px' }}
                                                icon={<PlusOutlined style={{fontSize:'9px', margin:'0 auto'}} />}
                                                onClick={handleClient}
                                            >
                                            </Button>
                                        </Tooltip>
                                    </Col>
                                )}

                                {/* Destination - Toujours visible sauf transfert ? */}
                                {shouldShowField('destination') && (
                                    <Col xs={24} md={8}>
                                        <Form.Item
                                            label={getDynamicLabel('destination') || "Destination"}
                                            name="id_destination"
                                            rules={[{ required: false, message: 'Veuillez sélectionner une destination.' }]}
                                        >
                                            { loadingData ? <Skeleton.Input active={true} /> : 
                                            <Select
                                                allowClear
                                                showSearch
                                                options={destination?.map((item) => ({
                                                    value: item.id_destination ,
                                                    label: `${item.nom_destination}`,
                                                }))}
                                                optionFilterProp="label"
                                                placeholder="Sélectionnez..."
                                            />
                                            }
                                        </Form.Item>
                                        <Tooltip title={'Ajouter une destination'}>
                                            <Button 
                                                style={{ width:'19px', height:'19px' }}
                                                icon={<PlusOutlined style={{fontSize:'9px', margin:'0 auto'}} />}
                                                onClick={handleDestination}
                                            >
                                            </Button>
                                        </Tooltip>
                                    </Col>
                                )}

                                {/* Personne(s) à bord - Seulement pour bon_sortie */}
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

                                {/* Commentaire - Toujours visible */}
                                <Col xs={24} md={24}>
                                    <Form.Item
                                        label="Commentaire"
                                        name="commentaire"
                                    >
                                        <Input.TextArea placeholder="Saisir le commentaire..." style={{width:'100%', resize:'none', height:'70px'}}/>
                                    </Form.Item>
                                </Col>

                                {/* Créer BS - Seulement si type = bon_sortie */}
                                {selectedTypeMission?.code === 'bon_sortie' && (
                                    <Col xs={24} md={24}>
                                        <Checkbox
                                            checked={createBS}
                                            onChange={e => setCreateBS(e.target.checked)}
                                        >
                                            Créer un bon de sortie
                                        </Checkbox>
                                    </Col>
                                )}

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
                visible={modalType === 'Bande'}
                onCancel={closeAllModals}
                footer={null}
                width={1000}
                centered
            >
                <BandeSortieForm closeModal={() => setModalType(null)} fetchData={reload || (() => {})} affectationId={affectationId} />
            </Modal>

            <Modal
                title=""
                visible={modalType === 'Destination'}
                onCancel={closeAllModals}
                footer={null}
                width={700}
                centered
            >
                <DestinationForm closeModal={() => setModalType(null)} fetchData={reload} />
            </Modal>

            <Modal
                title=""
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

export default AffectationDemandeForm;