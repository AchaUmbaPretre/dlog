import React from 'react'
import { MinusCircleOutlined, SendOutlined, PlusCircleOutlined } from '@ant-design/icons';

const ControleTechniqueForm = () => {
  return (
    <>
        <div className="controle_form">
            <div className="controle_title_rows">
                <h2 className="controle_h2">ENREGISTRER UN NOUVEAU CONTROLE TECHNIQUE</h2>
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
                </Form>
            </div>
        </div>
    </>
  )
}

export default ControleTechniqueForm