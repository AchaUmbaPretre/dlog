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
import { getRetardToday } from '../../../../services/presenceService';
import UserAvatarProfile from '../../../../utils/UserAvatarProfile';

const { Search } = Input;

const RetardDashboard = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [stats, setStats] = useState(null);
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
      title: <span><FieldTimeOutlined /> Retard</span>,
      key: 'retard',
      width: 150,
      render: (_, record) => {
        const minutes = record.retard_minutes;
        const heures = Math.floor(minutes / 60);
        const mins = minutes % 60;
        
        return (
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            backgroundColor: record.couleur_retard || '#f5222d',
            color: 'white',
            padding: '4px 12px',
            borderRadius: '20px',
            fontWeight: '600',
            fontSize: '14px'
          }}>
            <WarningOutlined />
            {heures > 0 ? `${heures}h ${mins}min` : `${mins} min`}
          </span>
        );
      },
      sorter: (a, b) => a.retard_minutes - b.retard_minutes,
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
    },
    {
      title: <span><FieldTimeOutlined /> Heure entrée</span>,
      dataIndex: 'heure_entree',
      key: 'heure_entree',
      render: (heure) => heure || 'Non pointé',
    }
  ];

  const fetchData = useCallback(async () => {
    setLoading(true);

    try {
      const response = await getRetardToday();
      
      // Assignation correcte des données
      if (response?.data?.retards) {
        setData(response.data.retards);
        setStats(response.data.stats);
      } else if (response?.retards) {
        setData(response.retards);
        setStats(response.stats);
      } else if (Array.isArray(response)) {
        setData(response);
      } else {
        console.error('Format de données inattendu:', response);
        setData([]);
      }
      
    } catch (error) {
      console.error('Erreur fetch retard:', error);
      notification.error({
        message: 'Erreur de chargement',
        description: error?.response?.data?.message || error?.message || 'Impossible de charger la liste des retards.',
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
        `${item.prenom} ${item.nom}`.toLowerCase().includes(searchValue.toLowerCase()) ||
        item.email?.toLowerCase().includes(searchValue.toLowerCase())
      )
    : data;

  const handlePrint = () => {
    window.print();
  };

  // Calcul des statistiques pour l'affichage
  const totalMinutes = data.reduce((acc, curr) => acc + curr.retard_minutes, 0);
  const moyenne = data.length > 0 ? Math.round(totalMinutes / data.length) : 0;

  return (
    <div className="client">
      <div className="client-wrapper">
        <div className="client-row">
          <h2 className="client-h2">
            <FieldTimeOutlined style={{ marginRight: '10px' }} />
            Liste des retards - {new Date().toLocaleDateString('fr-FR', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </h2>
          {data.length > 0 && (
            <span className="client-badge" style={{ backgroundColor: '#f5222d' }}>
              <WarningOutlined style={{ marginRight: '5px' }} />
              {data.length} retard{data.length > 1 ? 's' : ''}
            </span>
          )}
        </div>

        {/* Statistiques rapides */}
        {data.length > 0 && (
          <div style={{ 
            display: 'flex', 
            gap: '20px', 
            marginBottom: '20px',
            padding: '15px',
            background: '#f5f5f5',
            borderRadius: '8px',
            flexWrap: 'wrap'
          }}>
            <div style={{ flex: 1, minWidth: '200px' }}>
              <span style={{ color: '#666', fontSize: '12px' }}>TOTAL MINUTES</span>
              <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
                {totalMinutes} min
              </div>
            </div>
            <div style={{ flex: 1, minWidth: '200px' }}>
              <span style={{ color: '#666', fontSize: '12px' }}>MOYENNE</span>
              <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
                {Math.floor(moyenne / 60)}h {moyenne % 60}min
              </div>
            </div>
            {stats?.retard_max && (
              <div style={{ flex: 1, minWidth: '200px' }}>
                <span style={{ color: '#666', fontSize: '12px' }}>RETARD MAX</span>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f5222d' }}>
                  {Math.floor(stats.retard_max / 60)}h {stats.retard_max % 60}min
                </div>
              </div>
            )}
          </div>
        )}

        <div className="client-actions">
          <div className="client-row-left">
            <Search
              placeholder="Recherche par nom, prénom, email ou site..."
              allowClear
              onChange={(e) => setSearchValue(e.target.value)}
              style={{ width: 400 }}
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
              disabled={data.length === 0}
            >
              Imprimer
            </Button>
          </div>
        </div>

        <Table
          columns={columns}
          dataSource={filteredData}
          loading={loading}
          pagination={{ 
            pageSize: 15,
            showTotal: (total, range) => (
              <span>
                <NumberOutlined style={{ marginRight: '5px' }} />
                {range[0]}-{range[1]} sur {total} retard{total > 1 ? 's' : ''}
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
              <span><FieldTimeOutlined spin /> Chargement des retards...</span>
            ) : (
              <span><CalendarOutlined /> Aucun retard enregistré aujourd'hui</span>
            ),
          }}
        />

        {/* Message si aucun retard */}
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
              Aucun retard aujourd'hui
            </p>
            <p style={{ color: '#52c41a', fontSize: '14px' }}>
              <EnvironmentOutlined style={{ marginRight: '5px' }} />
              Tous les employés sont à l'heure aujourd'hui !
            </p>
            <p style={{ color: '#999', fontSize: '12px', marginTop: '10px' }}>
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

export default RetardDashboard;