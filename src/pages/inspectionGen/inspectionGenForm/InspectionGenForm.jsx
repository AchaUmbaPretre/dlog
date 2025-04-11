import React, { useState } from 'react'
import { Form, Row, Col, Skeleton, Select } from 'antd';

const InspectionGenForm = () => {
    const [form] = Form.useForm();
    const [ loading, setLoading ] = useState(false);
    const [ chauffeur, setChauffeur ] = useState([])
    const [ vehicule, setVehicule ] = useState([])
    const [ loadingData, setLoadingData ] = useState(false);

    const handleSubmit = async (values) => {

    }

  return (
    <>
        <div className="controle_form">
            <div className="controle_title_rows">
                <div className="controle_h2">Form inspection</div>
            </div>
            <div className="controle_wrapper">
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                >
                    <Row gutter={12}>
                        <Col xs={24} md={12}>
                            <Form.Item
                                label="Véhicule"
                                name="id_vehicule"
                                rules={[{ required: true, message: 'Veuillez sélectionner un véhicule' }]}
                            >
                                { loadingData ? <Skeleton.Input active={true} /> : 
                                <Select
                                    allowClear
                                    showSearch
                                    options={vehicule.map((item) => ({
                                        value: item.id_vehicule,
                                        label: item.nom_vehicule,
                                    }))}
                                    optionFilterProp="label"
                                    placeholder="Sélectionnez un vehicule..."
                                /> }
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={12}>
                            <Form.Item
                                label="Chauffeur"
                                name="id_chauffeur"
                                rules={[{ required: true, message: 'Veuillez sélectionner un chauffeur' }]}
                            >
                                { loadingData ? <Skeleton.Input active={true} /> : 
                                <Select
                                    allowClear
                                    showSearch
                                    options={chauffeur.map((item) => ({
                                            value: item.id_cat_inspection,
                                            label: item.nom_cat_inspection,
                                        }))}
                                    optionFilterProp="label"
                                    placeholder="Sélectionnez une categorie..."
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

export default InspectionGenForm