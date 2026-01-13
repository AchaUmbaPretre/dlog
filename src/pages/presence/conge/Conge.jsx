import React, { useState } from 'react'
import { Input, Button } from 'antd';
import { FieldTimeOutlined, PlusCircleOutlined } from '@ant-design/icons';

const { Search } = Input;

const Conge = () => {
    const [searchValue, setSearchValue] = useState('');
    
  return (
    <>
        <div className="client">
            <div className="client-wrapper">
                <div className="client-row">
                    <div className="client-row-icon">
                        <FieldTimeOutlined/>
                    </div>
                    <div className="client-h2">Liste des congés</div>
                </div>

                <div className="client-actions">
                    <div className="client-row-left">
                        <Search 
                            placeholder="Recherche..." 
                            onChange={(e) => setSearchValue(e.target.value)}
                            enterButton
                        />
                    </div>

                    <div className="client-rows-right">
                        <Button
                            type="primary"
                            icon={<PlusCircleOutlined />}
                        >
                            Ajouter un congé
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    </>
  )
}

export default Conge