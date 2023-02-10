import React from 'react';
import { Edit } from '@mui/icons-material';
import Article from '../../domains/article';
import { NavBar, RequireAuthorized } from '../container';
import { EditArticleFormPage } from './EditArticleFormPage';
import { Grid, List, ListItemButton, Box } from '@mui/material';
import { ArticleMarkdown } from '../presentational/ArticleMarkdown';
import { ArticleLoader } from '../functional/loaders/ArticleLoader';

export type ShowArticlePageProps = {
    articleId: Article['id'];
};

export function ShowArticlePage({ articleId }: ShowArticlePageProps) {
    const [editting, setEditting] = React.useState<boolean>(false);
    const handleStartEdit = React.useCallback(() => {
        setEditting(true);
    }, []);
    return (
        <ArticleLoader id={articleId}>
            {(loading, loadResult) => {
                if (loadResult?.isSuccess && editting)
                    return (
                        <EditArticleFormPage
                            initialArticle={loadResult.data}
                            initialMode="update"
                        />
                    );
                return (
                    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
                        <NavBar>
                            <Grid
                                container
                                sx={{ flexGrow: 1, overflow: 'hidden', height: '100%' }}
                            >
                                <Grid item xs={2} sx={{ height: '100%' }}>
                                    <List>
                                        <ListItemButton
                                            onClick={handleStartEdit}
                                            disabled={loading}
                                        >
                                            <Edit />
                                            編集
                                        </ListItemButton>
                                    </List>
                                </Grid>
                                <Grid item xs={8} sx={{ height: '100%', overflow: 'scroll' }}>
                                    {loading && <div>読み込み中...</div>}
                                    {loadResult?.isSuccess && (
                                        <ArticleMarkdown article={loadResult.data} />
                                    )}
                                </Grid>
                                <Grid item xs={2}></Grid>
                            </Grid>
                        </NavBar>
                    </Box>
                );
            }}
        </ArticleLoader>
    );
}
