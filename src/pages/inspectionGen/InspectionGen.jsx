import React, { useState } from 'react'
import { Input, Button } from 'antd';
import { FileSearchOutlined, PlusCircleOutlined } from '@ant-design/icons'

const { Search } = Input;

const InspectionGen = () => {
    const [searchValue, setSearchValue] = useState('');

    const handleAddInspection = () => {

    }

  return (
    <>
        <div className="client">
            <div className="client-wrapper">
                <div className="client-row">
                    <div className="client-row-icon">
                        <FileSearchOutlined className='client-icon'/>
                    </div>
                    <h2 className="client-h2">Inspection</h2>
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
                            onClick={handleAddInspection}
                        >
                            Ajouter une inspection
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    </>
  )
}

export default InspectionGen