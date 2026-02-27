import React, { useCallback, useState, useEffect } from 'react';
import { Table, Button, notification, Input } from 'antd';
import { 
  FieldTimeOutlined, 
  PrinterOutlined,
  UserOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  NumberOutlined,
  WarningOutlined,
  ExclamationCircleOutlined,
  QuestionCircleOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import { getAbsentToday } from '../../../../services/presenceService';
import UserAvatarProfile from '../../../../utils/UserAvatarProfile';
import './absentDashboard.scss'

const { Search } = Input;

const AbsentDashboard = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [scroll] = useState({ x: 900 });

  const columns = [
    {
        title: <span><NumberOutlined /></span>,
        width: 60,
        align: "center",
        render: (_, __, index) => index + 1,
    },
    {
      title: <span><UserOutlined /> Profil</span>,
      key: "profil",
      width: 260,
      render: (_, record) => (
        <UserAvatarProfile
          nom={record.nom}
          prenom={record.prenom}
          email={record.email}
        />
      ),
    },
    {
      title: <span><EnvironmentOutlined /> Site</span>,
      dataIndex: 'nom_site',
      key: 'nom_site',
      filters: [...new Set(data.map(item => item.nom_site))].map(site => ({
        text: site,
        value: site,
      })),
      onFilter: (value, record) => record.nom_site === value,
      render: (site) => (
        <span>
          <EnvironmentOutlined style={{ color: '#52c41a', marginRight: '8px' }} />
          {site}
        </span>
      ),
    },
    {
      title: <span><ExclamationCircleOutlined /> Statut</span>,
      dataIndex: 'statut_jour',
      key: 'statut_jour',
      width: 200,
      render: (statut) => {
        if (statut === 'ABSENT') {
          return (
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              backgroundColor: '#ff4d4f',
              color: 'white',
              padding: '6px 8px',
              borderRadius: '30px',
              fontWeight: '600',
              fontSize: '12px',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              border: '2px solid #ff7875',
              boxShadow: '0 4px 12px rgba(255, 77, 79, 0.5)',
              animation: 'pulseAbsent 2s infinite',
              width: '100%'
            }}>
              <WarningOutlined style={{ fontSize: '16px' }} />
              NON JUSTIFIÉ
            </span>
          );
        } else if (statut === 'ABSENCE_JUSTIFIEE') {
          return (
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              backgroundColor: '#faad14',
              color: 'white',
              padding: '6px 7px',
              borderRadius: '30px',
              fontWeight: '500',
              fontSize: '12px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              border: '2px solid #ffc53d',
              boxShadow: '0 4px 12px rgba(250, 173, 20, 0.3)',
              width: '100%'
            }}>
              <FileTextOutlined style={{ fontSize: '16px' }} />
              JUSTIFIÉ
            </span>
          );
        }
        return (
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            backgroundColor: '#8c8c8c',
            color: 'white',
            padding: '6px 16px',
            borderRadius: '30px',
            fontWeight: '600',
            fontSize: '13px',
            textTransform: 'uppercase',
            width: '100%'
          }}>
            <QuestionCircleOutlined />
            {statut}
          </span>
        );
      },
    },
    {
      title: <span><CalendarOutlined /> Date</span>,
      dataIndex: 'date_presence',
      key: 'date_presence',
      render: (date) => {
        const formattedDate = new Date(date).toLocaleDateString('fr-FR', {
          weekday: 'short',
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        });
        return (
          <span>
            <CalendarOutlined style={{ color: '#1890ff', marginRight: '8px' }} />
            {formattedDate}
          </span>
        );
      },
      sorter: (a, b) => new Date(a.date_presence) - new Date(b.date_presence),
    }
  ];

  const fetchData = useCallback(async () => {
    setLoading(true);

    try {
      const { data } = await getAbsentToday();
      
      if (data?.success && data?.absents) {
        setData(data.absents);
        
        // Notification avec le nombre d'absents
        if (data.count > 0) {
          notification.info({
            message: 'Liste des absents',
            description: `${data.count} absent(s) aujourd'hui (${new Date(data.date).toLocaleDateString('fr-FR')})`,
            duration: 3,
            icon: <WarningOutlined style={{ color: '#faad14' }} />
          });
        }
      } else {
        setData([]);
      }
    } catch (error) {
      console.error('Erreur fetch absent:', error);
      notification.error({
        message: 'Erreur de chargement',
        description: error?.data?.data?.message || error?.message || 'Impossible de charger la liste des absents.',
        icon: <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />
      });
      setData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Filtrage des données basé sur la recherche
  const filteredData = searchValue
    ? data.filter(item => 
        item.nom_site?.toLowerCase().includes(searchValue.toLowerCase()) ||
        `${item.prenom} ${item.nom}`.toLowerCase().includes(searchValue.toLowerCase())
      )
    : data;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="client">
      <div className="client-wrapper">
        <div className="client-row">
          <h2 className="client-h2">
            <FieldTimeOutlined style={{ marginRight: '10px' }} />
            Liste des absents - {new Date().toLocaleDateString('fr-FR', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </h2>
          {data.length > 0 && (
            <span className="client-badge">
              <WarningOutlined style={{ marginRight: '5px' }} />
              {data.length} absent{data.length > 1 ? 's' : ''}
            </span>
          )}
        </div>

        <div className="client-actions">
          <div className="client-row-left">
            <Search
              placeholder="Recherche par nom, prénom ou site..."
              allowClear
              onChange={(e) => setSearchValue(e.target.value)}
              style={{ width: 350 }}
              value={searchValue}
              prefix={<UserOutlined style={{ color: '#bfbfbf' }} />}
            />
          </div>

          <div className="client-rows-right">
            <Button 
              icon={<PrinterOutlined />} 
              onClick={handlePrint}
              type="primary"
              ghost
            >
              Imprimer
            </Button>
          </div>
        </div>

        {/* TABLE */}
        <Table
          columns={columns}
          dataSource={filteredData}
          loading={loading}
          pagination={{ 
            pageSize: 15,
            showTotal: (total, range) => (
              <span>
                <NumberOutlined style={{ marginRight: '5px' }} />
                {range[0]}-{range[1]} sur {total} absent{total > 1 ? 's' : ''}
              </span>
            ),
            showSizeChanger: true,
            pageSizeOptions: ['10', '15', '20', '50'],
            showQuickJumper: true,
          }}
          rowKey="id_presence"
          bordered
          size="middle"
          scroll={scroll}
          rowClassName={(_, index) =>
            index % 2 === 0 ? 'odd-row' : 'even-row'
          }
          locale={{
            emptyText: loading ? (
              <span><FieldTimeOutlined spin /> Chargement...</span>
            ) : (
              <span><CalendarOutlined /> Aucun absent aujourd'hui</span>
            ),
          }}
        />

        {/* Message si aucun absent */}
        {!loading && data.length === 0 && (
          <div style={{ 
            textAlign: 'center', 
            padding: '50px 20px', 
            background: '#fafafa', 
            borderRadius: '8px',
            marginTop: '20px',
            border: '1px dashed #d9d9d9'
          }}>
            <FieldTimeOutlined style={{ fontSize: '48px', color: '#bfbfbf' }} />
            <p style={{ marginTop: '16px', fontSize: '16px', color: '#666' }}>
              <CalendarOutlined style={{ marginRight: '8px', color: '#999' }} />
              Aucun absent aujourd'hui
            </p>
            <p style={{ color: '#999', fontSize: '14px' }}>
              <EnvironmentOutlined style={{ marginRight: '5px' }} />
              {new Date().toLocaleDateString('fr-FR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AbsentDashboard;