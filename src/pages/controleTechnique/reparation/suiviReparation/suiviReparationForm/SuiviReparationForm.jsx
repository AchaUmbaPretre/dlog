import React, { useEffect, useRef, useState } from 'react';
import { Form, Input, Select, Upload, Button, notification, Row, Col, Skeleton } from 'antd';

const SuiviReparationForm = () => {
    const [form] = Form.useForm();
    const [tache, setTache] = useState([]);
    const [loadingData, setLoadingData] = useState(false);
    
    
    const onFinish = async (values) => {

    }

  return (
    <>
        <div className="controle_form">
            <div className="controle_title_rows">
                <h2 className="controle_h2">Suivi de réparation</h2>
            </div>
            <div className="controle_wrapper">
                <Form
                    form={form}
                    name="chauffeurForm"
                    layout="vertical"
                    autoComplete="off"
                    className="custom-form"
                    onFinish={onFinish}
                >
                    <Row gutter={12}>
                        <Col xs={24} md={8}>

                        </Col>
                    </Row>
                </Form>
            </div>
        </div>
    </>
  )
}

export default SuiviReparationForm