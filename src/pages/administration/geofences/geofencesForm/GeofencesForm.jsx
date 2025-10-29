import { Button, Form, Input, notification, Row, Select, Col } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;


const GeofencesForm = ({closeModal, fetchData }) => {
    const [form] = Form.useForm();
    const [isLoading, setIsLoading] = useState(false);
    const [types, setTypes] = useState([]);
    const [data, setData] = useState([]);

    useEffect(() => {
        form.resetFields();
      }, [form]);

    const onFinish = async (values) => {
    };

    return (
        <div className="controle_form">
            <div className="controle_title_rows">
                <h2 className="controle_h2">Form Geofences dlog</h2>
            </div>
            <div className="controle_wrapper">
                <Form form={form} layout="vertical" onFinish={onFinish}>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Nom du falcon"
                                name="nom_falcon"
                                rules={[{ required: true, message: 'Veuillez entrer le nom du falcon!' }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item label="Nom" name="nom">
                                <Input />
                            </Form.Item>
                        </Col>

                        <Col span={8}>
                                <Form.Item
                                    label="Type"
                                    name="type_geofence"
                                    rules={[{ required: true, message: 'Veuillez sélectionner une ville!' }]}
                                >
                                    <Select
                                        showSearch
                                        options={data.map((item) => ({
                                            value: item.id,
                                            label: item.capital,
                                        }))}
                                        placeholder="Sélectionnez une ville..."
                                        optionFilterProp="label"
                                    />
                                </Form.Item>
                            </Col>

                            <Col span={8}>
                                <Form.Item label="Client" name="client_id">
                                    <Input />
                                </Form.Item>
                            </Col>

                            <Col span={8}>
                                <Form.Item label="Zone" name="zone_parent_id">
                                    <Input />
                                </Form.Item>
                            </Col>

                            <Col span={8}>
                                <Form.Item label="Description" name="description">
                                    <Input.TextArea
                                        style={{ height: '80px', resize: 'none' }}
                                       placeholder="Entrez la description..."
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" loading={isLoading} disabled={isLoading}>
                                {'Ajouter'}
                            </Button>
                        </Form.Item>
                    </Form>
            </div>
        </div>
    );
};

export default GeofencesForm;
