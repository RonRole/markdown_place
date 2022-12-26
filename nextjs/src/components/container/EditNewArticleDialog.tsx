import { Button, Dialog, DialogProps } from '@mui/material';
import React from 'react';

export type EditNewArticleDialogProps = DialogProps;

export function EditNewArticleDialog(props: EditNewArticleDialogProps) {
    return (
        <Dialog {...props}>
            <h1>This is EditNewArticleDialog!!!</h1>
        </Dialog>
    );
}
