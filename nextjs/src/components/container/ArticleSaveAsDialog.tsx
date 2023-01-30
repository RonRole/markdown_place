import {
    Button,
    ButtonProps,
    Card,
    CardContent,
    CardHeader,
    CardProps,
    Dialog,
    DialogProps,
    FormControl,
    FormLabel,
    TextField,
} from '@mui/material';
import React from 'react';
import Article from '../../domains/article';
import { CreateArticleResult, useArticles } from '../hooks';
import { ConfirmDialog } from '../presentational/ConfirmDialog';

export type BeforeCreateCallback = (
    params: Partial<Pick<Article, 'title' | 'content'>>
) => Promise<void>;
export type AfterCreateCallback = (result: CreateArticleResult) => Promise<void>;

export type ArticleSaveAsFormDialogProps = {
    contentTextAreaRef: React.RefObject<HTMLTextAreaElement>;
    cardProps?: CardProps;
    onClickCancelButton?: ButtonProps['onClick'];
    beforeCreateCallbacks: (BeforeCreateCallback | undefined)[];
    afterCreateCallbacks: (AfterCreateCallback | undefined)[];
} & DialogProps;

export function ArticleSaveAsFormDialog({
    contentTextAreaRef,
    onClickCancelButton,
    beforeCreateCallbacks = [],
    afterCreateCallbacks = [],
    ...props
}: ArticleSaveAsFormDialogProps) {
    const { create } = useArticles();
    const [submitting, setSubmitting] = React.useState<boolean>(false);
    const titleInputRef = React.useRef<HTMLTextAreaElement>(null);
    const onClickOk = React.useCallback(async () => {
        setSubmitting(true);
        const [title, content] = [titleInputRef.current?.value, contentTextAreaRef.current?.value];
        beforeCreateCallbacks.forEach(async (callback) => {
            if (callback) await callback({ title, content });
        });
        const result = await create({
            title: titleInputRef.current?.value,
            content: contentTextAreaRef.current?.value,
        });
        afterCreateCallbacks.forEach(async (callback) => {
            if (callback) await callback(result);
        });
        setSubmitting(false);
    }, [afterCreateCallbacks, beforeCreateCallbacks, contentTextAreaRef, create]);
    return (
        <ConfirmDialog
            message="新しいタイトルで保存"
            disabled={submitting}
            okButtonProps={{
                onClick: onClickOk,
                type: 'submit',
            }}
            cancelButtonProps={{
                onClick: onClickCancelButton,
            }}
            {...props}
        >
            <TextField
                placeholder="タイトルを入力"
                disabled={submitting}
                inputRef={titleInputRef}
                fullWidth
            />
        </ConfirmDialog>
    );
}
