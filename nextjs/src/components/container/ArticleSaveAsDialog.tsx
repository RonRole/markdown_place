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
import { useFormWithValidation, Validate, ValidationRules } from '../hooks/form-with-validation';
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

type ArticleSaveAsFormValidationSettings = {
    [key in 'title']: Validate;
};

const articleSaveAsFormValidations: ArticleSaveAsFormValidationSettings = {
    title: ValidationRules.NO_CHECK,
};

export function ArticleSaveAsFormDialog({
    contentTextAreaRef,
    onClickCancelButton,
    beforeCreateCallbacks = [],
    afterCreateCallbacks = [],
    ...props
}: ArticleSaveAsFormDialogProps) {
    const { create } = useArticles();
    const [submitting, setSubmitting] = React.useState<boolean>(false);
    const { refs, validate, validateResults, clearValidateResults, setValidateResults } =
        useFormWithValidation(articleSaveAsFormValidations);
    const onClickOk = React.useCallback(async () => {
        setSubmitting(true);
        const [title, content] = [refs.title.current?.value, contentTextAreaRef.current?.value];
        clearValidateResults();
        if (!validate()) {
            return;
        }
        beforeCreateCallbacks.forEach(async (callback) => {
            if (callback) await callback({ title, content });
        });
        const result = await create({
            title,
            content,
        });
        if (!result.isSuccess) {
            setValidateResults({
                title: { isValid: !result.data.title, messages: result.data.title },
            });
        }
        afterCreateCallbacks.forEach(async (callback) => {
            if (callback) await callback(result);
        });
        setSubmitting(false);
    }, [
        afterCreateCallbacks,
        beforeCreateCallbacks,
        clearValidateResults,
        contentTextAreaRef,
        create,
        refs.title,
        setValidateResults,
        validate,
    ]);
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
                inputRef={refs.title}
                error={!validateResults.title.isValid}
                helperText={validateResults.title.messages}
                fullWidth
            />
        </ConfirmDialog>
    );
}
