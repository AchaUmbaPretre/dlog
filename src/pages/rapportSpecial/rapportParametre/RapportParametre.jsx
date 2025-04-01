import React from 'react'

const RapportParametre = () => {
  return (
    <>
            <div className="controle_form">
      <div className="controle_title_rows">
        <h2 className='controle_h2'>Ajouter nouveau fournisseur</h2>                
      </div>
      <div className="controle_wrapper">
        <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{
            date_ajout: new Date(),
            }}
        >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="nom_fournisseur"
              label="Nom du Fournisseur"
              rules={[{ required: true, message: 'Veuillez entrer le nom du fournisseur' }]}
            >
              <Input placeholder="Nom du fournisseur" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="telephone"
              label="Téléphone"
            >
              <Input placeholder="Téléphone" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="email"
              label="Email"
              rules={[{ type: 'email', message: 'Veuillez entrer un email valide' }]}
            >
              <Input placeholder="Email" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="pays"
              label="Pays"
            >
              <Input placeholder="Pays" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="ville"
              label="Ville"
            >
              <Select
                  showSearch
                  options={province.map((item) => ({
                  value: item.id,
                  label: item.name}))}
                  placeholder="Sélectionnez une province..."
                  optionFilterProp="label"
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="nom_activite"
              label="Activité"
            >
            <Select
                  mode="multiple"
                  showSearch
                  options={activite.map((item) => ({
                  value: item.id_activite,
                  label: item.nom_activite}))}
                  placeholder="Sélectionnez une activité..."
                  optionFilterProp="label"
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} disabled={loading}>
            Soumettre
          </Button>
        </Form.Item>
        </Form>
      </div>
    </div>
    </>
  )
}

export default RapportParametre