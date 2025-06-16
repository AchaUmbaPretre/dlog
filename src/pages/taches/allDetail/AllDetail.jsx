import React, { useEffect, useState } from 'react';
import { Card, Typography, Tag, Popover, Button, Collapse, Skeleton } from 'antd';
import { getAllTache } from '../../../services/tacheService';
import html2pdf from 'html2pdf.js';
import htmlDocx from 'html-docx-js/dist/html-docx';
import {
    FilePdfOutlined,
    FileExcelOutlined,
    FileWordOutlined
  } from '@ant-design/icons';
import * as XLSX from 'xlsx';
import './allDetail.scss';

const { Title, Paragraph: AntParagraph } = Typography;
const { Panel } = Collapse;

const AllDetail = ({ idTache }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const res = await getAllTache(idTache);
                setData(res.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
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

    const groupedData = data.reduce((acc, item) => {
        if (item.id_tache) {
            if (!acc[item.id_tache]) {
                acc[item.id_tache] = { ...item, sous_taches: [], suivis: [] };
            }

            if (item.sous_tache) {
                acc[item.id_tache].sous_taches.push({ ...item, suivis: [] });
            }

            if (item.id_suivi) {
                if (item.sous_tache) {
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

    const exportToPDF = () => {
        const element = document.getElementById('allDetailContent');
        const options = {
            margin: [0.5, 0.5, 0.5, 0.5],
            filename: 'details.pdf',
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };
        html2pdf().from(element).set(options).save();
    };

    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Tasks');
        XLSX.writeFile(workbook, 'details.xlsx');
    };

    const exportToWord = () => {
        const element = document.getElementById('allDetailContent');
        const html = element.innerHTML;

        // Create a document from HTML
        const converted = htmlDocx.asBlob(html);
        const url = URL.createObjectURL(converted);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = 'details.docx';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    return (
        <div className="allDetail">
            <div style={{ marginBottom: '20px' }}>
                <Button 
                    type="primary" 
                    icon={<FilePdfOutlined />} 
                    onClick={exportToPDF} 
                    style={{ marginRight: '10px', backgroundColor: '#ff4d4f', borderColor: '#ff4d4f' }}
                >
                    PDF
                </Button>
                <Button 
                    type="primary" 
                    icon={<FileExcelOutlined />} 
                    onClick={exportToExcel} 
                    style={{ marginRight: '10px', backgroundColor: '#52c41a', borderColor: '#52c41a' }}
                >
                    Excel
                </Button>
                <Button 
                    type="primary" 
                    icon={<FileWordOutlined />} 
                    onClick={exportToWord} 
                    style={{ backgroundColor: '#1890ff', borderColor: '#1890ff' }}
                >
                    Word
                </Button>
            </div>
            <div id="allDetailContent">
                {loading ? (
                    <Skeleton active paragraph={{ rows: 10 }} />
                ) : (
                    Object.values(groupedData).map((parent) => (
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
                            <AntParagraph className="task-detail">
                                <strong>Description:</strong> <div dangerouslySetInnerHTML={{ __html: parent.description }} style={{ marginTop: '10px' }} />
                            </AntParagraph>
                            {/* <AntParagraph className="task-detail">
                                <strong>Date de Début:</strong> {new Date(parent.date_debut).toLocaleDateString()}
                            </AntParagraph>
                            <AntParagraph className="task-detail">
                                <strong>Date de Fin:</strong> {new Date(parent.date_fin).toLocaleDateString()}
                            </AntParagraph>
                            <AntParagraph className="task-detail">
                                <strong>Priorité:</strong>{getPriorityTag(parent.priorite)}
                            </AntParagraph>
                            <AntParagraph className="task-detail">
                                <strong>Statut:</strong> <Tag color={statusColor(parent.statut)}>{parent.statut}</Tag>
                            </AntParagraph>
                            <AntParagraph className="task-detail">
                                <strong>Client:</strong> {parent.nom_client}
                            </AntParagraph>
                            <AntParagraph className="task-detail">
                                <strong>Fréquence:</strong> {parent.frequence}
                            </AntParagraph>
                            <AntParagraph className="task-detail">
                                <strong>Propriétaire:</strong> {parent.owner}
                            </AntParagraph>
                            <AntParagraph className="task-detail">
                                <strong>Ville:</strong> {parent.ville}
                            </AntParagraph>
                            <AntParagraph className="task-detail">
                                <strong>Département:</strong> {parent.departement}
                            </AntParagraph>
                            <AntParagraph className="task-detail">
                                <strong>Contrôle de Base:</strong> {parent.controle_de_base}
                            </AntParagraph>
                            <AntParagraph className="task-detail">
                                <strong>Nombre de Jours:</strong> {parent.nbre_jour}
                            </AntParagraph>
 */}
                            {/* Display parent task follow-ups */}
                            {parent.suivis.length > 0 && (
                                <Popover
                                    content={
                                        <div>
                                            {parent.suivis.map((suivi) => (
                                                <div key={suivi.id_suivi} className="suivi-detail">
                                                    <AntParagraph>
                                                        <strong>Commentaire:</strong> {suivi.suivi_commentaire}
                                                    </AntParagraph>
                                                    <AntParagraph>
                                                        <strong>Pourcentage d'Avancement:</strong> {suivi.suivi_pourcentage_avancement}%
                                                    </AntParagraph>
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
                                                <AntParagraph>
                                                    <strong>Nom:</strong> {sousTache.sous_tache}
                                                </AntParagraph>
                                                <AntParagraph>
                                                    <strong>Description:</strong> {sousTache.sous_tache_description}
                                                </AntParagraph>
                                                <AntParagraph>
                                                    <strong>Statut:</strong> <Tag color={statusColor(sousTache.sous_tache_statut)}>{sousTache.sous_tache_statut}</Tag>
                                                </AntParagraph>
                                                <AntParagraph>
                                                    <strong>Date de Début:</strong> {new Date(sousTache.sous_tache_dateDebut).toLocaleDateString()}
                                                </AntParagraph>
                                                <AntParagraph>
                                                    <strong>Date de Fin:</strong> {new Date(sousTache.sous_tache_dateFin).toLocaleDateString()}
                                                </AntParagraph>

                                                {/* Display sub-task follow-ups */}
                                                {sousTache.suivis.length > 0 && (
                                                    <Popover
                                                        content={
                                                            <div>
                                                                {sousTache.suivis.map((suivi) => (
                                                                    <div key={suivi.id_suivi} className="suivi-detail">
                                                                        <AntParagraph>
                                                                            <strong>Commentaire:</strong> {suivi.suivi_commentaire}
                                                                        </AntParagraph>
                                                                        <AntParagraph>
                                                                            <strong>Pourcentage d'Avancement:</strong> {suivi.suivi_pourcentage_avancement}%
                                                                        </AntParagraph>
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
                    ))
                )}
            </div>
        </div>
    );
};

export default AllDetail;