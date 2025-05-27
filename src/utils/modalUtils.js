import { Button, Modal, notification } from 'antd';
import { ExclamationCircleTwoTone, CheckOutlined,  InfoCircleOutlined, CheckCircleTwoTone, FormOutlined, ToolOutlined, EyeOutlined } from '@ant-design/icons'

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
                  openModal('AddValider', record.id_inspection_gen);
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