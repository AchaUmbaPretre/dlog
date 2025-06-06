import { useEffect, useState } from 'react';
import { ExportOutlined,MoreOutlined, CalendarOutlined, BarsOutlined,CheckSquareOutlined,SolutionOutlined,RocketOutlined,HourglassOutlined,WarningOutlined,CheckCircleOutlined,ClockCircleOutlined,InfoCircleOutlined, FileTextOutlined, DollarOutlined,PlusCircleOutlined,UserOutlined, PrinterOutlined, EditOutlined, EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import { Table, Button, Modal, Input, message, Dropdown, Menu, notification, Space, Tooltip, Popconfirm, Tag, Form, Popover } from 'antd';
import moment from 'moment';
import 'moment/locale/fr';
import { statusIcons } from '../../../utils/prioriteIcons';

const PermissionProjet = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 15,
    });
    const scroll = { x: 400 };

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
          title: '#',
          dataIndex: 'id',
          key: 'id',
          render: (text, record, index) => {
            const pageSize = pagination.pageSize || 10;
            const pageIndex = pagination.current || 1;
            return (pageIndex - 1) * pageSize + index + 1;
          },
          width: "4%"
        },
        {
          title: 'Client',
          dataIndex: 'nom',
          key: 'nom',
          render: (text) => (
            <Tag icon={<UserOutlined />} color="green">{text ?? 'Aucun'}</Tag>
          ),
        },
        { 
          title: 'Titre', 
          dataIndex: 'nom_projet', 
          key: 'nom_projet',
          render: (text, record) => (
            <Space style={columnStyles.title} className={columnStyles.hideScroll}>
              <Tag onClick={() => handleViewDetails(record.id_projet)} icon={<FileTextOutlined />} color='cyan'>{text}</Tag>
            </Space>
          ),
        },
        { 
          title: 'Chef projet ',
          dataIndex: 'responsable', 
          key: 'responsable',
          render: text => (
            <Tag icon={<UserOutlined />} color='purple'>{text}</Tag>
          ),
        },
        { 
          title: 'Statut', 
          dataIndex: 'nom_type_statut', 
          key: 'nom_type_statut',
          render: text => {
            const { icon, color } = statusIcons[text] || {};
            return (
              <Space>
                <Tag icon={icon} color={color}>{text}</Tag>
              </Space>
            );
          }
        },
        { 
          title: 'Budget', 
          dataIndex: 'montant', 
          key: 'montant',
          render: text => (
            <Space>
              <Tag icon={<DollarOutlined />}  color='purple'>
                {text} $
              </Tag>
            </Space>
          ),
        },
        {
          title: 'Date création',
          dataIndex: 'date_creation',
          key: 'date_creation',
            sorter: (a, b) => moment(a.date_creation) - moment(b.date_creation),
            sortDirections: ['descend', 'ascend'],
            render: (text,record) => 
              <Tag icon={<CalendarOutlined />} color="blue">
                {moment(text).format('DD-MM-yyyy')}
              </Tag>,
        
        },
        {
          title: 'Action',
          key: 'action',
          width: '10%',
          render: (text, record) => (
              <Space>
                <Tooltip title="Voir détails">
                  <Button
                    icon={<EyeOutlined />}
                    onClick={() => handleViewDetails(record.id_projet)}
                    aria-label="View budget details"
                    style={{ color: 'blue' }}
                />
                </Tooltip>
              </Space>
            
          ),
        },
      ];

    const  handleViewDetails = () => {

    }

  return (
    <div>PermissionProjet</div>
  )
}

export default PermissionProjet