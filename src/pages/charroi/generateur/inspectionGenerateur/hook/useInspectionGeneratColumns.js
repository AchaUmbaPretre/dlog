import { useMemo } from "react"
import { Button, Menu, Tooltip, Tag, Space, Dropdown } from 'antd';
import moment from "moment";
import { formatNumber } from "../../../../../utils/formatNumber";
import { getInspectionIcon, statusIcons } from "../../../../../utils/prioriteIcons";
import { TagsOutlined, FileSearchOutlined, EditOutlined, PlusOutlined, CloseCircleOutlined, ToolOutlined, MenuOutlined, DownOutlined, EyeOutlined, FileTextOutlined, MoreOutlined, CalendarOutlined } from '@ant-design/icons'

  const columnStyles = {
        title: {
          maxWidth: '220px',
          whiteSpace: 'nowrap',
          overflowX: 'scroll', 
          scrollbarWidth: 'none',
          '-ms-overflow-style': 'none', 
        },
        hideScroll: {
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
  };

export const useInspectionGeneratColumns = ({
  pagination,
  columnsVisibility,
  openModal,
  onEdit,
  onDetail,
  onDelete,
}) => {
    const getActionMenu = (record) => {
        const handleClick = ({ key }) => {
            switch (key) {
                case 'voirDetail' :
                    openModal('detail', record.id_inspection_generateur)
                    break;
                case 'validerInspe' :
                    openModal('valider', record.id_inspection_generateur)
                    break;
                default:
                    break;
            }
        };

        return (
            <Menu onClick={handleClick}>
                <Menu.SubMenu
                    key="inspection"
                    title={
                        <>
                            <FileTextOutlined style={{ color: '#1890ff' }} /> Inspection
                        </>
                    }
                >
                    <Menu.Item key="voirDetail">
                        <EyeOutlined style={{ color: 'green' }} /> Voir Détail
                    </Menu.Item>
                    <Menu.Item key="validerInspe">
                        <PlusOutlined style={{ color: 'orange' }} /> Valider
                    </Menu.Item>
                </Menu.SubMenu>
                <Menu.Divider />
                <Menu.SubMenu
                    key="tracking"
                    title={
                        <>
                            <FileSearchOutlined style={{ color: 'green' }} /> Tracking
                        </>
                    }
                >
                    <Menu.Item key="DetailSuivi">
                        <EyeOutlined style={{ color: 'green' }} /> Voir Détail
                    </Menu.Item>
                    <Menu.Item key="ajouterSuivi">
                        <PlusOutlined style={{ color: 'orange' }} /> Ajouter
                    </Menu.Item>
                </Menu.SubMenu>
                <Menu.Divider />
                <Menu.Item key="reparer">
                    <ToolOutlined style={{ color: 'orange' }} /> Réparer
                </Menu.Item>

            </Menu>
        )
    };

    return useMemo(() => {
        const allColumns = [
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
            },
            {
                title: 'Modèle',
                dataIndex: 'nom_modele',
                render: (text, record) => (
                    <Tag icon={<TagsOutlined />} color='blue' bordered={false}>
                        {text}
                    </Tag>
                )
            },
            {
                title: 'Marque',
                dataIndex: 'nom_marque',
                render: (text, record) => (
                    <Tag icon={<TagsOutlined />} color='magenta' bordered={false}>
                        {text}
                    </Tag>
                )
            },
            {
                title: 'Date',
                dataIndex: 'date_inspection',
                key: 'data_inspection',
                sorter: (a, b) => moment(a.date_inspection) - (b.date_inspection),
                sortDirections: ['descend', 'ascend'],
                render : (text) => (
                    <Tag icon={<CalendarOutlined />} color="blue">
                        {moment(text).format('DD-MM-YYYY')}
                    </Tag>
                )
            },
            {
                title: 'Date rep.',
                dataIndex: 'date_reparation',
                sorter: (a, b) => moment(a.date_reparation) - moment(b.date_reparation),
                sortDirections: ['descend', 'ascend'],
                render: (text) => {
                    if (!text) {
                        return (
                        <Tag icon={<CalendarOutlined />} color="red">
                            Aucune date
                        </Tag>
                        );
                    }
                
                    const date = moment(text);
                    const isValid = date.isValid();
                
                    return (
                        <Tag icon={<CalendarOutlined />} color={isValid ? "blue" : "red"}>
                        {isValid ? date.format('DD-MM-YYYY') : 'Date invalide'}
                        </Tag>
                    );
                },
            },
            {
                title: 'Date validation',
                dataIndex: 'date_validation',
                render: (text) => {
                    if(!text) {
                        return (
                           <Tag icon={<CalendarOutlined />} color="red">
                                Aucune date
                            </Tag> 
                        )
                    }
                    const date = moment(text);
                    const isValid = date.isValid();

                    return (
                        <Tag icon={<CalendarOutlined />} color={isValid ? "blue" : "red"}>
                            {isValid ? date.format('DD-MM-YYYY') : 'Date invalide'}
                        </Tag>
                    )
                }
            },
            {
                title: 'Type de rep.',
                dataIndex: 'type_rep',
                render: (text) => (
                    <Tag icon={<ToolOutlined spin />} style={columnStyles.title} className={columnStyles.hideScroll} color='volcano' bordered={false}>
                      {text}
                    </Tag>
                ),
            },
            {
                title: 'Cat inspect.',
                dataIndex: 'nom_cat_inspection',
                render: (text) => {
                    const { icon, color } = getInspectionIcon(text);
                    return (
                    <Tag
                        icon={icon}
                        color={color}
                        style={columnStyles.title}
                        className={columnStyles.hideScroll}
                    >
                        {text}
                    </Tag>
                    );
                },
            },
            {
                title: "Avis d'expert",
                dataIndex: 'avis',
                key: 'avis',
                render : (text) => (
                    <div className={columnStyles.hideScroll}>
                        {text}
                    </div>
                )
            },
            {
                title: "Commentaire",
                dataIndex: 'commentaire',
                key: 'commentaire',
                render : (text) => (
                    <div className={columnStyles.hideScroll}>
                        {text}
                    </div>
                )
            },
            {
                title: "Budget",
                dataIndex: 'montant',
                key: 'montant',
                sorter: (a,b) => a.montant - b.montant,
                sortDirections: ['descend', 'ascend'],
                render : (text) => (
                    <Space>
                        <Tag color="green">
                            {formatNumber(text)} USD
                        </Tag>
                    </Space>
                )
            },
            {
                title: "#Validé",
                dataIndex: 'budget_valide',
                key: 'budget_valide',
                sorter: (a, b) => a.budget_valide - b.budget_valide,
                sortDirections: ['descend', 'ascend'],
                render: (text) => (
                    <Space style={columnStyles.title} className={columnStyles.hideScroll}>
                        {text && parseFloat(text) !== 0 ? (
                        <Tag color="blue">
                            {`${parseFloat(text)
                                .toLocaleString("en-US", {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })
                                .replace(/,/g, " ")} USD`}
                            </Tag>
                          ) : (
                        <Tag icon={<CloseCircleOutlined />} color="red">Non validé</Tag>
                        )}
                    </Space>
                ),
            },
            {
                title: '#Générateur', 
                dataIndex: 'nom_statut_vehicule', 
                key: 'nom_statut_vehicule',
                render: (text) => {
                    const { icon, color } = statusIcons[text] || {};
                    return (
                        <Space>
                            <Tag icon={icon} color={color}>{text}</Tag>
                        </Space>
                    )
                }
            },
            {
                title: 'Statut', 
                dataIndex: 'nom_type_statut', 
                key: 'nom_type_statut',
                render: (text) => {
                    const { icon, color } = statusIcons[text] || {};
                    return (
                        <Space>
                            <Tag icon={icon} color={color}>{text}</Tag>
                        </Space>
                    )
                }
            },
            {
                title: 'Actions',
                dataIndex: 'actions',
                render: (text, record) => (
                    <Space size="middle">
                        <Tooltip title="Modifier">
                            <Button
                                icon={<EditOutlined />}
                                style={{ color: "green" }}
                                onClick={() => onEdit(record.id_sub_inspection_generateur)}
                                aria-label="Edit generateur"
                            />
                        </Tooltip>

                        <Dropdown overlay={getActionMenu(record, openModal)} trigger={['click']}>
                            <Button icon={<MoreOutlined />} style={{ color: 'blue' }} />
                        </Dropdown>

                    </Space>
                ),
            },
        ];

    // filter by visibility map (keys are column titles created by caller)
    return allColumns.filter((col) => columnsVisibility[col.title] !== false);
    }, [pagination, columnsVisibility, onEdit, onDetail, onDelete])
}