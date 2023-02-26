import React from 'react';
import { AppBar, Box } from '@mui/material';
import { CreateArticleResult, UpdateArticleResult } from '../hooks';
import Article from '../../domains/article';
import { AuthContext, AuthContextProvider } from '../context';
import {
    EditArticleForm,
    EditArticleFormProps,
    EditArticleModeKey,
} from '../container/EditArticleForm';
import { NavBar } from '../container';
import { ResetArticleTagResult } from '../hooks/article-tag';
import ArticleTag from '../../domains/article-tag';
import { SetArticleTagsButtonProps } from '../container/edit-article-form-action-buttons/SetArticleTagsButton';
import { CreateArticleTagResult } from '../hooks/tags';

export type EditArticleFormPageProps = {
    // 初期の
    initialMode: EditArticleModeKey;
    initialArticle?: Article;
    tagOptions?: ArticleTag[];
};

export function EditArticleFormPage({
    initialMode,
    initialArticle,
    tagOptions,
}: EditArticleFormPageProps) {
    const { currentAuthStatus } = React.useContext(AuthContext);
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
        async (result: CreateArticleTagResult | ResetArticleTagResult) => {
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
                    tagOptions={tagOptions}
                    mode={currentAuthStatus.isFixedAsAuthorized ? mode : 'unauthorized'}
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
