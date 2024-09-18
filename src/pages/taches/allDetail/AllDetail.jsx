import React, { useEffect, useState } from 'react';
import { Card, Typography, Tag, Popover, Button, Collapse, Divider } from 'antd';
import { getAllTache } from '../../../services/tacheService';
import './allDetail.scss';

const { Title, Paragraph } = Typography;
const { Panel } = Collapse;

const AllDetail = ({ idTache }) => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getAllTache(idTache);
                setData(res.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, [idTache]);

    const statusColor = (status) => {
        switch (status) {
            case 'En cours':
                return 'blue';
            case 'Complété':
                return 'green';
            default:
                return 'orange';
        }
    };

    // Group tasks by parent ID
    const groupedData = data.reduce((acc, item) => {
        if (item.id_tache) {
            if (!acc[item.id_tache]) {
                acc[item.id_tache] = { ...item, sous_taches: [], suivis: [] };
            }

            // Add sub-tasks to the correct parent task
            if (item.sous_tache) {
                acc[item.id_tache].sous_taches.push({ ...item, suivis: [] });
            }

            // Add follow-ups to the correct task
            if (item.suivi_commentaire) {
                if (item.sous_tache) {
                    // Find the parent task of this sub-task and add the follow-up to it
                    const parentTask = acc[item.parent_id];
                    if (parentTask) {
                        const subTask = parentTask.sous_taches.find(st => st.id_sous_tache === item.id_sous_tache);
                        if (subTask) subTask.suivis.push(item);
                    }
                } else {
                    acc[item.id_tache].suivis.push(item);
                }
            }
        }
        return acc;
    }, {});

    return (
        <div className="allDetail">
            {Object.values(groupedData).map((parent) => (
                <Card
                    key={parent.id_tache}
                    className="task-card"
                    bordered={false}
                    bodyStyle={{ padding: '24px' }}
                    title={
                        <Title level={4} className="task-title">
                            {parent.nom_tache}
                        </Title>
                    }
                >
                    <Paragraph className="task-detail">
                        <strong>Description:</strong> {parent.description || 'N/A'}
                    </Paragraph>
                    <Paragraph className="task-detail">
                        <strong>Date de Début:</strong> {new Date(parent.date_debut).toLocaleDateString()}
                    </Paragraph>
                    <Paragraph className="task-detail">
                        <strong>Date de Fin:</strong> {new Date(parent.date_fin).toLocaleDateString()}
                    </Paragraph>
                    <Paragraph className="task-detail">
                        <strong>Priorité:</strong> <Tag color={parent.priorite === 1 ? 'red' : 'geekblue'}>{parent.priorite}</Tag>
                    </Paragraph>
                    <Paragraph className="task-detail">
                        <strong>Statut:</strong> <Tag color={statusColor(parent.statut)}>{parent.statut}</Tag>
                    </Paragraph>
                    <Paragraph className="task-detail">
                        <strong>Client:</strong> {parent.nom_client}
                    </Paragraph>
                    <Paragraph className="task-detail">
                        <strong>Fréquence:</strong> {parent.frequence}
                    </Paragraph>
                    <Paragraph className="task-detail">
                        <strong>Propriétaire:</strong> {parent.owner}
                    </Paragraph>
                    <Paragraph className="task-detail">
                        <strong>Ville:</strong> {parent.ville}
                    </Paragraph>
                    <Paragraph className="task-detail">
                        <strong>Département:</strong> {parent.departement}
                    </Paragraph>
                    <Paragraph className="task-detail">
                        <strong>Contrôle de Base:</strong> {parent.controle_de_base}
                    </Paragraph>
                    <Paragraph className="task-detail">
                        <strong>Nombre de Jours:</strong> {parent.nbre_jour}
                    </Paragraph>

                    {/* Display parent task follow-ups */}
                    {parent.suivis.length > 0 && (
                        <Popover
                            content={
                                <div>
                                    {parent.suivis.map((suivi) => (
                                        <div key={suivi.id_suivi} className="suivi-detail">
                                            <Paragraph>
                                                <strong>Commentaire:</strong> {suivi.suivi_commentaire}
                                            </Paragraph>
                                            <Paragraph>
                                                <strong>Pourcentage d'Avancement:</strong> {suivi.suivi_pourcentage_avancement}%
                                            </Paragraph>
                                        </div>
                                    ))}
                                </div>
                            }
                            title="Suivi"
                            trigger="click"
                        >
                            <Button type="primary">Voir les Suivis</Button>
                        </Popover>
                    )}

                    {/* Display sub-tasks */}
                    {parent.sous_taches.length > 0 && (
                        <Collapse bordered={false} className="task-details" defaultActiveKey={['1']}>
                            <Panel header="Sous-Tâches" key="1">
                                {parent.sous_taches.map((sousTache) => (
                                    <Card
                                        key={sousTache.id_sous_tache}
                                        bordered={false}
                                        className="sub-task-card"
                                    >
                                        <Paragraph>
                                            <strong>Nom:</strong> {sousTache.sous_tache}
                                        </Paragraph>
                                        <Paragraph>
                                            <strong>Description:</strong> {sousTache.sous_tache_description}
                                        </Paragraph>
                                        <Paragraph>
                                            <strong>Statut:</strong> <Tag color={statusColor(sousTache.sous_tache_statut)}>{sousTache.sous_tache_statut === 1 ? 'Complété' : 'En cours'}</Tag>
                                        </Paragraph>
                                        <Paragraph>
                                            <strong>Date de Début:</strong> {new Date(sousTache.sous_tache_dateDebut).toLocaleDateString()}
                                        </Paragraph>
                                        <Paragraph>
                                            <strong>Date de Fin:</strong> {new Date(sousTache.sous_tache_dateFin).toLocaleDateString()}
                                        </Paragraph>

                                        {/* Display sub-task follow-ups */}
                                        {sousTache.suivis.length > 0 && (
                                            <Popover
                                                content={
                                                    <div>
                                                        {sousTache.suivis.map((suivi) => (
                                                            <div key={suivi.id_suivi} className="suivi-detail">
                                                                <Paragraph>
                                                                    <strong>Commentaire:</strong> {suivi.suivi_commentaire}
                                                                </Paragraph>
                                                                <Paragraph>
                                                                    <strong>Pourcentage d'Avancement:</strong> {suivi.suivi_pourcentage_avancement}%
                                                                </Paragraph>
                                                            </div>
                                                        ))}
                                                    </div>
                                                }
                                                title="Suivi"
                                                trigger="click"
                                            >
                                                <Button type="primary">Voir les Suivis</Button>
                                            </Popover>
                                        )}
                                    </Card>
                                ))}
                            </Panel>
                        </Collapse>
                    )}
                </Card>
            ))}
        </div>
    );
};

export default AllDetail;
