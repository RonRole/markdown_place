import { SaveAs } from '@mui/icons-material';
import { ButtonProps, IconButton, IconButtonProps, Tooltip } from '@mui/material';
import React from 'react';
import Article from '../../../domains/article';
import { CreateArticleResult } from '../../hooks';
import { ArticleSaveAsFormDialog, ArticleSaveAsFormDialogProps } from '../ArticleSaveAsFormDialog';

export type SaveAsButtonProps = Omit<IconButtonProps, 'onClick'> & ArticleSaveAsFormDialogProps;

export const SaveAsButton = ({
    contentTextAreaRef,
    beforeCreateCallback,
    afterCreateCallback = async () => {},
    ...props
}: SaveAsButtonProps) => {
    const [open, setOpen] = React.useState<boolean>(false);
    const handleOpen = React.useCallback(() => setOpen(true), []);
    const handleClose = React.useCallback(() => setOpen(false), []);
    const handleCreate = React.useCallback(
        async (result: CreateArticleResult) => {
            await afterCreateCallback(result);
            if (result instanceof Article) {
                setOpen(false);
            }
        },
        [afterCreateCallback]
    );
    return (
        <>
            <IconButton {...props} onClick={handleOpen}>
                <SaveAs />
            </IconButton>
            <ArticleSaveAsFormDialog
                fullWidth
                maxWidth="xs"
                open={open}
                onClose={handleClose}
                contentTextAreaRef={contentTextAreaRef}
                beforeCreateCallback={beforeCreateCallback}
                afterCreateCallback={handleCreate}
                onClickCancelButton={handleClose}
            />
        </>
    );
};
