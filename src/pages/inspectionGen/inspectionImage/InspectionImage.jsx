import { useState } from 'react';
import { Form, Card, Col, Upload, message, notification, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { icons } from '../../../utils/prioriteIcons';
import { Rnd } from 'react-rnd';
import { putInspectionGenImage } from '../../../services/charroiService';
import { useSelector } from 'react-redux';
import html2canvas from 'html2canvas';

const InspectionImage = ({ closeModal, fetchData, subInspectionId, vehicule }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const [iconPositionsMap, setIconPositionsMap] = useState({ image: [] }); // keyed by field name "image"
  const userId = useSelector((state) => state.user?.currentUser?.id_utilisateur);

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
      formData.append('id_sub_inspection_gen', subInspectionId);
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
  
      await putInspectionGenImage(formData);
  
      notification.success({
        message: "Succès",
        description: "Image et icônes enregistrées avec succès."
      });
  
      form.resetFields();
      setPreviewImage(null);
      setFileList([]);
      fetchData();
      closeModal();
  
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
        <div className="controle_wrapper" style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <Form form={form} layout="vertical" onFinish={onFinish}>
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
                      <UploadOutlined style={{margin:'0'}} />
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
        </div>
      </Card>
    </div>
  );
};

export default InspectionImage;
