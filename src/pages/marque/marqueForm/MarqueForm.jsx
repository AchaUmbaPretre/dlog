import React, { useEffect, useState } from 'react'
import { Col, DatePicker, Form, notification, Input, InputNumber, Row, Select, Skeleton, Button, Divider, message } from 'antd';

const MarqueForm = () => {
    const [form] = Form.useForm();
    const [loadingData, setLoadingData] = useState(false);
    const [modele, setModele] = useState([]);
    

  return (
    <>
        <div className="controle_form">
            <div className="controle_title_rows">
                <h2 className="controle_h2">ENREGISTRER UNE MARQUE</h2>
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
                        <Col xs={24} md={12}>
                            <Form.Item
                                name="id_marque"
                                label="Marque"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Veuillez fournir une marque...',
                                    }
                                ]}
                            >
                                {loadingData ? <Skeleton.Input active={true} /> : <Input size='large' placeholder="Saisir la marque..." style={{width:'100%'}}/>}
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={12}>
                            <Form.Item
                                name="id_marque"
                                label="Marque"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Veuillez fournir une marque...',
                                    }
                                ]}
                            >
                                {loadingData ? <Skeleton.Input active={true} /> : 
                                    <Select
                                        allowClear
                                        size='large'
                                        showSearch
                                        options={etat.map((item) => ({
                                            value: item.id_type_statut_suivi                                           ,
                                            label: `${item.nom_type_statut}`,
                                        }))}
                                        placeholder="Sélectionnez un fournisseur..."
                                        optionFilterProp="label"
                                    />}
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </div>
        </div>
    </>
  )
}

export default MarqueForm