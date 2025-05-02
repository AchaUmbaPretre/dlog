import React, { useEffect, useState } from 'react';
import { Form, Card, Col, Upload, Select, message, notification, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { Rnd } from 'react-rnd';
import { useSelector } from 'react-redux';
import html2canvas from 'html2canvas';
import { icons } from '../../../../utils/prioriteIcons';
import { getType_photo } from '../../../../services/batimentService';

const ReparationImage = ({ closeModal, fetchData, idReparation, vehicule }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const [iconPositionsMap, setIconPositionsMap] = useState({ image: [] });
  const userId = useSelector((state) => state.user?.currentUser?.id_utilisateur);
  const [typePhoto, setTypePhoto] = useState([])
  

    const fetchDatas = async () => {
      try {
        const [typeData] = await Promise.all([
         getType_photo(),
        ])
        setTypePhoto(typeData.data)
        
      } catch (error) {
        notification.error({
          message: 'Erreur de chargement',
          description: 'Une erreur est survenue lors du chargement des données.',
        });
      }
    }

  useEffect(() => {
    fetchDatas();
  }, [])

  const handleImageChange = ({ fileList: newFileList }) => {
    const limitedFileList = newFileList.slice(-1);
    setFileList(limitedFileList);

    if (limitedFileList.length > 0) {
      const file = limitedFileList[0].originFileObj;
      setPreviewImage(URL.createObjectURL(file));
      setIconPositionsMap({ image: [] }); 
    } else {
      setPreviewImage(null);
      setIconPositionsMap({ image: [] });
    }
  };

  const onFinish = async () => {
    try {
      await form.validateFields();
  
      if (fileList.length === 0) {
        message.error("Veuillez télécharger une image.");
        return;
      }
  
      setLoading(true);
  
      const formData = new FormData();
      formData.append('id_reparation', idReparation);
      formData.append('user_id', userId);

      const imageContainer = document.querySelector('.image-container');
      const file = fileList[0]?.originFileObj;
  
      if (file && imageContainer) {
        // Capture du rendu DOM
        const canvas = await html2canvas(imageContainer);
        const originalWidth = canvas.width;
        const originalHeight = canvas.height;
  
        // Redimensionnement à 500px de large max (conserve ratio)
        const targetWidth = 500;
        const ratio = targetWidth / originalWidth;
        const targetHeight = originalHeight * ratio;
  
        const resizedCanvas = document.createElement('canvas');
        resizedCanvas.width = targetWidth;
        resizedCanvas.height = targetHeight;
  
        const ctx = resizedCanvas.getContext('2d');
        ctx.drawImage(canvas, 0, 0, originalWidth, originalHeight, 0, 0, targetWidth, targetHeight);
  
        // Convertir en fichier (Blob → File)
        const blob = await new Promise(resolve => resizedCanvas.toBlob(resolve, 'image/png'));
        const finalFile = new File([blob], 'image.png', { type: 'image/png' });
  
        formData.append('image', finalFile);
      } else {
        message.error("Impossible de capturer l’image.");
        return;
      }
  
/*       await putInspectionGenImage(formData);
 */  
      notification.success({
        message: "Succès",
        description: "Image et icônes enregistrées avec succès."
      });
  
      form.resetFields();
      setPreviewImage(null);
      setFileList([]);
      if (fetchData) fetchData();
      if (closeModal) closeModal();
  
    } catch (err) {
      console.error("Erreur onFinish :", err);
      notification.error({
        message: "Erreur",
        description: "Échec de l'envoi."
      });
    } finally {
      setLoading(false);
    }
  };
  
  const addIconToField = (icon, fieldName) => {
    setIconPositionsMap(prev => ({
      ...prev,
      [fieldName]: [...(prev[fieldName] || []), { icon, x: 0, y: 0, width: 50, height: 50 }]
    }));
  };

  const updateIconPosition = (fieldName, index, updatedPos) => {
    setIconPositionsMap(prev => {
      const updated = [...(prev[fieldName] || [])];
      updated[index] = { ...updated[index], ...updatedPos };
      return { ...prev, [fieldName]: updated };
    });
  };

  return (
    <div className="controle_form">
      <div className="controle_title_rows">
        <h2 className="controle_h2">
          Ajouter une image à l'inspection du véhicule <strong>{vehicule}</strong>
        </h2>
      </div>
      <Card>
          <Form 
            form={form} 
            layout="vertical" 
            onFinish={onFinish}
          >
            <Col xs={24}>
            <Form.Item
                    label="Status"
                    name="id_type_photo"
                    rules={[{ required: true, message: 'Veuillez sélectionner un statut' }]}
                >
                    <Select
                        showSearch
                        options={typePhoto?.map((item) => ({
                                value: item.id_type_photo,
                                label: item.nom_type_photo,
                            }))}
                        placeholder="Sélectionnez un statut..."
                        optionFilterProp="label"
                    />
                </Form.Item>
            </Col>
            <Col xs={24}>
              <Form.Item
                label="Image"
                name="image"
                rules={[{ required: true, message: 'Veuillez télécharger une image.' }]}
              >
                <Upload
                  accept="image/*"
                  listType="picture-card"
                  beforeUpload={() => false}
                  multiple={false}
                  fileList={fileList}
                  onChange={handleImageChange}
                >
                  {fileList.length < 1 && (
                    <div>
                      <UploadOutlined />
                      <div style={{ marginTop: 8 }}>Téléverser</div>
                    </div>
                  )}
                </Upload>
              </Form.Item>

              {previewImage && (
                <div className="image-editor">
                  <div className="icon-toolbar" style={{ marginBottom: 16 }}>
                    {icons.map((icon) => (
                      <Button key={icon.id} onClick={() => addIconToField(icon.icon, 'image')} style={{ marginRight: 8 }}>
                        {icon.icon} {icon.label}
                      </Button>
                    ))}
                  </div>

                  <div className="image-container" style={{ position: 'relative', border: '1px solid #ccc', display: 'inline-block' }}>
                    <img
                      src={previewImage}
                      alt="Uploaded"
                      className="uploaded-image"
                      style={{ maxWidth: '100%', display: 'block' }}
                    />

                    {(iconPositionsMap['image'] || []).map((pos, index) => (
                      <Rnd
                        key={index}
                        bounds="parent"
                        size={{ width: pos.width, height: pos.height }}
                        position={{ x: pos.x, y: pos.y }}
                        onDragStop={(e, d) =>
                          updateIconPosition('image', index, { x: d.x, y: d.y })
                        }
                        onResizeStop={(e, direction, ref, delta, position) =>
                          updateIconPosition('image', index, {
                            width: ref.offsetWidth,
                            height: ref.offsetHeight,
                            ...position
                          })
                        }
                      >
                        <div
                          style={{
                            fontSize: '30px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: '100%',
                            height: '100%',
                            cursor: 'move',
                            backgroundColor: 'rgba(255, 255, 255, 0.8)'
                          }}
                        >
                          {pos.icon}
                        </div>
                      </Rnd>
                    ))}
                  </div>
                </div>
              )}
            </Col>

            <Form.Item style={{ marginTop: 24 }}>
              <Button type="primary" htmlType="submit" loading={loading}>
                Enregistrer
              </Button>
            </Form.Item>
          </Form>
      </Card>
    </div>
  );
};

export default ReparationImage;
