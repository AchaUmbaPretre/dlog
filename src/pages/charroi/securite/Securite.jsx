import './securite.scss'
import { Modal } from 'antd';
import userIcon from './../../../assets/user.png';
import securiteIcon from './../../../assets/securite.png';
import retourIcon from './../../../assets/retour.png';
import sortieIcon from './../../../assets/sortie.png';
import BottomNav from './bottomNav/BottomNav';
import {
PoweroffOutlined
} from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import SecuriteSortie from './securiteSortie/SecuriteSortie';
import SecuriteRetour from './securiteRetour/SecuriteRetour';

const Securite = () => {
    const [modalType, setModalType] = useState(null);

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

  return (
    <>
        <div className="securite">
            <div className="securite_wrapper">
                <div className="securite_top">
                    <div className="securite-row-img">
                        <img src={userIcon} alt="" className="securite-img" />
                        <div className="securite-row-text">
                            <span className="text_span">John</span>
                            <span className="text_span_sub">Securité</span>
                        </div>
                    </div>
                    <div className="securite-disconneted">
                        <PoweroffOutlined className='securite_icon' />
                    </div>
                </div>
                <h2 className="title-h2">👋 Bienvenue sur notre application</h2>
                <div className="securite_center_rows">
                    <img src={securiteIcon} alt="" className='img_sec' />
                </div>
                <h2 className="title-sous-h2">⚙️ Nos Options</h2>

                <div className="securite-menus-rows">
                    <div className="securite_menu-row" onClick={handleSortie}>
                        <img src={sortieIcon} alt="" className='icons'/>
                        <h3 className="securite_h3">Sortie</h3>
                    </div>
                    
                    <div className="securite_menu-row" onClick={handleRetour}>
                        <img src={retourIcon} alt="" className='icons'/>
                        <h3 className="securite_h3">Entrée</h3>
                    </div>
                </div>

            </div>
            <BottomNav/>
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
    </>
  )
}

export default Securite