import { useEffect, useState, useCallback, useMemo } from 'react';
import { Input, Button, Table, Select, Card, Space, Typography, notification } from 'antd';
import moment from 'moment';
import { usePresenceAllData } from './hooks/usePresenceAllData';

const { Search } = Input;
const { Text } = Typography;

const PresenceAll = () => {
  const [searchValue, setSearchValue] = useState('');
  const { presences, sites, loading, reload, setSiteData } = usePresenceAllData()
  const scroll = { x: 700 };

const columns = useMemo(
  () => [
    {
      title: '#',
      width: 60,
      align: 'center',
      render: (_, __, index) => index + 1
    },
    {
      title: 'Nom',
      dataIndex: 'nom',
      key: 'nom',
      render: (text) => <Text strong>{text}</Text>
    },
    {
      title: 'Site',
      dataIndex: 'nom_site',
      key: 'nom_site',
      render: (text) => <Text>{text ?? 'N/A'}</Text>
    },
    {
      title: 'Statut',
      dataIndex: 'statut_jour',
      key: 'statut_jour',
      render: (text) => <Text>{text ?? 'N/A'}</Text>
    },
    {
      title: 'Date',
      dataIndex: 'date_presence',
      key: 'date_presence',
      render: (date) =>
        date
          ? moment(date).format('DD-MM-YYYY')
          : <Text type="secondary">—</Text>
    },
    {
        title: 'Heure entrée',
        dataIndex: 'heure_entree',
        key: 'heure_entree',
        render: (time) =>
            time
            ? moment(time).format('HH:mm')
            : <Text type="secondary">—</Text>
    },
    {
    title: 'Heure sortie',
    dataIndex: 'heure_sortie',
    key: 'heure_sortie',
    render: (time) =>
        time
        ? moment(time).format('HH:mm')
        : <Text type="secondary">—</Text>
    }
  ],
  []
);


  const filteredData = useMemo(() => {
    if (!searchValue) return presences;
    return presences.filter(item =>
      item.nom?.toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [presences, searchValue]);

  return (
    <>
        <Card
            bordered={false}
            title="Liste des présences"
            extra={
                <Space wrap>
                    <Select
                        size='midlle'
                        allowClear
                        showSearch
                        options={sites?.map((item) => ({
                        value: item.id_site,
                        label: item.nom_site,
                        }))}
                        onChange={setSiteData}
                        placeholder="Sélectionnez un site..."
                        optionFilterProp="label"
                        style={{width:'100%'}}
                    />
                    
                    <Search
                        placeholder="Recherche utilisateur"
                        allowClear
                        onChange={e => setSearchValue(e.target.value)}
                        style={{ width: 250 }}
                    />
                </Space>
            }
        >
            <Table
                columns={columns}
                dataSource={filteredData}
                loading={loading}
                pagination={{ pageSize: 15 }}
                rowKey="id_terminal"
                bordered
                size="middle"
                scroll={scroll}
                rowClassName={(_, index) =>
                index % 2 === 0 ? 'odd-row' : 'even-row'
                }
            />
    </Card>
    </>
  );
};

export default PresenceAll;
