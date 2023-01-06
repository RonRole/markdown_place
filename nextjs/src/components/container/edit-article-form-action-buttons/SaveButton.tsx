import { Save } from '@mui/icons-material';
import { IconButton, IconButtonProps } from '@mui/material';
import React from 'react';
import Article from '../../../domains/article';
import { UpdateArticleResult, useArticles } from '../../hooks';

export type SaveButtonProps = {
    article?: Article;
    contentTextAreaRef: React.RefObject<HTMLTextAreaElement>;
    beforeSaveCallback?(content?: Article['content']): Promise<void>;
    afterSaveCallback?(result: UpdateArticleResult): Promise<void>;
} & Omit<IconButtonProps, 'onClick'>;

export function SaveButton({
    article,
    contentTextAreaRef,
    beforeSaveCallback = async () => {},
    afterSaveCallback = async () => {},
    ...props
}: SaveButtonProps) {
    const { update } = useArticles();
    const handleClick = React.useCallback(async () => {
        if (!article) return;
        const content = contentTextAreaRef.current?.value || '';
        await beforeSaveCallback(content);
        const result = await update(
            new Article({
                ...article,
                content,
            })
        );
        await afterSaveCallback(result);
    }, [afterSaveCallback, article, beforeSaveCallback, contentTextAreaRef, update]);
    return (
        <IconButton onClick={handleClick} {...props} disabled={!article || props.disabled}>
            <Save />
        </IconButton>
    );
}
