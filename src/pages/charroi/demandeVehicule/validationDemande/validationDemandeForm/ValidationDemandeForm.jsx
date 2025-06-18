import { useState } from 'react'
import { Form, Card, Row, Col } from 'antd';


const ValidationDemandeForm = () => {
    const [form] = Form.useForm();
    const [ loading, setLoading ] = useState(false);

    const onFinish = async (values) => {

    }

  return (
    <>
        <div className="controle_form">
            <div className="controle_title_rows">
                <div className="controle_h2">Validation de demande</div>
            </div>
            <div className="controle_wrapper">
                <Form
                    form={form}
                    layout="vertical"
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

export default ValidationDemandeForm