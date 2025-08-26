import { useEffect, useState } from 'react';
import { getNotificationOne } from '../../../services/tacheService';
import { notification, Modal } from 'antd';
import DetailTacheGlobalOne from '../../../pages/taches/detailTacheGlobalOne/DetailTacheGlobalOne';
import InspectionGenDetail from '../../../pages/inspectionGen/inspectionGenDetail/InspectionGenDetail';
import ReparationDetail from '../../../pages/controleTechnique/reparation/reparationDetail/ReparationDetail';

const Notification = ({ idNotif, onClose }) => {
  const [data, setData] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [id, setId] = useState(null);

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
          case 'inspection':
            openModal('DetailInspection', notifData.target_id)
            break;
          case 'reparation':
            openModal('detail_reparation', notifData.target_id)
            break;
          default:
            notification.warning({
              message: 'Type inconnu',
              description: `Le type ${notifData.target_type} n'est pas pris en charge.`,
            });
        }
      }
    } catch (error) {
      console.log(error)
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
        <DetailTacheGlobalOne initialIdTache={id}  allIds={[]}/>
      </Modal>

      <Modal
        title=""
        visible={modalType === 'DetailInspection'}
        onCancel={closeAllModals}
        footer={null}
        width={1023}
        zIndex={2000}
        centered
      >
        <InspectionGenDetail inspectionId={id} />
      </Modal>

      <Modal
        title=""
        visible={modalType === 'detail_reparation'}
        onCancel={closeAllModals}
        footer={null}
        width={900}
        centered
        zIndex={2000}
      >
        <ReparationDetail closeModal={() => setModalType(null)} fetchData={fetchData} idReparation={id} />
      </Modal>
    </>
  );
};

export default Notification;