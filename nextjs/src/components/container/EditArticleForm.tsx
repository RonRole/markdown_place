import React from 'react';
import { CreateArticleParams, UpdateArticleParams, useArticles } from '../hooks';
import Article from '../../domains/article';
import {
    EditArticleFormComponent,
    EditArticleModeKey,
    OnsubmitInput as OnSubmitInput,
} from '../pages/EditArticleFormPage';
import { AuthContext, AuthContextProvider } from '../context';
import AuthStatus from '../../domains/auth-status';

export type EditArticleFormProps = {
    article?: Article;
};

type SelectModeParams = {
    authStatus: AuthStatus;
    article?: Article;
};

const selectMode = ({ authStatus, article }: SelectModeParams): EditArticleModeKey => {
    if (authStatus !== 'authorized') return 'unauthorized';
    if (!article) return 'create';
    return 'update';
};

export function EditArticleForm({ article }: EditArticleFormProps) {
    const [currentArticle, setCurrentArticle] = React.useState<undefined | Article>(article);
    const { create, update } = useArticles();
    const { currentAuthStatus } = React.useContext(AuthContext);
    const mode = React.useMemo(
        () =>
            selectMode({
                authStatus: currentAuthStatus,
                article,
            }),
        [article, currentAuthStatus]
    );
    const createArticle = React.useCallback(
        async ({ title, content }: CreateArticleParams) => {
            const result = await create({ title, content });
            if (result instanceof Article) {
                setCurrentArticle(result);
                alert('作成しました');
                return;
            } else {
                alert('作成に失敗しました');
            }
        },
        [create]
    );
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
            const title = content?.split('\n').find((e) => e) || '';
            switch (submitterId) {
                case 'save':
                    if (!currentArticle) return;
                    await updateArticle({
                        ...currentArticle,
                        content,
                    });
                    break;
                case 'saveAs':
                    await createArticle({
                        title,
                        content,
                    });
                    break;
            }
        },
        [createArticle, currentArticle, updateArticle]
    );
    return (
        <EditArticleFormComponent defaultInput={article?.content} mode={mode} onSubmit={onSubmit} />
    );
}
