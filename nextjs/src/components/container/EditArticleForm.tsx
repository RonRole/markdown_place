import React from 'react';
import { CreateArticleResult, UpdateArticleResult } from '../hooks';
import Article from '../../domains/article';
import { AuthContext, AuthContextProvider } from '../context';
import { EditArticleFormPage, EditArticleModeKey } from '../pages/EditArticleFormPage';

export type EditArticleFormProps = {
    initialMode: EditArticleModeKey;
    initialArticle?: Article;
};

export function EditArticleForm({ initialMode, initialArticle }: EditArticleFormProps) {
    const [article, setArticle] = React.useState<Article | undefined>(initialArticle);
    const [mode, setMode] = React.useState<EditArticleModeKey>(initialMode);
    const afterCreateCallback = React.useCallback(async (result: CreateArticleResult) => {
        if (result instanceof Article) {
            setArticle(result);
            setMode('update');
            alert('作成しました');
        } else {
            alert('作成できませんでした');
        }
    }, []);
    const afterUpdateCallback = React.useCallback(async (result: UpdateArticleResult) => {
        if (result === true) {
            alert('更新しました');
        } else {
            alert('更新に失敗しました');
        }
        return;
    }, []);
    return (
        <AuthContext.Consumer>
            {({ currentAuthStatus }) => (
                <EditArticleFormPage
                    article={article}
                    mode={currentAuthStatus === 'unauthorized' ? 'unauthorized' : mode}
                    afterSaveCallback={afterUpdateCallback}
                    afterCreateCallback={afterCreateCallback}
                />
            )}
        </AuthContext.Consumer>
    );
}
