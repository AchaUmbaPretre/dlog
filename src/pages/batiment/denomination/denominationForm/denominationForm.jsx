import React, { useEffect, useState } from 'react';
import { Form, Input, Button, notification } from 'antd';
import { getDenominationOneV, postDenomination } from '../../../../services/batimentService';

const DenominationForm = ({ idBatiment, idDenomination_bat }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [denominations, setDenominations] = useState([{ nom_denomination_bat: '' }]);

  const fetchDataOne = async () => {
    setLoading(true);
    try {
      const { data } = await getDenominationOneV(idDenomination_bat);

      // Utiliser setFieldsValue pour définir les données dans le formulaire directement
      form.setFieldsValue({ denominations: data.map(d => ({ nom_denomination_bat: d.nom_denomination_bat })) });
      
      // Mettre à jour l'état `denominations` pour que le rendu soit correct
      setDenominations(data.map(d => ({ nom_denomination_bat: d.nom_denomination_bat })));
    } catch (error) {
      notification.error({
        message: 'Erreur de chargement',
        description: 'Une erreur est survenue lors du chargement des données.',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (idDenomination_bat) fetchDataOne();
  }, [idDenomination_bat]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // Appel à postDenomination avec les valeurs actuelles
      await postDenomination(idBatiment, { denominations: values.denomination });
      notification.success({
        message: 'Succès',
        description: 'Les dénominations ont été ajoutées avec succès.',
      });
      window.location.reload();
      form.resetFields();
      setDenominations([{ nom_denomination_bat: '' }]); // Réinitialiser les champs de dénomination
    } catch (error) {
      notification.error({
        message: 'Erreur',
        description: "Erreur lors de l'enregistrement des dénominations.",
      });
    } finally {
      setLoading(false);
    }
  };

  const addDenominationField = () => {
    setDenominations([...denominations, { nom_denomination_bat: '' }]);
  };

  const removeDenominationField = (index) => {
    const newDenominations = denominations.filter((_, i) => i !== index);
    setDenominations(newDenominations);
  };

  const handleDenominationChange = (index, value) => {
    const newDenominations = [...denominations];
    newDenominations[index].nom_denomination_bat = value;
    setDenominations(newDenominations);
  };

  return (
    <div className="controle_form">
      <div className="controle_title_rows">
        <h2 className='controle_h2'>{idDenomination_bat ? 'Mettre à jour la dénomination' : 'Insérer des dénominations'}</h2>
      </div>
      <div className="controle_wrapper">
        <Form
          form={form}
          name="format_form"
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ denominations }}
          style={{ maxWidth: 600, margin: '0 auto' }}
        >
          {denominations.map((denomination, index) => (
            <Form.Item
              key={index}
              label={`Dénomination ${index + 1}`}
              name={['denominations', index, 'nom_denomination_bat']}
              rules={[{ required: true, message: 'Veuillez entrer la dénomination' }]}
            >
              <Input
                placeholder="Entrez la dénomination..."
                value={denomination.nom_denomination_bat}
                onChange={(e) => handleDenominationChange(index, e.target.value)}
              />
              {denominations.length > 1 && (
                <Button type="link" onClick={() => removeDenominationField(index)}>
                  Supprimer
                </Button>
              )}
            </Form.Item>
          ))}
          {
            !idDenomination_bat &&
            <Button type="dashed" onClick={addDenominationField} style={{ width: '100%' }}>
              Ajouter une autre dénomination
            </Button>
          }
          <Form.Item>
            <Button style={{marginTop:'15px'}} type="primary" htmlType="submit" loading={loading} disabled={loading}>
              Soumettre
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default DenominationForm;
