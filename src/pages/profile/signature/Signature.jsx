import React, { useState } from 'react'
import SignatureForm from './signatureForm/SignatureForm'
import {  Modal, Button, Menu, notification, Popconfirm, Popover, Space, Tooltip, Tag } from 'antd';
import { useSelector } from 'react-redux';
import './signature.scss'
const Signature = () => {
    const userId = useSelector((state) => state.user?.currentUser.id_utilisateur);
    const [data, setData] = useState(null);
    const [modalType, setModalType] = useState(null);

    const handleSignaure = () => {
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

    }

  return (
    <>
        <div className="signature">
            <div className="signature_wrapper">
            {   !data ?
                <div className="creer_signature">
                    <button className='btn_signature' onClick={handleSignaure}>Créer une signature</button>
                </div> : 
                <div className="image_signature">
                    
                </div>
            }
            </div>
        </div>
        <Modal
            title=""
            visible={modalType === 'Detail'}
            onCancel={closeAllModals}
            footer={null}
            width={900}
            centered
        >
            <SignatureForm closeModal={() => setModalType(null)} fetchData={fetchData}/>
        </Modal>
    </>
  )
}

export default Signature