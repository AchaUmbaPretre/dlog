export const scanStyles = {
  global: `
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
  `,
  
  container: {
    minHeight: '100vh',
    background: '#f0f2f5',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  
  card: {
    maxWidth: '500px',
    width: '100%',
    background: 'white',
    borderRadius: '16px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    padding: '40px 32px',
    textAlign: 'center'
  },
  
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '20px'
  },
  
  spinner: {
    width: '48px',
    height: '48px',
    border: '4px solid #f0f0f0',
    borderTopColor: '#1677ff',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite'
  },
  
  title: {
    fontSize: '24px',
    fontWeight: '600',
    color: 'rgba(0,0,0,0.88)',
    marginBottom: '8px'
  },
  
  subtitle: {
    fontSize: '14px',
    color: 'rgba(0,0,0,0.45)'
  },
  
  successIcon: {
    fontSize: '64px',
    marginBottom: '24px'
  },
  
  successTitle: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#52c41a',
    marginBottom: '12px'
  },
  
  successMessage: {
    fontSize: '16px',
    color: 'rgba(0,0,0,0.65)',
    marginBottom: '24px',
    lineHeight: '1.5'
  },
  
  errorIcon: {
    fontSize: '64px',
    marginBottom: '24px'
  },
  
  errorTitle: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#ff4d4f',
    marginBottom: '12px'
  },
  
  errorMessage: {
    fontSize: '16px',
    color: 'rgba(0,0,0,0.65)',
    marginBottom: '24px',
    lineHeight: '1.5'
  },
  
  infoContainer: {
    background: '#fafafa',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '24px',
    textAlign: 'left'
  },
  
  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 0',
    fontSize: '14px',
    borderBottom: '1px solid #f0f0f0',
    '&:last-child': {
      borderBottom: 'none'
    }
  },
  
  badge: {
    padding: '4px 12px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: '500'
  },
  
  buttonGroup: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'center'
  },
  
  primaryButton: {
    padding: '8px 20px',
    background: '#1677ff',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s',
    '&:hover': {
      background: '#4096ff'
    }
  },
  
  secondaryButton: {
    padding: '8px 20px',
    background: 'white',
    color: '#1677ff',
    border: '1px solid #d9d9d9',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s',
    '&:hover': {
      borderColor: '#4096ff',
      color: '#4096ff'
    }
  }
};

// Ajouter l'animation CSS
export const addKeyframes = () => {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
  `;
  document.head.appendChild(style);
};