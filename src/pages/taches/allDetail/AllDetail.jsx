import React, { useEffect, useState } from 'react';
import { Table, Card, Col, Row, Typography } from 'antd';
import { getAllTache } from '../../../services/tacheService';
import './allDetail.scss';

const { Title, Text } = Typography;

const AllDetail = ({ idTache }) => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getAllTache(idTache);
                setData(res);
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
    }, [idTache]);

    const columns = [
        {
            title: 'Sous-tâche',
            dataIndex: 'sous_tache',
            key: 'sous_tache',
        },
        {
            title: 'Description',
            dataIndex: 'sous_tache_description',
            key: 'sous_tache_description',
        },
        {
            title: 'Statut',
            dataIndex: 'sous_tache_statut',
            key: 'sous_tache_statut',
            render: (text) => (text === 1 ? 'En cours' : 'Terminé'),
        },
        {
            title: 'Date Début',
            dataIndex: 'sous_tache_dateDebut',
            key: 'sous_tache_dateDebut',
            render: (text) => new Date(text).toLocaleDateString(),
        },
        {
            title: 'Date Fin',
            dataIndex: 'sous_tache_dateFin',
            key: 'sous_tache_dateFin',
            render: (text) => new Date(text).toLocaleDateString(),
        },
        {
            title: 'Commentaire',
            dataIndex: 'suivi_commentaire',
            key: 'suivi_commentaire',
        },
        {
            title: 'Avancement (%)',
            dataIndex: 'suivi_pourcentage_avancement',
            key: 'suivi_pourcentage_avancement',
        },
    ];

    const renderTaskDetails = (task) => (
        <Card title={`Tâche: ${task.nom_tache}`} bordered={false} className="task-card">
            <Row gutter={16}>
                <Col span={12}>
                    <Title level={4}>Détails</Title>
                    <Text><strong>Description:</strong> {task.description || 'N/A'}</Text><br />
                    <Text><strong>Date Début:</strong> {new Date(task.date_debut).toLocaleDateString()}</Text><br />
                    <Text><strong>Date Fin:</strong> {new Date(task.date_fin).toLocaleDateString()}</Text><br />
                    <Text><strong>Priorité:</strong> {task.priorite}</Text><br />
                    <Text><strong>Statut:</strong> {task.statut}</Text><br />
                    <Text><strong>Client:</strong> {task.nom_client}</Text><br />
                    <Text><strong>Fréquence:</strong> {task.frequence}</Text><br />
                    <Text><strong>Propriétaire:</strong> {task.owner}</Text><br />
                    <Text><strong>Ville:</strong> {task.ville}</Text><br />
                    <Text><strong>Département:</strong> {task.departement}</Text><br />
                    <Text><strong>Contrôle de Base:</strong> {task.controle_de_base}</Text><br />
                    <Text><strong>Nombre de Jours:</strong> {task.nbre_jour}</Text><br />
                </Col>
                <Col span={12}>
                    <Title level={4}>Sous-tâches</Title>
                    {task.sous_tache ? (
                        <Table
                            columns={columns}
                            dataSource={[task]}
                            rowKey="id_tache"
                            pagination={false}
                            bordered
                        />
                    ) : (
                        <Text>Aucune sous-tâche</Text>
                    )}
                </Col>
            </Row>
        </Card>
    );

    return (
        <div className="allDetail">
            {data?.map((task) => (
                <div key={task.id_tache} className="task-detail">
                    {renderTaskDetails(task)}
                </div>
            ))}
        </div>
    );
};

export default AllDetail;
