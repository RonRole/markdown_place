import { Label } from '@mui/icons-material';
import { Autocomplete, IconButton, IconButtonProps, Stack, TextField } from '@mui/material';
import React from 'react';
import { ConfirmDialog } from '../../presentational/ConfirmDialog';
import { SetArticleTagsDialog, SetArticleTagsDialogProps } from '../SetArticleTagsDialog';

export type SetArticleTagsButtonProps = Pick<
    SetArticleTagsDialogProps,
    'article' | 'beforeSetArticleTagsCallbacks' | 'afterSetArticleTagsCallbacks'
> &
    Omit<IconButtonProps, 'onClick'>;

export function SetArticleTagsButton({
    article,
    beforeSetArticleTagsCallbacks,
    afterSetArticleTagsCallbacks,
    ...props
}: SetArticleTagsButtonProps) {
    const [open, setOpen] = React.useState(false);
    return (
        <>
            <IconButton {...props} onClick={() => setOpen(true)}>
                <Label />
            </IconButton>
            <SetArticleTagsDialog
                article={article}
                beforeSetArticleTagsCallbacks={beforeSetArticleTagsCallbacks}
                afterSetArticleTagsCallbacks={afterSetArticleTagsCallbacks}
                open={open}
                onClose={() => setOpen(false)}
            />
        </>
    );
}
