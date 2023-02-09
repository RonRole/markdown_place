import React from 'react';
import { AppBar, Box } from '@mui/material';
import { CreateArticleResult, UpdateArticleResult } from '../hooks';
import Article from '../../domains/article';
import { AuthContext, AuthContextProvider } from '../context';
import { EditArticleForm, EditArticleModeKey } from '../container/EditArticleForm';
import { NavBar } from '../container';
import { ResetArticleTagResult } from '../hooks/article-tag';

export type EditArticleFormPageProps = {
    initialMode: EditArticleModeKey;
    initialArticle?: Article;
};

export function EditArticleFormPage({ initialMode, initialArticle }: EditArticleFormPageProps) {
    const [article, setArticle] = React.useState<Article | undefined>(initialArticle);
    const [mode, setMode] = React.useState<EditArticleModeKey>(initialMode);
    const afterCreateCallback = React.useCallback(async (result: CreateArticleResult) => {
        if (result.isSuccess) {
            setArticle(result.data);
            setMode('update');
            alert('作成しました');
        } else {
            alert('作成できませんでした');
        }
    }, []);
    const afterUpdateCallback = React.useCallback(async (result: UpdateArticleResult) => {
        if (result.isSuccess) {
            alert('更新しました');
        } else {
            alert('更新に失敗しました');
        }
    }, []);
    const afterSetArticleTagsCallback = React.useCallback(
        async (result: ResetArticleTagResult) => {
            if (result.isSuccess) {
                alert('タグを設定しました');
                article &&
                    setArticle(
                        new Article({
                            ...article,
                            tags: result.data,
                        })
                    );
            } else {
                alert('タグの設定に失敗しました');
            }
        },
        [article]
    );
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100vh',
                overflow: 'hidden',
            }}
        >
            <NavBar>
                <EditArticleForm
                    sx={{ flexGrow: 1, overflow: 'hidden' }}
                    article={article}
                    mode={mode}
                    callbacks={{
                        save: {
                            after: afterUpdateCallback,
                        },
                        create: {
                            after: afterCreateCallback,
                        },
                        setTags: {
                            after: afterSetArticleTagsCallback,
                        },
                    }}
                />
            </NavBar>
        </Box>
    );
}
