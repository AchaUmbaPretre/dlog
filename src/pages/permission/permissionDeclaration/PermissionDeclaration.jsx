import React, { useEffect, useRef, useState } from 'react';
import { Table, Button, Modal, Input, message, Dropdown, Menu, notification, Tag, Space, Tooltip, Popconfirm, Skeleton, Tabs, Popover } from 'antd';
import { MenuOutlined,EditOutlined,InfoCircleOutlined,PieChartOutlined,EyeOutlined, DeleteOutlined, CalendarOutlined,DownOutlined,EnvironmentOutlined, HomeOutlined, FileTextOutlined, DollarOutlined, BarcodeOutlined,ScheduleOutlined,PlusCircleOutlined, UserOutlined } from '@ant-design/icons';
import moment from 'moment';
import getColumnSearchProps from '../../../utils/columnSearchUtils';
import { getDeclaration } from '../../../services/templateService';
import PermissionDeclarationOne from './permissionDeclarationOne/PermissionDeclarationOne';

const { Search } = Input;

const PermissionDeclaration = () => {
    const [searchValue, setSearchValue] = useState('');
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 25,
    });
    const [columnsVisibility, setColumnsVisibility] = useState({
      '#': true,
      'Template': true,
      'Desc man': false,
      'Periode': true,
      'M² occupe': false,
      "M² facture": true,
      "Tarif Entr": true,
      'Debours Entr': false,
      'Total Entr': false,
      "TTC Entr": false,
      "Ville": true,
      "Client": true,
      "Bâtiment": false,
      "Manutention": false,
      "Tarif Manu": false,
      "Total Manu": true,
      "TTC Manu": false,
      "Debours Manu": false
    });
    const [loading, setLoading] = useState(true);
    const [filteredDatas, setFilteredDatas] = useState(null);
    const scroll = { x: 400 };
    const searchInput = useRef(null);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const [data, setData] = useState([]);
    const [clientdetail, setClientDetail] = useState([]);
    const [idDeclaration ,setIdDeclaration] = useState([]);
    const [modalType, setModalType] = useState(null);

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
        titleClient: {
        maxWidth: '150px',
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

    const handleViewDetails = (idDeclaration) => {
        openModal('detail', idDeclaration);
      };

      const closeAllModals = () => {
        setModalType(null);
      };
    
      const openModal = (type, idDeclaration = '') => {
        closeAllModals();
        setModalType(type);
        setIdDeclaration(idDeclaration);
      }; 

  const columns = [
    {
      title: '#',
      dataIndex: 'id',
      key: 'id',
      render: (text, record, index) => {
        const pageSize = pagination.pageSize || 10;
        const pageIndex = pagination.current || 1;
        return (pageIndex - 1) * pageSize + index + 1;
      },
      width: "4%",

      ...(columnsVisibility['#'] ? {} : { className: 'hidden-column' })
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
            <Space style={columnStyles.title} className={columnStyles.hideScroll} >
              <Tag icon={<FileTextOutlined />} color="geekblue">{text ?? 'Aucun'}</Tag>
            </Space>
          ),
          ...(columnsVisibility['Template'] ? {} : { className: 'hidden-column' }),
        },
        {
          title: 'Client',
          dataIndex: 'nom',
          key: 'nom',
          render: (text, record) => (
            <Space style={columnStyles.titleClient} className={columnStyles.hideScroll}>
              <Tag icon={<UserOutlined />} color="orange">
                {text ?? 'Aucun'}
              </Tag>
            </Space>
          ),
          ...(columnsVisibility['Client'] ? {} : { className: 'hidden-column' }),
        },
        {
          title: 'Periode',
          dataIndex: 'periode',
          key: 'periode',
          sorter: (a, b) => moment(a.periode) - moment(b.periode),
          sortDirections: ['descend', 'ascend'],
          render: (text, record) => {
            const date = text ? new Date(text) : null;
            const mois = date ? date.getMonth() + 1 : null; // getMonth() renvoie 0-11, donc +1 pour avoir 1-12
            const annee = date ? date.getFullYear() : null;
            
            const formattedDate = date
              ? date.toLocaleString('default', { month: 'long', year: 'numeric' })
              : 'Aucun';
        
            return (
              <Tag 
                icon={<CalendarOutlined />} 
                color="purple" 
              >
                {formattedDate}
              </Tag>
            );
          },
          ...(columnsVisibility['Periode'] ? {} : { className: 'hidden-column' }),
        },                
        {
          title: 'M² occupe',
          dataIndex: 'm2_occupe',
          key: 'm2_occupe',
          sorter: (a, b) => a.m2_occupe - b.m2_occupe,
          sortDirections: ['descend', 'ascend'],
          render: (text) => (
            <Tag icon={<BarcodeOutlined />} color="cyan">{text ?? '0'}</Tag>
          ),
          align: 'right', 
          ...(columnsVisibility['M² occupe'] ? {} : { className: 'hidden-column' }),
        },
        {
          title: 'M² facture',
          dataIndex: 'm2_facture',
          key: 'm2_facture',
          sorter: (a, b) => a.m2_facture - b.m2_facture,
          sortDirections: ['descend', 'ascend'],
          render: (text) => (
            <Tag icon={<BarcodeOutlined />} color="cyan">{text?.toLocaleString() ?? '0'}</Tag>
          ),
          align: 'right', 
          ...(columnsVisibility['M² facture'] ? {} : { className: 'hidden-column' }),
        },
        {
          title: 'Tarif Entr',
          dataIndex: 'tarif_entreposage',
          key: 'tarif_entreposage',
          sorter: (a, b) => a.tarif_entreposage - b.tarif_entreposage,
          sortDirections: ['descend', 'ascend'],
          render: (text) => (
            <Tag color="green">
              {text
                    ? `${parseFloat(text)
                        .toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                        })
                        .replace(/,/g, " ")} $`
                    : "0.00"}
            </Tag>
          ),
          align: 'right', 
          ...(columnsVisibility['Tarif Entr'] ? {} : { className: 'hidden-column' }),
        },
        {
          title: 'Debours Entr',
          dataIndex: 'debours_entreposage',
          key: 'debours_entreposage',
          sorter: (a, b) => a.debours_entreposage - b.debours_entreposage,
          sortDirections: ['descend', 'ascend'],
          render: (text) => (
            <Tag icon={<DollarOutlined />} color="green">
              {text
                    ? `${parseFloat(text)
                        .toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                        })
                        .replace(/,/g, " ")} $`
                    : "0.00"}
            </Tag>
          ),
          align: 'right', 
          ...(columnsVisibility['Debours Entr'] ? {} : { className: 'hidden-column' }),
        },
        {
          title: 'Total Entr',
          dataIndex: 'total_entreposage',
          key: 'total_entreposage',
          sorter: (a, b) => a.total_entreposage - b.total_entreposage,
          sortDirections: ['descend', 'ascend'],
          render: (text) => (
            <Tag color="gold">
              {text
                    ? `${parseFloat(text)
                        .toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                        })
                        .replace(/,/g, " ")} $`
                    : "0.00"}
            </Tag>
          ),
          align: 'right', 
          ...(columnsVisibility['Total Entr'] ? {} : { className: 'hidden-column' }),
        },
        {
          title: 'TTC Entr',
          dataIndex: 'ttc_entreposage',
          key: 'ttc_entreposage',
          sorter: (a, b) => a.ttc_entreposage - b.ttc_entreposage,
          sortDirections: ['descend', 'ascend'],
          render: (text) => (
            <Tag color="volcano">
              {text
                    ? `${parseFloat(text)
                        .toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                        })
                        .replace(/,/g, " ")} $`
                    : "0.00"}
            </Tag>
          ),
          align: 'right', 
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
          ...getColumnSearchProps(
            'capital',
            searchText,
            setSearchText,
            setSearchedColumn,
            searchInput
          ),
          render: (text) => (
            <Tag icon={<EnvironmentOutlined />} color="blue">{text ?? 'Aucun'}</Tag>
          ),
          ...(columnsVisibility['Ville'] ? {} : { className: 'hidden-column' }),
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
          title: 'Manu.',
          dataIndex: 'manutation',
          key: 'manutation',
          sorter: (a, b) => a.manutation - b.manutation,
          sortDirections: ['descend', 'ascend'],
          render: (text) => (
            <Tag color="cyan">
              {text
                    ? `${parseFloat(text)
                        .toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                        })
                        .replace(/,/g, " ")} $`
                    : "0.00"}
            </Tag>
          ),
          align: 'right', 
          ...(columnsVisibility['Manutention'] ? {} : { className: 'hidden-column' }),
        },
        {
          title: 'Tarif Manu',
          dataIndex: 'tarif_manutation',
          key: 'tarif_manutation',
          sorter: (a, b) => a.tarif_manutation - b.tarif_manutation,
          sortDirections: ['descend', 'ascend'],
          render: (text) => (
            <Tag color="green">
              {text
                    ? `${parseFloat(text)
                        .toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                        })
                        .replace(/,/g, " ")} $`
                    : "0.00"}
            </Tag>
          ),
          align: 'right', 
          ...(columnsVisibility['Tarif Manu'] ? {} : { className: 'hidden-column' }),
        },
        {
          title: 'Debours Manu',
          dataIndex: 'debours_manutation',
          key: 'debours_manutation',
          sorter: (a, b) => a.debours_manutation - b.debours_manutation,
          sortDirections: ['descend', 'ascend'],
          render: (text) => (
            <Tag icon={<DollarOutlined />} color="green">
              {text
                    ? `${parseFloat(text)
                        .toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                        })
                        .replace(/,/g, " ")} $`
                    : "0.00"}
            </Tag>
          ),
          align: 'right', 
          ...(columnsVisibility['Debours Manu'] ? {} : { className: 'hidden-column' }),
        },
        {
          title: 'Total Manu',
          dataIndex: 'total_manutation',
          key: 'total_manutation',
          sorter: (a, b) => a.total_manutation - b.total_manutation,
          sortDirections: ['descend', 'ascend'],
          render: (text) => (
            <Tag color="gold">
              {text
                    ? `${parseFloat(text)
                        .toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                        })
                        .replace(/,/g, " ")} $`
                    : "0.00"}
            </Tag>
          ),
          align: 'right',
          ...(columnsVisibility['Total Manu'] ? {} : { className: 'hidden-column' }),
        },
        {
          title: 'TTC Manu',
          dataIndex: 'ttc_manutation',
          key: 'ttc_manutation',
          sorter: (a, b) => a.ttc_manutation - b.ttc_manutation,
          sortDirections: ['descend', 'ascend'],
          render: (text) => (
            <Tag color="volcano">
              {text
                    ? `${parseFloat(text)
                        .toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                        })
                        .replace(/,/g, " ")} $`
                    : "0.00"}
            </Tag>
          ),
          align: 'right', 
          ...(columnsVisibility['TTC Manu'] ? {} : { className: 'hidden-column' }),
        },
      ]
    },
    {
      title: 'Action',
      key: 'action',
      width: '10%',
       render: (text, record) => (
        <Space size="middle">
            <Tooltip title="Voir les détails">
              <Button
                icon={<InfoCircleOutlined />}
                onClick={() => handleViewDetails(record.id_declaration_super)}
                aria-label="Voir les détails de la tâche"
                style={{ color: 'blue' }}
              />
            </Tooltip>
        </Space>
      ),
    },
  ];

    const fetchData = async () => {
      try {
        const { data } = await getDeclaration(filteredDatas, searchValue);
  
        const uniqueClients = [
          ...new Set(data.declarations.map((declaration) => declaration.nom)),
        ];
      
        const uniqueDetail = uniqueClients.map((nom_client) => ({ nom_client }));
    
        setData(data.declarations);
        setClientDetail(uniqueDetail)
  
        setLoading(false);
      } catch (error) {
          if (error.response && error.response.status === 404) {
              // Gérer l'erreur 404
              notification.error({
                  message: 'Erreur',
                  description: `${error.response.data.message}`,
              });
          } else {
              notification.error({
                  message: 'Erreur',
                  description: 'Une erreur est survenue lors de la récupération des données.',
              });
          }
          setLoading(false);
        }
    };

        useEffect(() => {
          fetchData();
        }, [searchValue]);

  const toggleColumnVisibility = (columnName, e) => {
    e.stopPropagation();
    setColumnsVisibility(prev => ({
      ...prev,
      [columnName]: !prev[columnName]
    }));
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
    const filteredData = data.filter(item =>
        item.desc_template?.toLowerCase().includes(searchValue.toLowerCase()) || 
        item.nom?.toLowerCase().includes(searchValue.toLowerCase()));
        
  return (
    <>
        <div className="client">
            <div className="client-wrapper">
            <div className="client-actions">
                  <div className="client-row-left">
                    <Search 
                      placeholder="Recherche..." 
                      enterButton
                      onChange={(e) => setSearchValue(e.target.value)}
                    />
                  </div>

                  <div className="client-rows-right">

                    <Dropdown overlay={menus} trigger={['click']}>
                      <Button icon={<MenuOutlined />} className="ant-dropdown-link">
                        Colonnes <DownOutlined />
                      </Button>
                    </Dropdown>

                  </div>
                </div>
            <Table
                  columns={columns}
                  dataSource={filteredData}
                  loading={loading}
                  pagination={pagination}
                  onChange={(pagination) => setPagination(pagination)}
                  rowClassName={(record, index) => (index % 2 === 0 ? 'odd-row' : 'even-row')}
                  rowKey="id"
                  bordered
                  size="small"
                  scroll={scroll}
                />
            </div>
        </div>

        <Modal
            title=""
            visible={modalType === 'detail'}
            onCancel={closeAllModals}
            footer={null}
            width={1070}
            centered
        >
            <PermissionDeclarationOne idDeclaration={idDeclaration}/>
        </Modal>
    </>
  )
}

export default PermissionDeclaration