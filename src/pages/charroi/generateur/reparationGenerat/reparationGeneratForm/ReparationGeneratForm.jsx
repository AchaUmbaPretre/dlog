import React, { useMemo, useState } from 'react'
import { Col, DatePicker, Form, Modal, Card, notification, Input, InputNumber, Row, Select, Skeleton, Button, Divider, message } from 'antd';
import { useReparateurGenLoader } from '../hook/useReparateurGenLoader';
import { useReparateurGenForm } from '../hook/useReparateurGenForm';


const ReparationGeneratForm = ({closeModal, fetchData}) => {
    const [form] = Form.useForm();
    const [loadingData, setLoadingData] = useState(false);
    const [fournisseur, setFournisseur] = useState([]);
    const { loading, lists } = useReparateurGenForm()

    const onFinish = async (values) => {

    }

    const generateurOptions = useMemo(()=> lists.generateurs.map(v => ({ value: v.id_generateur, label: `${v.nom_marque} / ${v.nom_modele} / ${v.code_groupe}` })), [lists.generateurs])
  return (
    <>
        <div className="controle_form">
            <div className="controle_title_rows">
                <h2 className="controle_h2">ENREGISTRER UNE REPARATION</h2>
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
                    <Card>
                       <Row gutter={12}>
                            <Col xs={24} md={8}>
                                
                            </Col>
                       </Row> 
                    </Card>
                </Form>
            </div>
        </div>
    </>
  )
}

export default ReparationGeneratForm