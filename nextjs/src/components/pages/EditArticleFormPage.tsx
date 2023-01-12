import React from 'react';
import { Box } from '@mui/material';
import { CreateArticleResult, UpdateArticleResult } from '../hooks';
import Article from '../../domains/article';
import { AuthContext, AuthContextProvider } from '../context';
import { EditArticleForm, EditArticleModeKey } from '../container/EditArticleForm';
import { NavBar } from '../container';

export type EditArticleFormPageProps = {
    initialMode: EditArticleModeKey;
    initialArticle?: Article;
};

export function EditArticleFormPage({ initialMode, initialArticle }: EditArticleFormPageProps) {
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
                            gridContainerProps={{
                                sx: { flexGrow: 1, overflow: 'hidden' },
                            }}
                            article={article}
                            mode={currentAuthStatus.isFixedAsAuthorized ? mode : 'unauthorized'}
                            afterSaveCallback={afterUpdateCallback}
                            afterCreateCallback={afterCreateCallback}
                        />
                    </NavBar>
                </Box>
            )}
        </AuthContext.Consumer>
    );
}
