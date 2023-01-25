import { Button, ButtonProps, Typography } from '@mui/material';
import React from 'react';
import { LoginResult, SignUpResult } from '../hooks';
import { AuthDialog } from './AuthDialog';

export type OpenAuthDialogButtonProps = Omit<ButtonProps, 'onClick' | 'variant' | 'color'>;

export function OpenAuthDialogButton({ ...props }: OpenAuthDialogButtonProps) {
    const [openDialog, setOpenDialog] = React.useState<boolean>(false);
    const handleOpen = React.useCallback(async () => setOpenDialog(true), []);
    const handleClose = React.useCallback(async () => setOpenDialog(false), []);
    const afterCallback = React.useCallback(async (result: LoginResult | SignUpResult) => {
        if (result.isSuccess) setOpenDialog(false);
    }, []);

    return (
        <>
            <Button onClick={handleOpen} variant="contained" color="primary" {...props}>
                log in / sign up
            </Button>
            <AuthDialog
                open={openDialog}
                onClose={handleClose}
                afterLoginCallback={afterCallback}
                afterSignUpCallback={afterCallback}
            />
        </>
    );
}
