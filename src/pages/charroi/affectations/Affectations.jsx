import React, { useState } from 'react'
import { Input, Button } from 'antd';
import { SwapOutlined, PlusCircleOutlined } from '@ant-design/icons';
const { Search } = Input;

const Affectations = () => {
    const [searchValue, setSearchValue] = useState('');
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);

    const handleAddAffectation = () => {

    }

  return (
    <>
        <div className="client">
            <div className="client-wrapper">
                <div className="client-row">
                    <div className="client-row-icon">
                        <SwapOutlined className='client-icon'/>
                    </div>
                    <h2 className="client-h2">Affectation</h2>
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
                            onClick={handleAddAffectation}
                        >
                            Affectation
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    </>
  )
}

export default Affectations