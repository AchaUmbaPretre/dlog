import { useEffect, useState } from 'react';
import SignatureForm from './signatureForm/SignatureForm';
import { Modal, notification } from 'antd';
import { useSelector } from 'react-redux';
import './signature.scss';
import { getSignature } from '../../../services/userService';
import config from '../../../config';

const Signature = () => {
    const userId = useSelector((state) => state.user?.currentUser?.id_utilisateur);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [modalType, setModalType] = useState(null);
    const DOMAIN = config.REACT_APP_SERVER_DOMAIN;

    const handleSignature = () => {
        openModal('Signature');
    };

    const closeAllModals = () => {
        setModalType(null);
    };

    const openModal = (type) => {
        closeAllModals();
        setModalType(type);
    };

    const fetchData = async () => {
        if (!userId) return;
        setLoading(true);
        try {
            const response = await getSignature(userId);
            setData(response?.data[0]?.signature || null);
        } catch (error) {
            notification.error({
                message: 'Erreur de chargement',
                description: 'Une erreur est survenue lors du chargement des données.',
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (userId) fetchData();
    }, [userId]);

    return (
        <>
            <div className="signature">
                <div className="signature_wrapper">
                    {!data ? (
                        <div className="creer_signature">
                            <button className="btn_signature" onClick={handleSignature}>
                                Créer une signature
                            </button>
                        </div>
                    ) : (
                        <div className="image_signature">
                            <span className="title_signe">Ma signature : </span>
                            <img src={`${DOMAIN}/${data}`} alt="Signature" className="img_signature" />
                        </div>
                    )}
                </div>
            </div>

            <Modal
                title=""
                open={modalType === 'Signature'}
                onCancel={closeAllModals}
                footer={null}
                width={900}
                centered
                destroyOnClose
            >
                <SignatureForm closeModal={closeAllModals} fetchData={fetchData} />
            </Modal>
        </>
    );
};

export default Signature;
