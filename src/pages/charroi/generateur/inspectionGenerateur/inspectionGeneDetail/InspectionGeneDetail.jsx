import { useCallback, useEffect, useState } from 'react';
import { Card, Menu, Dropdown, Modal, notification, Button, Tooltip, Tag, Image, Divider } from 'antd';


const InspectionGeneDetail = ({ inspectionId }) => {
    const [datas, setDatas] = useState([]);
    const [loading, setLoading] = useState(false);

  return (
    <>
        <div className="inspectionGenDetail">
            <Card loading={loading} className="rows">
               <div className="inspectionGen_wrapper">
                
               </div> 
            </Card>
        </div>
    </>
  )
}

export default InspectionGeneDetail