import React, { useEffect, useState } from 'react';
import { Tag, Table, Input, Select, Button, DatePicker, Popconfirm, notification } from 'antd';
import { CalendarOutlined, BarcodeOutlined } from '@ant-design/icons';
import moment from 'moment';
import './rapportClotureTemplForm.scss'
import { useSelector } from 'react-redux';
import { getTemplate } from '../../../services/templateService';
import { getDeclarationTemplate, postCloture } from '../../../services/rapportService';

const RapportClotureTemplForm = () => {
    const [data, setData] = useState([]);
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(false);
    const [idTemplate, setIdTemplate] = useState(null);
    const [editingKey, setEditingKey] = useState(null);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 20,
    });
    const scroll = { x: 400 };
    const [periode, setPeriode] = useState(null);
    const userId = useSelector((state) => state.user?.currentUser?.id_utilisateur);
    const role = useSelector((state) => state.user?.currentUser.role);
    
    const fetchData = async() => {
        setLoading(true)    
        try {
            const [ templateData ] = await Promise.all([
                getTemplate(role, userId),
            ])

            setTemplates(templateData.data);

            if (idTemplate) {
                const { data: decl } = await getDeclarationTemplate(idTemplate);
                setData(decl.map((row, index) => ({ ...row, key: index })));

            } else {
                setData([]); 
            }
        } catch (error) {
            notification.error({
                message: 'Erreur de chargement',
                description: 'Une erreur est survenue lors du chargement des données.',
            });
        } finally {
            setLoading(false);
        }
    }

        useEffect(() => {
            fetchData()
        }, [idTemplate]);

        const isEditing = (record) => record.key === editingKey;

        const edit = (record) => {
            setEditingKey(record.key);
        };
    
        const save = (key, newData) => {
            setData((prevData) => 
                prevData.map((item) => 
                    item.key === key ? { ...item, ...newData } : item
                )
            );
            setEditingKey(null);
        };        
        
        
    
        const cancel = () => {
            setEditingKey(null);
        };
    
        const editableCell = (text, record, dataIndex, type = 'text') => {
            return isEditing(record) ? (
                type === 'date' ? (
                    <DatePicker
                        defaultValue={text ? moment(text) : null}
                        format="YYYY-MM-DD"
                        onChange={(date, dateString) => save(record.key, { ...record, [dataIndex]: dateString })}
                    />

                ) : (
                    <Input
                        defaultValue={text}
                        onChange={(e) => record[dataIndex] = e.target.value}
                        onPressEnter={() => save(record.key, record)}
                    />
                )
            ) : (
                type === 'date' ? (
                    <Tag icon={<CalendarOutlined />} color="purple" onClick={() => edit(record)} style={{ cursor: 'pointer' }}>
                        {text ? moment(text).format('MMMM YYYY') : 'Aucun'}
                    </Tag>
                ) : (
                    <Tag icon={<BarcodeOutlined />} color="cyan" onClick={() => edit(record)} style={{ cursor: 'pointer' }}>
                        {text ?? '0'}
                    </Tag>
                )
            );
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
                title: 'Periode',
                dataIndex: 'periode',
                key: 'periode',
                sorter: (a, b) => moment(a.periode) - moment(b.periode),
                sortDirections: ['descend', 'ascend'],
                render: (text, record) => editableCell(text, record, 'periode', 'date')
            },
            {
                title: 'M² occupe',
                dataIndex: 'm2_occupe',
                key: 'm2_occupe',
                sorter: (a, b) => a.m2_occupe - b.m2_occupe,
                render: (text, record) => editableCell(text, record, 'm2_occupe'),
                align: 'right',
            },
            {
                title: 'M² facture',
                dataIndex: 'm2_facture',
                key: 'm2_facture',
                sorter: (a, b) => a.m2_facture - b.m2_facture,
                render: (text, record) => editableCell(text, record, 'm2_facture'),
                align: 'right',
            },
            {
                title: 'Total Entr',
                dataIndex: 'total_entreposage',
                key: 'total_entreposage',
                sorter: (a, b) => a.total_entreposage - b.total_entreposage,
                render: (text, record) => editableCell(text, record, 'total_entreposage'),
                align: 'right',
            },
            {
                title: 'Total Manu',
                dataIndex: 'total_manutation',
                key: 'total_manutation',
                sorter: (a, b) => a.total_manutation - b.total_manutation,
                render: (text, record) => editableCell(text, record, 'total_manutation'),
                align: 'right',
            },
            {
                title: 'Total',
                dataIndex: 'total',
                key: 'total',
                sorter: (a, b) => a.total - b.total,
                render: (text, record) => editableCell(text, record, 'total'),
                align: 'right'
            },
            {
                title: 'Action',
                dataIndex: 'action',
                render: (_, record) => (
                    isEditing(record) ? (
                        <>
                            <Button type="link" onClick={() => save(record.key, record)}>Sauvegarder</Button>
                            <Popconfirm title="Annuler ?" onConfirm={cancel}>
                                <Button type="link">Annuler</Button>
                            </Popconfirm>
                        </>
                    ) : (
                        <Button type="link" onClick={() => edit(record)}>Modifier</Button>
                    )
                ),
            },
        ];

        const onFinish = async () => {
            try {
                setLoading(true);
                await postCloture(data);
                
                notification.success({
                    message: 'Succès',
                    description: 'La clôture a été ajoutée avec succès.',
                });
            } catch (error) {
                console.error(error);
                
                notification.error({
                    message: 'Erreur',
                    description: "Une erreur s'est produite lors de l'ajout de la clôture.",
                });
            } finally {
                setLoading(false);
            }
        };
        

    return (
        <div className="rapportClotureTemplForm">
            <div className="rapport_rows">
                <h1 className='rapport_h1'>Form rapport cloturé</h1>
            </div>
            <div className="rapportCloture_wrapper">
                <div className="rapportCloture_rows">
                    <div className="rapportCloture_top">
                        <label htmlFor=""> Template <div style={{color:'red'}}>*</div></label>
                        <Select
                            showSearch
                            options={templates.map(item => ({ value: item.id_template, label: item.desc_template }))}
                            placeholder="Sélectionnez..."
                            onChange={setIdTemplate}
                            optionFilterProp="label"
                            style={{width:'100%'}}                       
                        />
                    </div>
                    <div className="rapportCloture_left">
                        <Button onClick={onFinish}>
                            Soumettre
                        </Button>
                    </div>
                </div>

                <div className="rapportCloture_bottom">
                    <Table
                        dataSource={data}
                        columns={columns}
                        bordered
                        scroll={scroll}
                        loading={loading}
                        size="small"
                        pagination={pagination}
                        onChange={pagination => setPagination(pagination)}
                        rowClassName={(record, index) => (index % 2 === 0 ? 'odd-row' : 'even-row')}
                    />
                </div>
            </div>
        </div>
    );
};

export default RapportClotureTemplForm;
