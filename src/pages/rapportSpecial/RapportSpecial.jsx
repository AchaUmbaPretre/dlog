import React, { useState } from 'react'
import { Modal, Button, Input } from 'antd';
import { AuditOutlined, PlusCircleOutlined } from '@ant-design/icons';
import RapportSpecialForm from './rapportSpecialForm/RapportSpecialForm';

const { Search } = Input;

const RapportSpecial = () => {
    const [searchValue, setSearchValue] = useState('');
    const [modalType, setModalType] = useState(null);
    
    const handleAddRapport = (id) => {
        openModal('Add', id);
    }

    const closeAllModals = () => {
        setModalType(null);
      };
      
    const openModal = (type, idDeclaration = '') => {
        closeAllModals();
        setModalType(type);
      };
    
  return (
    <>
        <div className="client">
            <div className="client-wrapper">
                <div className="client-rows">
                    <div className="client-row">
                        <div className="client-row-icon">
                            <AuditOutlined className='client-icon' />
                        </div>
                        <div className="client-h2">
                            Rapport spécial
                        </div>
                    </div>
                    <div className="client-row-lefts">

                    </div>
                </div>
                <div className="client-actions">
                    <div className="client-row-left">
                        <Search 
                        placeholder="Recherche..." 
                        enterButton
                        onChange={(e) => setSearchValue(e.target.value)}
                        />
                    </div>

                    <div className="client-rows-right">
                        <Button
                        type="primary"
                        icon={<PlusCircleOutlined />}
                        onClick={handleAddRapport}
                        >
                            Ajouter un rapport
                        </Button>
                    </div>
                </div>
            </div>
            <Modal
              title=""
              visible={modalType === 'Add'}
              onCancel={closeAllModals}
              footer={null}
              width={950}
              centered
          >
            <RapportSpecialForm  />
          </Modal>
        </div>
    </>
  )
}

export default RapportSpecial