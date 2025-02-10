import React from 'react'
import {  RightCircleFilled, DownOutlined,EnvironmentOutlined, FileTextOutlined, DollarOutlined, BarcodeOutlined,ScheduleOutlined } from '@ant-design/icons';

const DeclarationSituationClient = ({idClients}) => {
    const [loading, setLoading] = useState(true);
    const [idClient, setidClient] = useState('');
      
    
  return (
    <>
        <div className="clients">
            <div className="client-wrapper">
                <div className="client-row">
                    <div className="client-row-icon">
                        <ScheduleOutlined className='client-icon' />
                    </div>
                    <h2 className="client-h2">Déclarations {titre}</h2>
                </div>
            </div>
        </div>
    </>
  )
}

export default DeclarationSituationClient