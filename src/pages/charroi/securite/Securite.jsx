import './securite.scss'
import { Modal, message } from 'antd';
import userIcon from './../../../assets/user.png';
import securiteIcon from './../../../assets/securite.png';
import retourIcon from './../../../assets/retour.png';
import sortieIcon from './../../../assets/sortie.png';
import visiteurIcon from './../../../assets/visiteur.png';
import visiteurSortieIcon from './../../../assets/visiteur_sortie.png';
import agentIcon from './../../../assets/agent.png';
import agentRetourIcon from './../../../assets/agent_retour.png';
import visiteurPietonIcon from './../../../assets/visiteur_pieton.png';
import visiteurPietonSortieIcon from './../../../assets/sortie_pieton.png';
import BottomNav from './bottomNav/BottomNav';
import {
PoweroffOutlined
} from '@ant-design/icons';
import { useState } from 'react';
import SecuriteSortie from './securiteSortie/SecuriteSortie';
import SecuriteRetour from './securiteRetour/SecuriteRetour';
import SecuriteVisiteurForm from './securiteVisiteur/securiteVisiteurForm/SecuriteVisiteurForm';
import { logout } from '../../../services/authService';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import VisiteurPietonForm from './securiteVisiteur/visiteurPieton/visiteurPietonForm/VisiteurPietonForm';
import VisiteurSortie from './securiteVisiteur/visiteurSortie/VisiteurSortie';
import SortieVisiteurPieton from './securiteVisiteur/visiteurPieton/sortieVisiteurPieton/SortieVisiteurPieton';

const Securite = () => {
    const [modalType, setModalType] = useState(null);
    const navigate = useNavigate();
    const datas = useSelector((state) => state.user?.currentUser);

    const closeAllModals = () => {
        setModalType(null);
    };

    const openModal = (type) => {
        closeAllModals();
        setModalType(type);
    };
    
    const handleSortie = () => {
        openModal('Sortie');
    };

    const handleRetour = () => {
        openModal('Retour');
    };

    const handleInfo = () => {
        openModal('Agent');
    };

    const handleInfoSortie = () => {
        openModal('AgentSortie');
    };

    const handleVisiteur = () => {
        openModal('Visiteur');
    };

    const handleSortieVisiteur = () => {
        openModal('SortieVisiteur')
    };

    const handleVisiteurPieton = () => {
        openModal('Pieton')
    };

    const handleVisiteurPietonRetour = () => {
        openModal('PietonRetour')
    };

      const handleLogout = async () => {
        try {
          await logout();
            localStorage.removeItem('persist:root');
            message.success('Déconnexion réussie !');
            navigate('/login');
            window.location.reload();
        } catch (error) {
          message.error('Erreur lors de la déconnexion.');
        }
      };

  return (
    <>
        <div className="securite">
        <div className="securite__wrapper">
            <div className="securite__top">
            <div className="securite__user-info">
                <img src={userIcon} alt="Utilisateur" className="securite__avatar" />
                <div className="securite__user-text">
                <span className="securite__username">{datas?.nom}</span>
                <span className="securite__role">{datas?.role}</span>
                </div>
            </div>
            <button
                className="securite__logout"
                onClick={handleLogout}
                aria-label="Déconnexion"
            >
                <PoweroffOutlined className="securite__icon" />
            </button>
            </div>

            <h2 className="securite__welcome">👋 Bienvenue sur DLOG</h2>

            <div className="securite__banner">
            <img src={securiteIcon} alt="Bannière sécurité" className="securite__banner-img" />
            </div>

            <h2 className="securite__subtitle">⚙️ Nos Options</h2>

            <div className="securite__menu">
            {[
                { label: "Sortie", icon: sortieIcon, onClick: handleSortie },
                { label: "Entrée", icon: retourIcon, onClick: handleRetour },
                { label: "Visiteur", icon: visiteurIcon, onClick: handleVisiteur },
                { label: "Sortie visiteur", icon: visiteurSortieIcon, onClick: handleSortieVisiteur },
                { label: "Visiteur Piéton", icon: visiteurPietonIcon, onClick: handleVisiteurPieton },
                { label: "Sortie Visiteur Piéton", icon: visiteurPietonSortieIcon, onClick: handleVisiteurPietonRetour },
                { label: "Sortie agent", icon: agentIcon, onClick: handleInfo },
                { label: "Retour agent", icon: agentRetourIcon, onClick: handleInfoSortie }
            ].map(({ label, icon, onClick }) => (
                <div
                    key={label}
                    className="securite__menu-item"
                    role="button"
                    tabIndex={0}
                    aria-label={label}
                    onClick={onClick}
                    onKeyPress={(e) => e.key === 'Enter' && onClick()}
                >
                    <span className="securite__menu-dot" />
                    <img src={icon} alt={`Icône ${label}`} className="securite__menu-icon" />
                    <h3 className="securite__menu-label">{label}</h3>
                </div>
            ))}
            </div>
        </div>
        <BottomNav />
        </div>

        <Modal
            title=""
            visible={modalType === 'Sortie'}
            onCancel={closeAllModals}
            footer={null}
            width={500}
            centered
        >
            <SecuriteSortie />
        </Modal>

        <Modal
            title=""
            visible={modalType === 'Retour'}
            onCancel={closeAllModals}
            footer={null}
            width={500}
            centered
        >
            <SecuriteRetour />
        </Modal>

        <Modal
            title=""
            visible={modalType === 'Visiteur'}
            onCancel={closeAllModals}
            footer={null}
            width={800}
            centered
        >
            <SecuriteVisiteurForm closeModal={() => setModalType(null)} />
        </Modal>

        <Modal
            title=""
            visible={modalType === 'Pieton'}
            onCancel={closeAllModals}
            footer={null}
            width={500}
            centered
        >
            <VisiteurPietonForm closeModal={() => setModalType(null)} />
        </Modal>

        <Modal
            title=""
            visible={modalType === 'PietonRetour'}
            onCancel={closeAllModals}
            footer={null}
            width={500}
            centered
        >
            <SortieVisiteurPieton closeModal={() => setModalType(null)} />
        </Modal>

        <Modal
            title=""
            visible={modalType === 'SortieVisiteur'}
            onCancel={closeAllModals}
            footer={null}
            width={500}
            centered
        >
            <VisiteurSortie closeModal={() => setModalType(null)} />
        </Modal>

        <Modal
            title=""
            visible={modalType === 'Agent'}
            onCancel={closeAllModals}
            footer={null}
            width={500}
            centered
        >
            Agent
{/*             <VisiteurSortie closeModal={() => setModalType(null)} />
 */}        </Modal>

         <Modal
            title=""
            visible={modalType === 'agentSortie'}
            onCancel={closeAllModals}
            footer={null}
            width={500}
            centered
        >
            Agent sortie
        </Modal>
    </>
  )
}

export default Securite