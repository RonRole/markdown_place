import React from 'react';
import { AuthContextProviderProps } from './AuthContextProvider';
import { Dialog, Card, CardHeader, CardContent, Button } from '@mui/material';
import { AlertDialog } from '../presentational/AlertDialog';

export type AlertDialogProps = {
    message?: string;
    description?: string;
};

export type AlertDialogContext = {
    open(props: AlertDialogProps): void;
    close(): void;
};

export type AlertDialogContextProviderProps = {
    children: React.ReactNode;
};

export const AlertDialogContext = React.createContext<AlertDialogContext>({
    open(props: AlertDialogProps) {},
    close() {},
});

export function AlertDialogContextProvider({ children }: AuthContextProviderProps) {
    const [open, setOpen] = React.useState<boolean>(false);
    const [dialogProps, setDialogProps] = React.useState<AlertDialogProps>({
        message: 'エラーが発生しました',
        description: '',
    });
    const handleOpen = React.useCallback(
        (props: AlertDialogProps) => {
            setDialogProps({
                message: props.message || dialogProps.message,
                description: props.description || dialogProps.description,
            });
            setOpen(true);
        },
        [dialogProps.description, dialogProps.message]
    );
    const handleClose = React.useCallback(() => {
        setOpen(false);
    }, []);
    return (
        <AlertDialogContext.Provider value={{ open: handleOpen, close: handleClose }}>
            {children}
            <AlertDialog
                message={dialogProps.message}
                description={dialogProps.description}
                open={open}
                onClose={handleClose}
            />
        </AlertDialogContext.Provider>
    );
}
