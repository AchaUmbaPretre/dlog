import React, { useEffect, useState } from 'react'
import { Form, Input, InputNumber, Button, Select, message, Collapse, notification } from 'antd';
import './declarationForm.scss'
import TemplateOne from '../../template/templateOne/TemplateOne';
import { getTemplate } from '../../../services/templateService';
import { getClient } from '../../../services/clientService';

const { Option } = Select;
const { Panel } = Collapse;

const DeclarationForm = () => {
    const [form] = Form.useForm();
    const [templates, setTemplates] = useState([]);
    const [idTemplate, setIdTemplate] = useState(null);
    const [isLoading, setIsLoading] = useState(false);


    const fetchData = async () => {

        try {
          const { data } = await getTemplate();
          setTemplates(data);
        } catch (error) {
          notification.error({
            message: 'Erreur de chargement',
            description: 'Une erreur est survenue lors du chargement des données.',
          });
        }
      };
  
    useEffect(() => {
      fetchData();
    }, []);
    const onFinish = async (values) => {

    };

  return (
    <>
        <div className="declarationForm">
            <div className="declaration-wrapper">
                <div className="declaration-left">
                    <Form
                        form={form}
                        name="declaration_form"
                        layout="vertical"
                        onFinish={onFinish}
                    >
                        <Collapse defaultActiveKey={['1', '2']} accordion>
                            <Panel header="Section Entreposage" key="1">
                            <Form.Item
                                name="id_template_occu"
                                label="Template"
                                rules={[{ required: true, message: "Veuillez entrer l'ID Template Occupé" }]}
                            >
{/*                                 <Select
                                    showSearch
                                    options={template?.map(item => ({ value: item.id_template, label: item.nom }))}
                                    placeholder="Sélectionnez..."
                                    optionFilterProp="label"
                                />  */}
                            </Form.Item>

                            <Form.Item
                                name="periode"
                                label="Période"
                                rules={[{ required: true, message: "Veuillez entrer la période" }]}
                            >
                                <Input placeholder="Période" />
                            </Form.Item>

                            <Form.Item
                                name="m2_occupe"
                                label="M² Occupé"
                                rules={[{ required: true, message: "Veuillez entrer la superficie occupée" }]}
                            >
                                <InputNumber min={0} style={{ width: '100%' }} placeholder="M² Occupé" />
                            </Form.Item>

                            <Form.Item
                                name="m2_facture"
                                label="M² Facturé"
                                rules={[{ required: true, message: "Veuillez entrer la superficie facturée" }]}
                            >
                                <InputNumber min={0} style={{ width: '100%' }} placeholder="M² Facturé" />
                            </Form.Item>

                            <Form.Item
                                name="tarif_entreposage"
                                label="Tarif Entreposage"
                                rules={[{ required: true, message: "Veuillez entrer le tarif d'entreposage" }]}
                            >
                                <InputNumber min={0} style={{ width: '100%' }} placeholder="Tarif Entreposage" />
                            </Form.Item>

                            <Form.Item
                                name="entreposage_admin"
                                label="Entreposage Admin"
                                rules={[{ required: true, message: "Veuillez entrer l'Entreposage Admin" }]}
                            >
                                <InputNumber min={0} style={{ width: '100%' }} placeholder="Entreposage Admin" />
                            </Form.Item>

                            <Form.Item
                                name="debours_entreposage"
                                label="Débours"
                                rules={[{ required: true, message: "Veuillez entrer les débours" }]}
                            >
                                <InputNumber min={0} style={{ width: '100%' }} placeholder="Débours" />
                            </Form.Item>

                            <Form.Item
                                name="total_entreposage"
                                label="Total"
                                rules={[{ required: true, message: "Veuillez entrer le total" }]}
                            >
                                <InputNumber min={0} style={{ width: '100%' }} placeholder="Total" />
                            </Form.Item>

                            <Form.Item
                                name="ttc_entreposage"
                                label="TTC"
                                rules={[{ required: true, message: "Veuillez entrer le TTC" }]}
                            >
                                <InputNumber min={0} style={{ width: '100%' }} placeholder="TTC" />
                            </Form.Item>

                            <Form.Item
                                name="observation_entreposage"
                                label="Observation"
                            >
                                <Input.TextArea rows={4} placeholder="Observation" />
                            </Form.Item>
                            </Panel>

                            <Panel header="Section Manutention" key="2">
                            <Form.Item
                                name="id_ville"
                                label="ID Ville"
                                rules={[{ required: true, message: "Veuillez entrer l'ID de la ville" }]}
                            >
                                <InputNumber min={1} style={{ width: '100%' }} placeholder="ID Ville" />
                            </Form.Item>

                            <Form.Item
                                name="id_client"
                                label="ID Client"
                                rules={[{ required: true, message: "Veuillez entrer l'ID du client" }]}
                            >
                                <InputNumber min={1} style={{ width: '100%' }} placeholder="ID Client" />
                            </Form.Item>

                            <Form.Item
                                name="id_batiment"
                                label="ID Bâtiment"
                                rules={[{ required: true, message: "Veuillez entrer l'ID du bâtiment" }]}
                            >
                                <InputNumber min={1} style={{ width: '100%' }} placeholder="ID Bâtiment" />
                            </Form.Item>

                            <Form.Item
                                name="id_objet"
                                label="ID Objet (sauf Superficie)"
                                rules={[{ required: true, message: "Veuillez entrer l'ID de l'objet" }]}
                            >
                                <InputNumber min={1} style={{ width: '100%' }} placeholder="ID Objet" />
                            </Form.Item>

                            <Form.Item
                                name="manutention"
                                label="Manutention"
                                rules={[{ required: true, message: "Veuillez entrer la manutention" }]}
                            >
                                <InputNumber min={0} style={{ width: '100%' }} placeholder="Manutention" />
                            </Form.Item>

                            <Form.Item
                                name="tarif_manutention"
                                label="Tarif Manutention"
                                rules={[{ required: true, message: "Veuillez entrer le tarif de manutention" }]}
                            >
                                <InputNumber min={0} style={{ width: '100%' }} placeholder="Tarif Manutention" />
                            </Form.Item>

                            <Form.Item
                                name="debours_manutention"
                                label="Débours"
                                rules={[{ required: true, message: "Veuillez entrer les débours" }]}
                            >
                                <InputNumber min={0} style={{ width: '100%' }} placeholder="Débours" />
                            </Form.Item>

                            <Form.Item
                                name="total_manutention"
                                label="Total"
                                rules={[{ required: true, message: "Veuillez entrer le total" }]}
                            >
                                <InputNumber min={0} style={{ width: '100%' }} placeholder="Total" />
                            </Form.Item>

                            <Form.Item
                                name="ttc_manutention"
                                label="TTC"
                                rules={[{ required: true, message: "Veuillez entrer le TTC" }]}
                            >
                                <InputNumber min={0} style={{ width: '100%' }} placeholder="TTC" />
                            </Form.Item>
                            </Panel>
                        </Collapse>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" style={{ margin:'10px 0'}}>
                                Soumettre
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
                <div className="declaration-right">
                    <TemplateOne idTemplate={idTemplate} />
                </div>
            </div>
        </div>
    </>
  )
}

export default DeclarationForm