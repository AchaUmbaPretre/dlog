import React, { useEffect, useState } from 'react';
import { Table, Input, notification, Space, Tag } from 'antd';
import { TagsOutlined, ScheduleOutlined } from '@ant-design/icons';
import { getSearch } from '../../services/tacheService';

const { Search } = Input;

const Tags = () => {
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [results, setResults] = useState({
    projects: [],
    tasks: [],
  });

  const scroll = { x: 400 };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data } = await getSearch(searchValue);
        setResults(data);
        setLoading(false);
      } catch (error) {
        notification.error({
          message: 'Erreur de chargement',
          description: 'Une erreur est survenue lors du chargement des données.',
        });
        setLoading(false);
      }
    };

    if (searchValue) {
      fetchData();
    }
  }, [searchValue]);

  const columnsProjects = [
    { 
      title: '#', 
      dataIndex: 'id_projet', 
      key: 'id_projet', 
      render: (text, record, index) => index + 1, 
      width: "3%" 
    },
    { 
      title: 'Nom du projet', 
      dataIndex: 'nom_projet', 
      key: 'nom_projet',
    },
  ];

  const columnsTasks = [
    { 
      title: '#', 
      dataIndex: 'id_tache', 
      key: 'id_tache', 
      render: (text, record, index) => index + 1, 
      width: "3%" 
    },
    { 
      title: 'Tâche', 
      dataIndex: 'nom_tache', 
      key: 'nom_tache',
      render: text => (
        <Space>
          <Tag icon={<ScheduleOutlined />} color='cyan'>{text}</Tag>
        </Space>
      ),
    },
  ];

  return (
    <>
      <div className="client">
        <div className="client-wrapper">
          <div className="client-row">
            <div className="client-row-icon">
              <TagsOutlined className='client-icon'/>
            </div>
            <h2 className="client-h2">Recherche par Tags</h2>
          </div>
          <div className="client-actions">
            <div className="client-row-left">
              <Search 
                placeholder="Recherche..." 
                enterButton 
                onSearch={(value) => setSearchValue(value)}
              />
            </div>
          </div>
          <h3>Projets</h3>
          <Table
            columns={columnsProjects}
            dataSource={results.projects}
            pagination={{ pageSize: 15 }}
            rowKey="id_projet"
            bordered
            size="middle"
            scroll={scroll}
            loading={loading}
          />
          <h3>Tâches</h3>
          <Table
            columns={columnsTasks}
            dataSource={results.tasks}
            pagination={{ pageSize: 15 }}
            rowKey="id_tache"
            bordered
            size="middle"
            scroll={scroll}
            loading={loading}
          />
        </div>
      </div>
    </>
  );
};

export default Tags;
