import { Button, Modal, notification, Typography } from 'antd';
import { ExclamationCircleTwoTone, ExclamationCircleOutlined, CheckOutlined,  InfoCircleOutlined, CheckCircleTwoTone, FormOutlined, ToolOutlined, EyeOutlined } from '@ant-design/icons'
import { putDemandeVehiculeAnnuler, putDemandeVehiculeRetour } from '../services/charroiService';

export const handleRepair = (openModal, record) => {
    const alreadyValidated = !!record.date_validation;
  
    if (!alreadyValidated) {
      Modal.warning({
        title: (
          <span style={{ fontWeight: 600, fontSize: 18 }}>
            <ExclamationCircleTwoTone twoToneColor="#ffcc00" /> Inspection non validée
          </span>
        ),
        content: (
          <div style={{ fontSize: 15, lineHeight: 1.5 }}>
            Cette inspection n'a pas encore été validée.
            <br />
            Veuillez d'abord valider l'inspection avant de procéder à la réparation.
          </div>
        ),
        centered: true,
        okText: 'Valider l’inspection',
        onOk: () => {
          openModal('AddValider', record.id_inspection_gen);
          notification.info({
            message: 'Validation requise',
            description: 'Vous devez valider cette inspection avant de pouvoir la réparer.',
            icon: <CheckCircleTwoTone style={{ color: '#52c41a' }} />,
            placement: 'bottomRight',
          });
        },
      });
      return;
    }
  
    const alreadyRepaired = !!record.date_reparation;
  
    if (alreadyRepaired) {
      const modal = Modal.confirm({
        title: (
          <span style={{ fontWeight: 600, fontSize: 18 }}>
            <CheckCircleTwoTone twoToneColor="#52c41a" /> Réparation déjà effectuée
          </span>
        ),
        content: (
          <div style={{ fontSize: 15, lineHeight: 1.5 }}>
            Une réparation est <strong>déjà enregistrée</strong> pour cette inspection.
            <br />
            Vous pouvez <strong>la consulter</strong>, <strong>en créer une nouvelle</strong> ou <strong>fermer</strong> cette boîte.
          </div>
        ),
        icon: null,
        centered: true,
        footer: (
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginTop: '15px' }}>
            <Button
              icon={<FormOutlined />}
              style={{ backgroundColor: '#1677ff', color: 'white', borderRadius: 4 }}
              onClick={() => {
                modal.destroy();
                openModal('Detail', record.id_inspection_gen);
                notification.info({
                  message: 'Mode consultation',
                  description: 'Vous visualisez une réparation déjà enregistrée.',
                  icon: <InfoCircleOutlined style={{ color: '#1677ff' }} />,
                  placement: 'bottomRight',
                });
              }}
            >
              Voir la réparation
            </Button>
  
            <Button
              icon={<ToolOutlined />}
              style={{ backgroundColor: '#52c41a', color: 'white', borderRadius: 4 }}
              onClick={() => {
                modal.destroy();
                openModal('Reparer', record.id_sub_inspection_gen);
                notification.success({
                  message: 'Nouvelle réparation',
                  description: 'Vous pouvez saisir une nouvelle réparation pour cette inspection.',
                  icon: <ToolOutlined style={{ color: '#52c41a' }} />,
                  placement: 'bottomRight',
                });
              }}
            >
              Nouvelle réparation
            </Button>
  
            <Button
              danger
              onClick={() => modal.destroy()}
              style={{ borderRadius: 4 }}
            >
              Annuler
            </Button>
          </div>
        ),
      });
    } else {
      openModal('Reparer', record.id_sub_inspection_gen);
      notification.open({
        message: 'Nouvelle réparation',
        description: 'Aucune réparation existante. Création d’une nouvelle fiche...',
        icon: <ToolOutlined style={{ color: '#faad14' }} />,
        placement: 'bottomRight',
      });
    }
  };
  
export const handleValider = (openModal, record) => {
    const alreadyValidated = !!record.date_validation;

    const modal = Modal.confirm({
      title: (
        <span style={{ fontWeight: 600, fontSize: 18 }}>
          <CheckCircleTwoTone twoToneColor="#1890ff" /> {alreadyValidated ? 'Validation déjà effectuée' : 'Valider l’inspection ?'}
        </span>
      ),
      content: (
        <div style={{ fontSize: 15, lineHeight: 1.5 }}>
          {alreadyValidated ? (
            <div>
              Cette inspection <strong>a déjà été validée</strong>.
              <br />
              Vous pouvez <strong>la consulter</strong>, <strong>en créer une nouvelle</strong> ou <strong>fermer cette boîte</strong>.
            </div>
          ) : (
            <div>
              Vous êtes sur le point de <strong>valider cette inspection</strong>.
              <br />
              Confirmez-vous vouloir poursuivre cette opération ?
            </div>
          )}
        </div>
      ),
      icon: null,
      centered: true,
      footer: (
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginTop: '15px' }}>
          {/* Si la validation existe déjà */}
          {alreadyValidated ? (
            <>
              <Button
                icon={<FormOutlined />}
                style={{ backgroundColor: '#1677ff', color: 'white', borderRadius: 4 }}
                onClick={() => {
                  modal.destroy();
                  openModal('AddValider', record.id_inspection_gen);
                  notification.info({
                    message: 'Consultation de la validation',
                    description: 'Vous visualisez la validation déjà effectuée.',
                    placement: 'bottomRight',
                    icon: <EyeOutlined style={{ color: '#1677ff' }} />,
                  });
                }}
              >
                Voir la validation
              </Button>
  
              <Button
                icon={<ToolOutlined />}
                style={{ backgroundColor: '#52c41a', color: 'white', borderRadius: 4 }}
                onClick={() => {
                  modal.destroy();
                  openModal('updatedValider', record.id_inspection_gen);
                  notification.success({
                    message: 'Nouvelle validation',
                    description: 'Vous pouvez créer une nouvelle validation pour cette inspection.',
                    placement: 'bottomRight',
                    icon: <ToolOutlined style={{ color: '#52c41a' }} />,
                  });
                }}
              >
                Nouvelle validation
              </Button>
            </>
          ) : (
            <Button
              icon={<CheckOutlined />}
              style={{ backgroundColor: '#1890ff', color: 'white', borderRadius: 4 }}
              onClick={() => {
                modal.destroy();
                openModal('AddValider', record.id_inspection_gen);
                notification.success({
                  message: 'Validation en cours',
                  description: 'Vous êtes en train de valider l’inspection.',
                  placement: 'bottomRight',
                  icon: <CheckOutlined style={{ color: '#1890ff' }} />,
                });
              }}
            >
              Valider maintenant
            </Button>
          )}
  
          <Button
            danger
            onClick={() => modal.destroy()}
            style={{ borderRadius: 4 }}
          >
            Annuler
          </Button>
        </div>
      ),
    });
  }

export const vehiculeUpdateAnnuler = async (id, fetchData) => {
  Modal.confirm({
    title: (
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <ExclamationCircleOutlined style={{ fontSize: 28, color: "#FF4D4F" }} />
        <Typography.Text strong style={{ fontSize: 18, color: "#333", fontWeight: '600' }}>
          Annuler la demande
        </Typography.Text>
      </div>
    ),
    content: (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <Typography.Text style={{ fontSize: 16, color: '#666', lineHeight: 1.6 }}>
          Êtes-vous sûr de vouloir annuler cette demande ?
        </Typography.Text>
        <Typography.Text type="danger" style={{ fontSize: 14, marginTop: 12 }}>
          Cette action est irréversible et la demande ne pourra pas être récupérée.
        </Typography.Text>
      </div>
    ),
    okText: "Oui, annuler",
    cancelText: "Non",
    okType: "danger",
    centered: true,
    maskClosable: true,
    icon: null,
    okButtonProps: {
      style: {
        backgroundColor: "#FF4D4F",
        borderColor: "#FF4D4F",
        fontWeight: 600,
        color: "#fff",
        borderRadius: 4,
        transition: 'all 0.3s ease-in-out',
      },
      onMouseEnter: (e) => {
        e.target.style.backgroundColor = '#FF2A2A';
      },
      onMouseLeave: (e) => {
        e.target.style.backgroundColor = '#FF4D4F';
      },
    },
    cancelButtonProps: {
      style: {
        fontWeight: 600,
        color: "#333",
        borderRadius: 4,
        borderColor: "#ddd",
        transition: 'all 0.3s ease-in-out',
      },
    },
    onOk: async () => {
      try {
        await putDemandeVehiculeAnnuler(id);
        notification.success({
          message: 'Demande annulée',
          description: 'La demande a été annulée avec succès.',
          placement: 'topRight',
        });
        fetchData(); 
      } catch (error) {
        console.error("Erreur lors de l’annulation :", error);
        notification.error({
          message: 'Erreur',
          description: 'Une erreur est survenue lors de l’annulation de la demande.',
          placement: 'topRight',
        });
      }
    }
  });
};


export const vehiculeRetour = async (id, fetchData) => {
  Modal.confirm({
    title: (
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <ExclamationCircleOutlined style={{ fontSize: 28, color: "#FF4D4F" }} />
        <Typography.Text strong style={{ fontSize: 18, color: "#333", fontWeight: '600' }}>
          Confirmer le retour du véhicule
        </Typography.Text>
      </div>
    ),
    content: (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <Typography.Text style={{ fontSize: 16, color: '#666', lineHeight: 1.6 }}>
          Êtes-vous sûr de vouloir enregistrer le retour de ce véhicule ?
        </Typography.Text>
        <Typography.Text type="danger" style={{ fontSize: 14, marginTop: 12 }}>
          Cette action est définitive et mettra à jour l’état du véhicule.
        </Typography.Text>
      </div>
    ),
    okText: "Oui, confirmer",
    cancelText: "Non",
    okType: "danger",
    centered: true,
    maskClosable: true,
    icon: null,
    okButtonProps: {
      style: {
        backgroundColor: "#FF4D4F",
        borderColor: "#FF4D4F",
        fontWeight: 600,
        color: "#fff",
        borderRadius: 4,
        transition: 'all 0.3s ease-in-out',
      },
      onMouseEnter: (e) => {
        e.currentTarget.style.backgroundColor = '#FF2A2A';
      },
      onMouseLeave: (e) => {
        e.currentTarget.style.backgroundColor = '#FF4D4F';
      },
    },
    cancelButtonProps: {
      style: {
        fontWeight: 600,
        color: "#333",
        borderRadius: 4,
        borderColor: "#ddd",
        transition: 'all 0.3s ease-in-out',
      },
    },
    onOk: async () => {
      try {
        await putDemandeVehiculeRetour(id);
        notification.success({
          message: 'Succès',
          description: 'Le véhicule a bien été marqué comme retourné.',
          placement: 'topRight',
        });
        fetchData(); 
      } catch (error) {
        console.error("Erreur lors du retour du véhicule :", error);
        notification.error({
          message: 'Erreur',
          description: 'Une erreur est survenue lors de la mise à jour du retour du véhicule.',
          placement: 'topRight',
        });
      }
    }
  });
};