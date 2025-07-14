import { useEffect, useState } from 'react';
import { getNotificationOne } from '../../../services/tacheService';
import { notification, Modal } from 'antd';
import { useNavigate } from 'react-router-dom';
import DetailTacheGlobalOne from '../../../pages/taches/detailTacheGlobalOne/DetailTacheGlobalOne';
import InspectionGenDetail from '../../../pages/inspectionGen/inspectionGenDetail/InspectionGenDetail';

const Notification = ({ idNotif, onClose }) => {
  const [data, setData] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [id, setId] = useState(null);
  const navigate = useNavigate();

  const closeAllModals = () => {
    setModalType(null);
    setId(null);
  };

  const openModal = (type, id = '') => {
    closeAllModals();
    setModalType(type);
    setId(id);
  };

  const fetchData = async () => {
    try {
      const response = await getNotificationOne(idNotif);
      const notifData = response.data;
      setData(notifData);

      if (notifData?.target_type && notifData?.target_id) {
        switch (notifData.target_type.toLowerCase()) {
          case 'tache':
            openModal('detail', notifData.target_id);
            break;
          case 'Inspection':
            openModal('DetailInspection', notifData.target_id)
            break;
          default:
            notification.warning({
              message: 'Type inconnu',
              description: `Le type ${notifData.target_type} n'est pas pris en charge.`,
            });
        }
      }
    } catch (error) {
      notification.error({
        message: 'Erreur de chargement',
        description: 'Une erreur est survenue lors du chargement des données.',
      });
    }
  };

  useEffect(() => {
    if (idNotif) {
      fetchData();
    }
  }, [idNotif]);

  return (
    <>
      <Modal
        title="Détail de la tâche"
        open={modalType === 'detail'}
        onCancel={closeAllModals}
        footer={null}
        width={1070}
        centered
        zIndex={2000}
      >
        <DetailTacheGlobalOne initialIdTache={id} />
      </Modal>

      <Modal
        title=""
        visible={modalType === 'DetailInspection'}
        onCancel={closeAllModals}
        footer={null}
        width={1023}
        centered
      >
        <InspectionGenDetail inspectionId={id} />
      </Modal>
    </>
  );
};

export default Notification;
