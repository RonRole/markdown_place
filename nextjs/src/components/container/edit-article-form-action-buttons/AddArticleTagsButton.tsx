import { Label } from '@mui/icons-material';
import { Autocomplete, IconButton, IconButtonProps, Stack, TextField } from '@mui/material';
import React from 'react';
import { ConfirmDialog } from '../../presentational/ConfirmDialog';
import { SetArticleTagsDialog, SetArticleTagsDialogProps } from '../SetArticleTagsDialog';

export type AddArticleTagsButtonProps = {
    article: SetArticleTagsDialogProps['article'];
} & Omit<IconButtonProps, 'onClick'>;

export function AddArticleTagsButton({ article, ...props }: AddArticleTagsButtonProps) {
    const [open, setOpen] = React.useState(false);
    return (
        <>
            <IconButton {...props} onClick={() => setOpen(true)}>
                <Label />
            </IconButton>
            <SetArticleTagsDialog
                article={article}
                open={open}
                onClose={() => setOpen(false)}
                cancelButtonProps={{
                    onClick: () => setOpen(false),
                }}
            />
        </>
    );
}
