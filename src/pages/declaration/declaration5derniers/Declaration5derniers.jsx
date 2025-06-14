import { useEffect, useState } from 'react';
import { Table, Input, Menu, notification, Tag, Space, Tooltip, Popconfirm } from 'antd';
import { CalendarOutlined, EnvironmentOutlined, HomeOutlined, FileTextOutlined, ToolOutlined, DollarOutlined, BarcodeOutlined,ScheduleOutlined,PlusCircleOutlined, UserOutlined } from '@ant-design/icons';
import moment from 'moment';
import { getDeclaration5derniers } from '../../../services/templateService';

const { Search } = Input;

const Declaration5derners = ({idDeclarations}) => {
  const [loading, setLoading] = useState(true);
  const [columnsVisibility, setColumnsVisibility] = useState({
    '#': true,
    'Template': true,
    'Desc man': true,
    'Periode': true,
    'M² occupe': true,
    "M² facture": true,
    "Tarif Entr": true,
    'Debours Entr': true,
    'Total Entr': true,
    "TTC Entr": true,
    "Ville": true,
    "Client": true,
    "Bâtiment": true,
    "Objet fact": true,
    "Manutention": true,
    "Tarif Manu": true,
    "Debours Manu": true,
    "Total Manu": true,
    "TTC Manu": true
  });
  const [filteredDatas, setFilteredDatas] = useState(null);
  const [data, setData] = useState([]);
  const scroll = { x: 400 };
  const [idDeclaration, setidDeclaration] = useState('');
  const [modalType, setModalType] = useState(null);
  const [searchValue, setSearchValue] = useState('');

    const fetchData = async () => {
      try {
        const { data } = await getDeclaration5derniers();

        const groupedData = data.reduce((acc, curr) => {
          const found = acc.find(item => item.id_declaration_super === curr.id_declaration_super);
          if(found) {
            found.nom_batiment.push(curr.nom_batiment)
          } else {
            acc.push({
              ...curr,
              nom_batiment: [curr.nom_batiment]
            });
          }
          return acc;
        }, []);

        setData(groupedData);
        setLoading(false);
      } catch (error) {
        notification.error({
          message: 'Erreur de chargement',
          description: 'Une erreur est survenue lors du chargement des données.',
        });
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchData();
  }, [filteredDatas]);

  const handleAddDecl = (idDeclaration) => {
    idDeclarations(idDeclaration)
  };

  const handleDetails = (idDeclaration) => {
    openModal('Detail', idDeclaration);
  }


  const handleUpdateTemplate = (idDeclaration) => {
    openModal('Update', idDeclaration);
  };

  const closeAllModals = () => {
    setModalType(null);
  };
  
  const openModal = (type, idDeclaration = '') => {
    closeAllModals();
    setModalType(type);
    setidDeclaration(idDeclaration);
  };

  const menus = (
    <Menu>
      {Object.keys(columnsVisibility).map(columnName => (
        <Menu.Item key={columnName}>
          <span onClick={(e) => toggleColumnVisibility(columnName,e)}>
            <input type="checkbox" checked={columnsVisibility[columnName]} readOnly />
            <span style={{ marginLeft: 8 }}>{columnName}</span>
          </span>
        </Menu.Item>
      ))}
    </Menu>
  ); 

  const toggleColumnVisibility = (columnName, e) => {
    e.stopPropagation();
    setColumnsVisibility(prev => ({
      ...prev,
      [columnName]: !prev[columnName]
    }));
  };
  
  const columns = [
    {
      title: '#',
      dataIndex: 'id',
      key: 'id',
      render: (text, record, index) => index + 1,
      width: "3%",
      ...(columnsVisibility['#'] ? {} : { className: 'hidden-column' }),
    },
    
    // Groupe Entreposage
    {
      title: 'Entreposage',
      children: [
        {
          title: 'Template',
          dataIndex: 'desc_template',
          key: 'desc_template',
          render: (text, record) => (
            <Space onClick={() => handleAddDecl(record.id_declaration_super)}>
              <Tag icon={<FileTextOutlined />} color="geekblue">{text ?? 'Aucun'}</Tag>
            </Space>
          ),
          ...(columnsVisibility['Template'] ? {} : { className: 'hidden-column' }),
        },
        {
          title: 'Periode',
          dataIndex: 'periode',
          key: 'periode',
          sorter: (a, b) => moment(a.periode) - moment(b.periode),
          sortDirections: ['descend', 'ascend'],
          render: (text) => {
            const date = text ? new Date(text) : null;
            const formattedDate = date 
              ? date.toLocaleString('default', { month: 'long', year: 'numeric' })
              : 'Aucun';
            return (
              <Tag icon={<CalendarOutlined />} color="purple">{formattedDate}</Tag>
            );
          },
          ...(columnsVisibility['Periode'] ? {} : { className: 'hidden-column' }),
        },
        {
          title: 'M² occupe',
          dataIndex: 'm2_occupe',
          key: 'm2_occupe',
          render: (text) => (
            <Tag icon={<BarcodeOutlined />} color="cyan">{text ?? 'Aucun'}</Tag>
          ),
          ...(columnsVisibility['M² occupe'] ? {} : { className: 'hidden-column' }),
        },
        {
          title: 'M² facture',
          dataIndex: 'm2_facture',
          key: 'm2_facture',
          render: (text) => (
            <Tag icon={<BarcodeOutlined />} color="cyan">{text ?? 'Aucun'}</Tag>
          ),
          ...(columnsVisibility['M² facture'] ? {} : { className: 'hidden-column' }),
        },
        {
          title: 'Tarif Entr',
          dataIndex: 'tarif_entreposage',
          key: 'tarif_entreposage',
          render: (text) => (
            <Tag icon={<DollarOutlined />} color="green">{text ?? 'Aucun'}</Tag>
          ),
          ...(columnsVisibility['Tarif Entr'] ? {} : { className: 'hidden-column' }),
        },
        {
          title: 'Debours Entr',
          dataIndex: 'debours_entreposage',
          key: 'debours_entreposage',
          render: (text) => (
            <Tag icon={<DollarOutlined />} color="green">{text ?? 'Aucun'}</Tag>
          ),
          ...(columnsVisibility['Debours Entr'] ? {} : { className: 'hidden-column' }),
        },
        {
          title: 'Total Entr',
          dataIndex: 'total_entreposage',
          key: 'total_entreposage',
          render: (text) => (
            <Tag icon={<DollarOutlined />} color="gold">{text ?? 'Aucun'}</Tag>
          ),
          ...(columnsVisibility['Total Entr'] ? {} : { className: 'hidden-column' }),
        },
        {
          title: 'TTC Entr',
          dataIndex: 'ttc_entreposage',
          key: 'ttc_entreposage',
          render: (text) => (
            <Tag icon={<DollarOutlined />} color="volcano">{text ?? 'Aucun'}</Tag>
          ),
          ...(columnsVisibility['TTC Entr'] ? {} : { className: 'hidden-column' }),
        },
      ]
    },
  
    // Groupe Manutention
    {
      title: 'Manutention',
      children: [
        {
          title: 'Desc Man',
          dataIndex: 'desc_manutation',
          key: 'desc_manutation',
          render: (text) => (
            <Tag icon={<FileTextOutlined />} color="geekblue">{text ?? 'Aucun'}</Tag>
          ),
          ...(columnsVisibility['Desc man'] ? {} : { className: 'hidden-column' }),
        },
        {
          title: 'Ville',
          dataIndex: 'capital',
          key: 'capital',
          render: (text) => (
            <Tag icon={<EnvironmentOutlined />} color="blue">{text ?? 'Aucun'}</Tag>
          ),
          ...(columnsVisibility['Ville'] ? {} : { className: 'hidden-column' }),
        },
        {
          title: 'Client',
          dataIndex: 'nom',
          key: 'nom',
          render: (text) => (
            <Tag icon={<UserOutlined />} color="orange">{text ?? 'Aucun'}</Tag>
          ),
          ...(columnsVisibility['Client'] ? {} : { className: 'hidden-column' }),
        },
        {
          title: 'Bâtiment',
          dataIndex: 'nom_batiment',
          key: 'nom_batiment',
          render: (text) => (
            <Tag icon={<HomeOutlined />} color="purple">{text ?? 'Aucun'}</Tag>
          ),
          ...(columnsVisibility['Bâtiment'] ? {} : { className: 'hidden-column' }),
        },
        {
          title: 'Objet fact',
          dataIndex: 'nom_objet_fact',
          key: 'nom_objet_fact',
          render: (text) => (
            <Tag icon={<FileTextOutlined />} color="magenta">{text ?? 'Aucun'}</Tag>
          ),
          ...(columnsVisibility['Objet fact'] ? {} : { className: 'hidden-column' }),
        },
        {
          title: 'Manutention',
          dataIndex: 'manutation',
          key: 'manutation',
          render: (text) => (
            <Tag icon={<ToolOutlined />} color="cyan">{text ?? 'Aucun'}</Tag>
          ),
          ...(columnsVisibility['Manutention'] ? {} : { className: 'hidden-column' }),
        },
        {
          title: 'Tarif Manu',
          dataIndex: 'tarif_manutation',
          key: 'tarif_manutation',
          render: (text) => (
            <Tag icon={<DollarOutlined />} color="green">{text ?? 'Aucun'}</Tag>
          ),
          ...(columnsVisibility['Tarif Manu'] ? {} : { className: 'hidden-column' }),
        },
        {
          title: 'Debours Manu',
          dataIndex: 'debours_manutation',
          key: 'debours_manutation',
          render: (text) => (
            <Tag icon={<DollarOutlined />} color="green">{text ?? 'Aucun'}</Tag>
          ),
          ...(columnsVisibility['Debours Manu'] ? {} : { className: 'hidden-column' }),
        },
        {
          title: 'Total Manu',
          dataIndex: 'total_manutation',
          key: 'total_manutation',
          render: (text) => (
            <Tag icon={<DollarOutlined />} color="gold">{text ?? 'Aucun'}</Tag>
          ),
          ...(columnsVisibility['Total Manu'] ? {} : { className: 'hidden-column' }),
        },
        {
          title: 'TTC Manu',
          dataIndex: 'ttc_manutation',
          key: 'ttc_manutation',
          render: (text) => (
            <Tag icon={<DollarOutlined />} color="volcano">{text ?? 'Aucun'}</Tag>
          ),
          ...(columnsVisibility['TTC Manu'] ? {} : { className: 'hidden-column' }),
        },
      ]
    }
  ];
  
  return (
    <>
        <div>
            <div className="row-title">
                <h2 className="table-title">5 dernières declarations</h2>
                <div>

                </div>
            </div>
            <Table
                columns={columns}
                dataSource={data}
                loading={loading}
                rowClassName={(record, index) => (index % 2 === 0 ? 'odd-row' : 'even-row')}
                pagination={{ pageSize: 8 }}
                rowKey="id"
                bordered
                size="middle"
                scroll={scroll}
            /> 
        </div>
    </>
  );
};

export default Declaration5derners;