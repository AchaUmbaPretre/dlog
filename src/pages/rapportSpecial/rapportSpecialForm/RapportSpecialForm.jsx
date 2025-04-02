import React, { useEffect, useState } from 'react';
import { Form, Col, Select, InputNumber, Button, DatePicker, Row, Divider, Card, notification } from 'antd';
import { postRapport } from '../../../services/rapportService';
import { getClient } from '../../../services/clientService';
import { useSelector } from 'react-redux';
import './rapportSpecialForm.scss'

const RapportSpecialForm = ({closeModal, fetchData}) => {
    const [form] = Form.useForm();
    const [isLoading, setIsLoading] = useState(false);
    const [periode, setPeriode] = useState(null);
    const [client, setClient] = useState([]);
    const userId = useSelector((state) => state.user?.currentUser?.id_utilisateur);
    
    const fetchDatas = async () => {
        try {
            const [clientData] = await Promise.all([
                getClient()
            ]);

            setClient(clientData.data);
            
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setIsLoading(false);
        }
    }

        useEffect(() => {
            fetchDatas();
              // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []);

    const onFinish = async (values) => {
        setIsLoading(true);
        try {
            await postRapport({
                ...values,
                user_cr: userId
            });

            closeModal();
            fetchData();
            form.resetFields();
            notification.success({
                message: 'Succès',
                description: 'Les informations ont été enregistrées avec succès.',
            });
        } catch (error) {
            console.error("Erreur lors de l'envoi du rapport:", error);
    
            notification.error({
                message: 'Erreur',
                description: error?.response?.data?.message || 
                             'Une erreur s\'est produite lors de l\'enregistrement.',
            });
        } finally {
            setIsLoading(false);
        }
    };
    
    
    return (
        <div className="rapportSpecialForm" >
            <div className="rapportSpecial_wrapper">
                <h1 className="h1_rapport">FORM DE RAPPORT</h1>
                <div className="rapportSpecial_rows">
                    <div className="rapportSpecial_row">

                    </div>
                </div>
            </div>
        </div>
    );
};

const styles = {
    title: {
        fontSize: '15px',
        fontWeight: 'bold',
        color: '#1890ff',
    },
    subTitle: {
        fontSize: '12px',
        fontWeight: 'bold',
        color: '#333',
        textTransform: 'uppercase',
        letterSpacing: '0.3px',
        paddingBottom: '4px',
        marginBottom: '12px',
    },
    input: {
        width: '100%',
        borderRadius: '5px',
    },
};

export default RapportSpecialForm;
