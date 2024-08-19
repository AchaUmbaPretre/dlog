import { Button, Form, Input, message } from 'antd';
import React from 'react'

const DepartementForm = () => {

  return (
    <>
        <div className="client_form">
            <div className="client_wrapper">
            <Form
                layout="vertical"
                onFinish={(values) => {
                console.log('Form values:', values);
                message.success('Client ajouté avec succès !');
                }}
            >
                <Form.Item
                    label="Nom de departement"
                    name="nom_departement"
                    rules={[{ required: true, message: 'Veuillez entrer le nom de departement !' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="description"
                    name="description"
                    rules={[{ required: false, message: "Veuillez entrer la description !" }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="telephone"
                    name="telephone"
                    rules={[{ required: true, message: 'Veuillez entrer le téléphone... !' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Email"
                    name="email"
                    rules={[{ required: false, message: "Veuillez entrer l'adresse Mail!" }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="responsable"
                    name="responsable"
                    rules={[{ required: false, message: "Veuillez selectionner le nom du responsable!" }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Ajouter
                    </Button>
                </Form.Item>
            </Form>
            </div>
        </div>
    </>
  )
}

export default DepartementForm