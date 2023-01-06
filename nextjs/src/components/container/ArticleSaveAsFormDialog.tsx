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
    contentTextAreaRef: React.RefObject<HTMLTextAreaElement>;
    cardProps?: CardProps;
    onClickCancelButton?: ButtonProps['onClick'];
    beforeCreateCallback?(params: Partial<Pick<Article, 'title' | 'content'>>): Promise<void>;
    afterCreateCallback?(result: CreateArticleResult): Promise<void>;
} & DialogProps;

export function ArticleSaveAsFormDialog({
    contentTextAreaRef,
    onClickCancelButton,
    beforeCreateCallback = async () => {},
    afterCreateCallback = async () => {},
    ...props
}: ArticleSaveAsFormDialogProps) {
    const { create } = useArticles();
    const titleInputRef = React.useRef<HTMLTextAreaElement>(null);
    const handleSubmit = React.useCallback(
        async (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            const [title, content] = [
                titleInputRef.current?.value,
                contentTextAreaRef.current?.value,
            ];
            await beforeCreateCallback({
                title,
                content,
            });
            const result = await create({
                title: titleInputRef.current?.value,
                content: contentTextAreaRef.current?.value,
            });
            await afterCreateCallback(result);
        },
        [afterCreateCallback, beforeCreateCallback, contentTextAreaRef, create]
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
                        <CardContent sx={{ display: 'flex', flexDirection: 'row-reverse' }}>
                            <Button
                                disabled={submitting}
                                sx={{ ml: 1 }}
                                type="submit"
                                variant="outlined"
                            >
                                保存
                            </Button>
                            <Button
                                onClick={onClickCancelButton}
                                disabled={submitting}
                                type="button"
                                variant="outlined"
                                color="secondary"
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
