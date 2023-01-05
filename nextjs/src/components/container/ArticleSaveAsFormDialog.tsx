import {
    Button,
    ButtonProps,
    Card,
    CardContent,
    CardHeader,
    CardProps,
    Dialog,
    DialogProps,
    TextField,
} from '@mui/material';
import React from 'react';
import Article from '../../domains/article';
import { CreateArticleResult, useArticles } from '../hooks';
import { FormWithSubmittingState } from '../presentational';

export type ArticleSaveAsFormDialogProps = {
    content?: Article['content'];
    cardProps?: CardProps;
    onClickCancelButton?: ButtonProps['onClick'];
    afterCreateCallback?(result: CreateArticleResult): Promise<void>;
} & DialogProps;

export function ArticleSaveAsFormDialog({
    content = '',
    onClickCancelButton,
    afterCreateCallback = async () => {},
    ...props
}: ArticleSaveAsFormDialogProps) {
    const { create } = useArticles();
    const titleInputRef = React.useRef<HTMLInputElement>(null);
    const handleSubmit = React.useCallback(
        async (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            const result = await create({
                title: titleInputRef.current?.value,
                content,
            });
            await afterCreateCallback(result);
        },
        [afterCreateCallback, content, create]
    );
    return (
        <Dialog {...props}>
            <FormWithSubmittingState onSubmit={handleSubmit}>
                {(submitting: boolean) => (
                    <Card>
                        <CardHeader title="新しいタイトルで保存" />
                        <CardContent>
                            <TextField
                                placeholder="タイトルを入力"
                                disabled={submitting}
                                inputRef={titleInputRef}
                                fullWidth
                            />
                        </CardContent>
                        <CardContent sx={{ display: 'flex' }}>
                            <Button
                                disabled={submitting}
                                type="submit"
                                variant="outlined"
                                fullWidth
                            >
                                保存
                            </Button>
                            <Button
                                onClick={onClickCancelButton}
                                disabled={submitting}
                                type="button"
                                variant="outlined"
                                color="secondary"
                                fullWidth
                            >
                                キャンセル
                            </Button>
                        </CardContent>
                    </Card>
                )}
            </FormWithSubmittingState>
        </Dialog>
    );
}
