import { useEffect, useState, useCallback } from 'react';
import {
  Button,
  Form,
  Input,
  Select,
  Row,
  Col,
  DatePicker,
  notification,
  Skeleton,
  Divider,
  InputNumber
} from 'antd';

const CarburantVehiculeForm = () => {
    const [form] = Form.useForm();

  return (
    <>
        <div className="controle_form">
            <div className="controle_title_rows">
                <h2 className="controle_h2">Enregistrer un nouveau vehicule ou groupe electrogene</h2> 
            </div>
            <div className="controle_wrapper">
                
            </div>
        </div>
    </>
  )
}

export default CarburantVehiculeForm