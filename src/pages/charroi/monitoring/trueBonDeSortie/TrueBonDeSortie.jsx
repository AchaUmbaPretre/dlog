import React, { useState } from 'react'
import { ExportOutlined, MenuOutlined, DownOutlined } from '@ant-design/icons';
import { Input, Table, Dropdown, Menu, Button } from 'antd';
import { useBonTrueColumns } from './hooks/useBonTrueColumns';
import { useBonTrueData } from './hooks/useBonTrueData';
import { useSelector } from 'react-redux';

const { Search } = Input;

const TrueBonDeSortie = () => {
    const userId = useSelector((state) => state.user?.currentUser?.id_utilisateur);
    const scroll = { x: 'max-content' };
    const [searchValue, setSearchValue] = useState('');
    const [pagination, setPagination] = useState({
      current: 1,
      pageSize: 15,
    });
    const [columnsVisibility, setColumnsVisibility] = useState({
        "#" : true,
        "Service" : false,
        "Chauffeur" : true,
        "Destination" : true,
        "Retour effectif" : true,
        "Depart" : true,
        "Véhicule" : true,
        "Immatriculation": true,
        "Marque" : false,
        "Preuve" : false,
        "Retour" : false,
        "Statut" : true,
        "Client" : false,
        "Demandeur" : true,
        "Agent" : false,
        "Créé par" : false
    });
    const { data,
            loading,
            fetchData } = useBonTrueData(userId)

    const columnStyles = {
      title: {
        maxWidth: '160px',
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

    const columns =  useBonTrueColumns({
        pagination, 
        columnsVisibility, 
        columnStyles
    });

    const filteredData = data.filter(item =>
      item.nom?.toLowerCase().includes(searchValue.toLowerCase()) || 
      item.nom_cat?.toLowerCase().includes(searchValue.toLowerCase()) || 
      item.nom_destination?.toLowerCase().includes(searchValue.toLowerCase()) || 
      item.immatriculation?.toLowerCase().includes(searchValue.toLowerCase())
    );
  return (
    <div className="client">
        <div className="client-wrapper">
            <div className="client-row">
              <div className="client-row-icon">
                <ExportOutlined className='client-icon' style={{color:'blue'}} />
              </div>
              <h2 className="client-h2"> Tableau des bons de sortie</h2>
            </div>

            <div className="client-actions">
                <div className="client-row-left">
                    <Search 
                    placeholder="Recherche..." 
                    enterButton 
                    onChange={(e) => setSearchValue(e.target.value)}
                    />
              </div>

                <Dropdown overlay={menus} trigger={['click']}>
                    <Button icon={<MenuOutlined />} className="ant-dropdown-link">
                        Colonnes <DownOutlined />
                    </Button>
                </Dropdown>
            </div>

            <Table
              columns={columns}
              dataSource={filteredData}
              pagination={pagination}
              onChange={(pagination) => setPagination(pagination)}
              rowKey="id"
              loading={loading}
              bordered
              size="small"
              scroll={scroll}
              rowClassName={(record, index) => (index % 2 === 0 ? 'odd-row' : 'even-row')}
            />
        </div>
    </div>
  )
}

export default TrueBonDeSortie