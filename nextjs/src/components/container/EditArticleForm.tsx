import React from 'react';
import { CreateArticleResult, UpdateArticleParams, useArticles } from '../hooks';
import Article from '../../domains/article';
import {
    EditArticleFormPage,
    EditArticleModeKey,
    OnsubmitInput as OnSubmitInput,
} from '../pages/EditArticleFormPage';
import { AuthContext, AuthContextProvider } from '../context';
import AuthStatus from '../../domains/auth-status';
import { ArticleSaveAsFormDialog } from './ArticleSaveAsFormDialog';

export type EditArticleFormProps = {
    article?: Article;
};

type SelectModeParams = {
    authStatus: AuthStatus;
    articleId?: Article['id'];
};

type EdittingItems = {
    id?: Article['id'];
    title?: Article['title'];
    content?: Article['content'];
};

const selectMode = ({ authStatus, articleId }: SelectModeParams): EditArticleModeKey => {
    if (authStatus !== 'authorized') return 'unauthorized';
    if (articleId === undefined) return 'create';
    return 'update';
};

export function EditArticleForm({ article }: EditArticleFormProps) {
    const [currentEdittingItems, setEdittingItems] = React.useState<EdittingItems>({
        id: article?.id,
        title: article?.title,
        content: article?.content,
    });
    const [openSaveAsDialog, setOpenSaveAsDialog] = React.useState<boolean>(false);
    const { update } = useArticles();
    const { currentAuthStatus } = React.useContext(AuthContext);
    const mode = React.useMemo(
        () =>
            selectMode({
                authStatus: currentAuthStatus,
                articleId: currentEdittingItems?.id,
            }),
        [currentAuthStatus, currentEdittingItems?.id]
    );
    const afterArticleCallback = React.useCallback(async (result: CreateArticleResult) => {
        if (result instanceof Article) {
            setEdittingItems(() => {
                return {
                    ...result,
                };
            });
            alert('作成しました');
        } else {
            alert('作成できませんでした');
        }
        setOpenSaveAsDialog(false);
    }, []);
    const handleClose = React.useCallback(() => {
        setOpenSaveAsDialog(false);
    }, []);
    const updateArticle = React.useCallback(
        async ({ id, title, content }: UpdateArticleParams) => {
            const result = await update(
                new Article({
                    id,
                    title,
                    content,
                })
            );
            if (result === true) {
                alert('更新しました');
            } else {
                alert('更新に失敗しました');
            }
            return;
        },
        [update]
    );
    const onSubmit = React.useCallback(
        async ({ submitterId, content }: OnSubmitInput) => {
            switch (submitterId) {
                case 'save':
                    const { id, title } = currentEdittingItems;
                    if (id === undefined || title === undefined) return;
                    await updateArticle({
                        id,
                        title,
                        content,
                    });
                    break;
                case 'saveAs':
                    setEdittingItems(() => {
                        return { ...currentEdittingItems, content };
                    });
                    setOpenSaveAsDialog(true);
                    break;
            }
        },
        [currentEdittingItems, updateArticle]
    );
    return (
        <>
            <EditArticleFormPage defaultInput={article?.content} mode={mode} onSubmit={onSubmit} />;
            <ArticleSaveAsFormDialog
                fullWidth
                maxWidth="xs"
                open={openSaveAsDialog}
                onClose={handleClose}
                content={currentEdittingItems?.content}
                afterCreateCallback={afterArticleCallback}
                onClickCancelButton={handleClose}
            />
        </>
    );
}
