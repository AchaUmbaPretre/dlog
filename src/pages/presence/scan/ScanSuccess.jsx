import React, { useState, useEffect } from 'react';
import {
  CheckCircleOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  GlobalOutlined,
  HomeOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import { Button, Card, Typography, Divider, Alert } from 'antd';

const { Title, Text } = Typography;

const ScanSuccess = ({ result, onGoHome }) => {
  const { message, data } = result;
  const isEntry = data?.type_scan === 'ENTREE';
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  const formatDateTime = (dateStr) => {
    const date = new Date(dateStr);
    return {
      date: date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }),
      time: date.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit'
      })
    };
  };

  const dateTime = data?.scan_time ? formatDateTime(data.scan_time) : null;

  const styles = {
    container: {
      minHeight: '100vh',
      background: '#f5f5f5',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px'
    },
    card: {
      width: '100%',
      maxWidth: 500,
      borderRadius: 24,
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
      overflow: 'hidden'
    },
    header: {
      padding: '32px 24px 24px',
      textAlign: 'center',
      background: '#fff'
    },
    iconWrapper: {
      width: 64,
      height: 64,
      borderRadius: 32,
      background: isEntry ? '#52c41a10' : '#fa8c1610',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 20px'
    },
    icon: {
      fontSize: 32,
      color: isEntry ? '#52c41a' : '#fa8c16'
    },
    title: {
      fontSize: 24,
      fontWeight: 600,
      margin: 0,
      marginBottom: 8,
      color: '#1f1f1f'
    },
    subtitle: {
      fontSize: 14,
      color: '#8c8c8c',
      margin: 0
    },
    content: {
      padding: '0 24px 24px',
      background: '#fff'
    },
    alertBox: {
      marginBottom: 24,
      borderRadius: 12,
      border: 'none',
      background: message?.includes('⚠️') ? '#fff7e6' : '#f6ffed'
    },
    infoCard: {
      background: '#fafafa',
      borderRadius: 16,
      padding: '16px',
      marginBottom: 16
    },
    infoRow: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '12px 0'
    },
    label: {
      fontSize: 14,
      color: '#8c8c8c',
      display: 'flex',
      alignItems: 'center',
      gap: 8
    },
    value: {
      fontSize: 14,
      fontWeight: 500,
      color: '#262626'
    },
    badge: {
      padding: '4px 12px',
      borderRadius: 20,
      fontSize: 13,
      fontWeight: 500,
      background: isEntry ? '#52c41a10' : '#fa8c1610',
      color: isEntry ? '#52c41a' : '#fa8c16'
    },
    distanceBadge: {
      padding: '4px 12px',
      borderRadius: 20,
      fontSize: 13,
      fontWeight: 500,
      background: '#f5f5f5',
      color: '#595959'
    },
    timeBlock: {
      background: '#fafafa',
      borderRadius: 16,
      padding: '16px',
      textAlign: 'center'
    },
    timeValue: {
      fontSize: 20,
      fontWeight: 600,
      fontFamily: 'monospace',
      color: '#262626'
    },
    footer: {
      padding: '20px 24px',
      background: '#fff',
      borderTop: '1px solid #f0f0f0'
    },
    button: {
      width: '100%',
      height: 44,
      borderRadius: 12,
      fontSize: 15,
      fontWeight: 500,
      background: '#1f1f1f',
      border: 'none'
    },
    buttonHover: {
      background: '#2c2c2c'
    },
    countdownText: {
      fontSize: 12,
      color: '#bfbfbf',
      textAlign: 'center',
      marginTop: 12,
      display: 'block'
    },
    divider: {
      margin: '16px 0',
      borderColor: '#f0f0f0'
    }
  };

  return (
    <div style={styles.container}>
      <Card bordered={false} style={styles.card} bodyStyle={{ padding: 0 }}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.iconWrapper}>
            <CheckCircleOutlined style={styles.icon} />
          </div>
          <Title level={2} style={styles.title}>
            Pointage enregistré
          </Title>
          <Text style={styles.subtitle}>
            {isEntry ? 'Entrée validée' : 'Sortie validée'}
          </Text>
        </div>

        {/* Content */}
        <div style={styles.content}>
          {/* Alert */}
          {message && (
            <Alert
              message={message.includes('⚠️') ? "Information" : "Succès"}
              description={message.replace('⚠️', '')}
              type={message.includes('⚠️') ? "warning" : "success"}
              showIcon
              style={styles.alertBox}
            />
          )}

          {/* Main Info Card */}
          <div style={styles.infoCard}>
            <div style={styles.infoRow}>
              <Text style={styles.label}>
                <ClockCircleOutlined style={{ fontSize: 14 }} />
                Type
              </Text>
              <span style={styles.badge}>
                {isEntry ? 'ENTRÉE' : 'SORTIE'}
              </span>
            </div>
            
            <Divider style={styles.divider} />
            
            <div style={styles.infoRow}>
              <Text style={styles.label}>
                <GlobalOutlined style={{ fontSize: 14 }} />
                Site
              </Text>
              <Text style={styles.value}>{data?.site}</Text>
            </div>
            
            {data?.zone && (
              <>
                <Divider style={styles.divider} />
                <div style={styles.infoRow}>
                  <Text style={styles.label}>
                    <EnvironmentOutlined style={{ fontSize: 14 }} />
                    Zone
                  </Text>
                  <Text style={styles.value}>{data.zone}</Text>
                </div>
              </>
            )}
            
            {data?.distance !== undefined && (
              <>
                <Divider style={styles.divider} />
                <div style={styles.infoRow}>
                  <Text style={styles.label}>Distance</Text>
                  <span style={styles.distanceBadge}>
                    {data.distance} mètres
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Time Block */}
          {dateTime && (
            <div style={styles.timeBlock}>
              <Text style={{ fontSize: 13, color: '#8c8c8c', display: 'block', marginBottom: 8 }}>
                <CalendarOutlined style={{ marginRight: 6 }} />
                {dateTime.date}
              </Text>
              <Text style={styles.timeValue}>{dateTime.time}</Text>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={styles.footer}>
          <Button
            type="primary"
            size="large"
            icon={<HomeOutlined />}
            onClick={onGoHome}
            style={styles.button}
            onMouseEnter={(e) => e.currentTarget.style.background = '#2c2c2c'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#1f1f1f'}
          >
            Retour à l'accueil
          </Button>
          {countdown > 0 && (
            <Text style={styles.countdownText}>
              Redirection dans {countdown}s
            </Text>
          )}
        </div>
      </Card>
    </div>
  );
};

export default ScanSuccess;