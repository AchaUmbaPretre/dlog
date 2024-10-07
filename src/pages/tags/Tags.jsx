import React, { useEffect, useState } from 'react';
import { Input, message, Modal, notification, Table, Tag, Typography } from 'antd';
import { getSearch } from '../../services/tacheService';
import DetailTacheGlobalOne from '../taches/detailTacheGlobalOne/DetailTacheGlobalOne';
import DetailProjetsGlobal from '../projet/detailProjet/DetailProjetsGlobal';
import DetailOffre from '../offres/detailOffre/DetailOffre';
import {
    TagsOutlined,
    FileTextOutlined
  } from '@ant-design/icons';

const { Search } = Input;
const { Text } = Typography;

const Tags = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [idTache, setIdTache] = useState('');
  const [modalType, setModalType] = useState(null);

  const closeAllModals = () => {
    setModalType(null);
  };

  const openModal = (type, idTache = '') => {
    closeAllModals();
    setIdTache(idTache);
    setModalType(type);
  };

  const handleAllDetails = (idTache, type) => {
    const modalTypes = {
        tache: 'tache',
        projet: 'projet',
        offres: 'offres',
    };

    const modalType = modalTypes[type];

    if (modalType) {
        openModal(modalType, idTache);
    } else {
        message.info(`Type de modal non reconnu: ${type}`);
    }
};

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await getSearch(searchValue);
        setResults(response.data);
      } catch (error) {
        notification.error({
          message: 'Erreur de chargement',
          description: 'Une erreur est survenue lors du chargement des données.',
        });
      } finally {
        setLoading(false);
      }
    };

    if (searchValue) {
      fetchData(); // N'appelle fetchData que si searchValue n'est pas vide
    } else {
      setResults([]); // Réinitialiser les résultats si la recherche est vide
    }
  }, [searchValue]);

  const columnStyles = {
    title: {
      maxWidth: '220px',
      whiteSpace: 'nowrap',
      overflowX: 'scroll', 
      overflowY: 'hidden',
      textOverflow: 'ellipsis',
      scrollbarWidth: 'none',
      '-ms-overflow-style': 'none', 
    },
    hideScroll: {
      '&::-webkit-scrollbar': {
        display: 'none',
      },
    },
  };

  const columns = [
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: text => (
        <Tag icon={<FileTextOutlined />} color='cyan'>{text}</Tag>
      )
    },
    {
      title: 'Nom',
      dataIndex: 'nom',
      key: 'nom',
      render: (text, record) => <Text onClick={() => handleAllDetails(record.id, record.type)}>{highlightText(text)}</Text>,
      width: '250px'
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (text, record) => <Text onClick={() => handleAllDetails(record.id, record.type)}>{highlightText(text)}</Text>,
    },
  ];

  const highlightText = (text) => {
    // Vérifiez si le texte est défini et est une chaîne de caractères
    if (!text || typeof text !== 'string') return text; // Ne pas surligner si le texte est vide ou non valide
  
    if (!searchValue) return text; // Ne pas surligner si la recherche est vide
  
    const regex = new RegExp(`(${searchValue})`, 'gi'); // Crée une expression régulière pour le terme de recherche
    const parts = text.split(regex); // Divise le texte en parties
    return parts.map((part, index) => 
      regex.test(part) ? (
        <Text key={index} style={{ backgroundColor: 'yellow' }}>{part}</Text>
      ) : (
        part
      )
    );
  };
  

  return (
    <>
        <div className="client">
            <div className="client-wrapper">
                <div className="client-row">
                    <div className="client-row-icon">
                        <TagsOutlined className='client-icon'/>
                    </div>
                    <h2 className="client-h2">Tags</h2>
                </div>
                <div className="client-actions">
                    <div className="client-row-left">
                        <Search
                            placeholder="Rechercher..."
                            onChange={(e) => setSearchValue(e.target.value)} 
                            style={{ marginBottom: 20 }}
                        />
                    </div>
                </div>
                <Table
                    dataSource={results}
                    columns={columns}
                    rowKey="id_tache" // Assurez-vous que le champ de la clé primaire correspond à votre structure
                    loading={loading}
                    pagination={false}
                />
            </div>
        </div>

    <Modal
        title=""
        visible={modalType === 'tache'}
        onCancel={closeAllModals}
        footer={null}
        width={1050}
        centered
      >
        <DetailTacheGlobalOne initialIdTache={idTache} />
      </Modal>

      <Modal
        title=""
        visible={modalType === 'projet'}
        onCancel={closeAllModals}
        footer={null}
        width={1050}
        centered
      >
        <DetailProjetsGlobal idProjet={idTache} />
      </Modal>

      <Modal
        title=""
        visible={modalType === 'offres'}
        onCancel={closeAllModals}
        footer={null}
        width={700}
        centered
      >
        <DetailOffre idOffre={idTache}/>
      </Modal>
    </>
    
  );
};

export default Tags;
