import { Button, ButtonProps } from '@mui/material';
import React from 'react';
import { LoginResult, SignUpResult } from '../hooks';
import { AuthDialog } from './AuthDialog';

export function OpenAuthDialogButton() {
    const [openDialog, setOpenDialog] = React.useState<boolean>(false);
    const handleOpen = React.useCallback(async () => setOpenDialog(true), []);
    const handleClose = React.useCallback(async () => setOpenDialog(false), []);
    const afterCallback = React.useCallback(async (result: LoginResult | SignUpResult) => {
        if (result === true) setOpenDialog(false);
    }, []);

    return (
        <>
            <Button
                onClick={handleOpen}
                variant="outlined"
                color="primary"
                sx={{ whiteSpace: 'nowrap' }}
            >
                ログイン/ユーザー登録
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
