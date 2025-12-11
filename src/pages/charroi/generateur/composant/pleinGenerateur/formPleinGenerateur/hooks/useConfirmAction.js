import { useState, useCallback } from 'react';

export function useConfirmAction() {
const [visible, setVisible] = useState(false);
const [message, setMessage] = useState('');
const [pending, setPending] = useState(null);


    const requestConfirm = useCallback((payload, messageText) => {
        setPending(payload);
        setMessage(messageText || 'Confirmer ?');
        setVisible(true);
    }, []);


    const confirm = useCallback(() => {
        setVisible(false);
        return pending;
    }, [pending]);


    const cancel = useCallback(() => {
        setVisible(false);
        setPending(null);
        setMessage('');
    }, []);


    return {
        visible,
        message,
        pending,
        requestConfirm,
        confirm,
        cancel
    };
}