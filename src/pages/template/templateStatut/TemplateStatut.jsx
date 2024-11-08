import React, { useState } from 'react';
import { Tag, message } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import axios from 'axios';
import { putTemplateStatus } from '../../../services/templateService';


export const StatutColumn = ({ initialStatus, id }) => {
    const [status, setStatus] = useState(initialStatus);
  
    // Fonction pour modifier le statut dans la base de données
    const updateStatus = async (newStatus) => {
      try {
        await putTemplateStatus(id, newStatus)
        message.success('Statut mis à jour avec succès');
      } catch (error) {
        message.error('Erreur lors de la mise à jour du statut');
      }
    };
  
    // Fonction de gestion du double-clic
    const handleDoubleClick = () => {
      const newStatus = status === 1 ? 2 : 1;
      setStatus(newStatus);
      updateStatus(newStatus); // Mettre à jour dans la base de données
    };
  
    return (
      <Tag
        color={status === 1 ? 'green' : 'red'}
        icon={status === 1 ? <CheckCircleOutlined style={{ color: 'green' }} /> : <CloseCircleOutlined style={{ color: 'red' }} />}
        onDoubleClick={handleDoubleClick}
        style={{ cursor: 'pointer' }}
      >
        {status === 1 ? 'Activé' : 'Désactivé'}
      </Tag>
    );
  };