import { Label } from '@mui/icons-material';
import { Autocomplete, IconButton, IconButtonProps, Stack, TextField } from '@mui/material';
import React from 'react';
import { ConfirmDialog } from '../../presentational/ConfirmDialog';
import { SetArticleTagsDialog, SetArticleTagsDialogProps } from '../SetArticleTagsDialog';

export type SetArticleTagsButtonProps = Pick<
    SetArticleTagsDialogProps,
    'article' | 'tagOptions' | 'beforeSetArticleTagsCallbacks' | 'afterSetArticleTagsCallbacks'
> &
    Omit<IconButtonProps, 'onClick'>;

export function SetArticleTagsButton({
    article,
    tagOptions,
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
                tagOptions={tagOptions}
                beforeSetArticleTagsCallbacks={beforeSetArticleTagsCallbacks}
                afterSetArticleTagsCallbacks={afterSetArticleTagsCallbacks}
                open={open}
                onClose={() => setOpen(false)}
            />
        </>
    );
}
