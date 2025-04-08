import React, { useEffect, useState } from 'react'
import { Form, Input, Skeleton, Row, Col, Button, Select } from 'antd';
import { useSelector } from 'react-redux';
import { getChauffeur, getSite } from '../../../../services/charroiService';

const { Option } = Select;


const AffectationsForm = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const userId = useSelector((state) => state.user?.currentUser?.id_utilisateur);
    const [chauffeur, setChauffeur] = useState([]);
    const [site, setSite] = useState([]);

    const fetchData = async () => {
        setLoading(true)

        try {
            const [chauffeurData, siteData] = await Promise.all([
                getChauffeur(),
                getSite()
            ])
            setChauffeur(chauffeurData.data.data)
            setSite(siteData.data.data)

        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])


    const onFinish = async (values) => {
        try {
            
        } catch (error) {
            
        }
    }
    
  return (
    <>
        <div className="controle_form">
            <div className="controle_title_rows">
                <h2 className='controle_h2'>Créer une affectation</h2>                
            </div>
            <div className="controle_wrapper">
                <Form 
                    layout="vertical" 
                    onFinish={onFinish} 
                    form={form} 
                >
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Chauffeur"
                                name="id_chauffeur"
                                rules={[{ required: true, message: 'Le nom est requis' }]}
                            >
                                {loading ? <Skeleton.Input active /> : 
                                <Select
                                    allowClear
                                    showSearch
                                    options={chauffeur.map((item) => ({
                                        value: item.id_chauffeur,
                                        label: `${item.prenom} - ${item.nom}`,
                                        }))}
                                    placeholder="Sélectionnez un chauffeur..."
                                    optionFilterProp="label"
                                />}
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                label="Site"
                                name="id_site"
                                rules={[{ required: true, message: 'Le site est requis' }]}
                            >
                                {loading ? <Skeleton.Input active /> : 
                                <Select
                                    allowClear
                                    showSearch
                                    options={site.map((item) => ({
                                        value: item.id_site,
                                        label: `${item.nom_site}`,
                                        }))}
                                    placeholder="Sélectionnez un site..."
                                    optionFilterProp="label"
                                />}
                            </Form.Item>
                        </Col>

                        <Col span={24}>
                            <Form.Item
                                label="Description"
                                name="description"
                                rules={[{ required: false, message: 'Le site est requis' }]}
                            >
                                {loading ? <Skeleton.Input active /> : <Input.TextArea placeholder="Saisir la description..." style={{height:"80px", resize:'none'}} />}
                            </Form.Item>
                        </Col>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" loading={loading} disabled={loading}>Enregistrer</Button>
                        </Form.Item>
                    </Row>
                </Form>
            </div>
        </div>
    </>
  )
}

export default AffectationsForm