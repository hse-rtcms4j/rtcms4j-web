import React, { createContext, useContext, useMemo, useState } from 'react';
import {
    Alert,
    type AlertProps,
    AlertActionCloseButton,
    AlertGroup,
} from '@patternfly/react-core';

type ToastAlert = { key: React.Key; title: string; variant: AlertProps['variant'], description?: string, timeout?: number };

type ToastContextValue = {
    addAlert: (title: string, variant: AlertProps['variant'], description?: string, timeout?: number) => void;
    removeAlert: (key: React.Key) => void;
    clear: () => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function AlertsAnchor({ children }: { children: React.ReactNode }) {
    const [alerts, setAlerts] = useState<ToastAlert[]>([]);
    const maxDisplayed = 4;

    const addAlert = (title: string, variant: AlertProps['variant'], description?: string, timeout?: number) => {
        setAlerts(prev => [{ key: Date.now(), title, variant, description, timeout }, ...prev]);
    };

    const removeAlert = (key: React.Key) => {
        setAlerts(prev => prev.filter(a => a.key !== key));
    };

    const clear = () => setAlerts([]);

    const overflowMessage = useMemo(() => {
        const overflow = alerts.length - maxDisplayed;
        return overflow > 0 ? `View ${overflow} more alerts` : '';
    }, [alerts.length]);

    const value = useMemo(() => ({ addAlert, removeAlert, clear }), []);

    return (
        <ToastContext.Provider value={value}>
            {children}

            <AlertGroup hasAnimations isToast isLiveRegion overflowMessage={overflowMessage}>
                {alerts.slice(0, maxDisplayed).map(({ key, variant, title, description, timeout }) => (
                    <Alert
                        key={key}
                        variant={variant}
                        title={title}
                        actionClose={
                            <AlertActionCloseButton
                                title={title}
                                variantLabel={`${variant} alert`}
                                onClose={() => removeAlert(key)}
                            />
                        }
                        timeout={timeout ?? false}
                    >{description}</Alert>
                ))}
            </AlertGroup>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error('useToast must be used within a ToastProvider');
    return ctx;
}
