import React, { useState } from 'react'
import { Input } from 'antd';
import { ToolOutlined } from '@ant-design/icons';

const { Search } = Input;


const Reparation = () => {
    const [searchValue, setSearchValue] = useState('');
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const scroll = { x: 400 };
    
  return (
    <>
        <div className="client">
            <div className="client-wrapper">
                <div className="client-row">
                    <div className="client-row-icon">
                        <ToolOutlined className='client-icon'/>
                    </div>
                    <h2 className="client-h2">Liste des réparations</h2>
                </div>

                <div className="client-actions">
                    <div className="client-row-left">
                        <Search 
                            placeholder="Recherche..." 
                            onChange={(e) => setSearchValue(e.target.value)}
                            enterButton
                        />
                    </div>
                </div>
            </div>
        </div>
    </>
  )
}

export default Reparation