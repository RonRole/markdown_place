import { Save } from '@mui/icons-material';
import { IconButton, IconButtonProps } from '@mui/material';
import React from 'react';
import Article from '../../../domains/article';
import { UpdateArticleResult, useArticles } from '../../hooks';

export type BeforeSaveCallback = (content?: Article['content']) => Promise<void>;
export type AfterSaveCallback = (result: UpdateArticleResult) => Promise<void>;

export type SaveButtonProps = {
    article?: Article;
    contentTextAreaRef: React.RefObject<HTMLTextAreaElement>;
    beforeSaveCallbacks?: (BeforeSaveCallback | undefined)[];
    afterSaveCallbacks?: (AfterSaveCallback | undefined)[];
} & Omit<IconButtonProps, 'onClick'>;

export function SaveButton({
    article,
    contentTextAreaRef,
    beforeSaveCallbacks = [],
    afterSaveCallbacks = [],
    ...props
}: SaveButtonProps) {
    const { update } = useArticles();
    const handleClick = React.useCallback(async () => {
        if (!article) return;
        const content = contentTextAreaRef.current?.value || '';
        beforeSaveCallbacks.forEach(async (callback) => {
            if (callback) await callback(content);
        });
        const result = await update(
            new Article({
                ...article,
                content,
            })
        );
        afterSaveCallbacks.forEach(async (callback) => {
            if (callback) await callback(result);
        });
    }, [afterSaveCallbacks, article, beforeSaveCallbacks, contentTextAreaRef, update]);
    return (
        <IconButton onClick={handleClick} {...props} disabled={!article || props.disabled}>
            <Save />
        </IconButton>
    );
}
