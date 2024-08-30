import React, { useEffect, useState, useRef } from 'react';
import { notification, Card, Descriptions, Spin, Typography, Divider, Tag, Space, Button } from 'antd';
import { getBudgetOne } from '../../../services/budgetService';
import { DollarOutlined, CalendarOutlined, ShopOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import html2pdf from 'html2pdf.js';
import * as XLSX from 'xlsx';

const { Title, Text } = Typography;

const BudgetDetail = ({ idBudget }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const contentRef = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getBudgetOne(idBudget);
                setData(response.data[0]); // Assuming response.data is an array with one object
                setLoading(false);
            } catch (error) {
                notification.error({
                    message: 'Erreur de chargement',
                    description: 'Une erreur est survenue lors du chargement des données.',
                });
                setLoading(false);
            }
        };

        fetchData();
    }, [idBudget]);

    const handleExportPDF = () => {
        const element = contentRef.current;
        const opt = {
            margin: [0.5, 0.5, 0.5, 0.5],
            filename: 'détails_budget.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };

        html2pdf().from(element).set(opt).save();
    };

    const handleExportExcel = () => {
        if (!data) return;

        // Transform the data into a format suitable for Excel
        const ws = XLSX.utils.json_to_sheet([data], {
            header: [
                'article',
                'quantite_demande',
                'quantite_validee',
                'prix_unitaire',
                'montant',
                'fournisseur',
                'date_creation',
                'montant_valide',
                'nom_fournisseur',
                'nom_article'
            ]
        });
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Détails du Budget');

        XLSX.writeFile(wb, 'details_budget.xlsx');
    };

    return (
        <div>
            <Space style={{ marginBottom: 20 }}>
                <Button
                    type="primary"
                    onClick={handleExportPDF}
                >
                    Exporter en PDF
                </Button>
                <Button
                    type="primary"
                    onClick={handleExportExcel}
                >
                    Exporter en Excel
                </Button>
            </Space>
            <Card
                title={<Title level={3} style={{ marginBottom: 0 }}>Détails du Budget</Title>}
                style={{ width: '100%', marginTop: 20 }}
                loading={loading}
                bordered={false}
                bodyStyle={{ padding: '20px', backgroundColor: '#f9f9f9' }}
                headStyle={{ backgroundColor: '#ffffff', borderBottom: '2px solid #e8e8e8' }}
            >
                <div ref={contentRef}>
                    {loading ? (
                        <Spin tip="Chargement en cours..." size="large" />
                    ) : (
                        <>
                            <Descriptions
                                bordered
                                column={1}
                                size="large"
                                labelStyle={{ fontWeight: 'bold', color: '#333' }}
                                contentStyle={{ fontSize: 16, color: '#555' }}
                                style={{ backgroundColor: '#fff' }}
                            >
                                <Descriptions.Item label={<><ShopOutlined /> Fournisseur</>}>
                                    <Text>{data.nom_fournisseur}</Text>
                                </Descriptions.Item>
                                <Descriptions.Item label={<><DollarOutlined /> Article</>}>
                                    <Text>{data.nom_article}</Text>
                                </Descriptions.Item>
                                <Descriptions.Item label="Quantité demandée">
                                    <Text>{data.quantite_demande}</Text>
                                </Descriptions.Item>
                                <Descriptions.Item label="Quantité validée">
                                    <Text>{data.quantite_validee}</Text>
                                </Descriptions.Item>
                                <Descriptions.Item label={<><DollarOutlined /> Prix unitaire</>}>
                                    <Text>{data.prix_unitaire.toFixed(2)}$</Text>
                                </Descriptions.Item>
                                <Descriptions.Item label={<><DollarOutlined /> Montant</>}>
                                    <Text>{data.montant.toFixed(2)} $</Text>
                                </Descriptions.Item>
                                <Descriptions.Item label={<><DollarOutlined /> Montant validé</>}>
                                    <Text>{data.montant_valide.toFixed(2)}$</Text>
                                </Descriptions.Item>
                                <Descriptions.Item label={<><CalendarOutlined /> Date de création</>}>
                                    <Text>{new Date(data.date_creation).toLocaleDateString()}</Text>
                                </Descriptions.Item>
                            </Descriptions>
                            <Divider style={{ margin: '20px 0', borderColor: '#e8e8e8' }} />
                        </>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default BudgetDetail;
