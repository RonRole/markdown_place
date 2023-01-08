import React from 'react';
import { Edit } from '@mui/icons-material';
import Article from '../../domains/article';
import { NavBar, RequireAuthorized } from '../container';
import { ArticleLoader } from '../functional/ArticleLoader';
import { ParsedMarkdown } from '../presentational/ParsedMarkdown';
import { EditArticleFormPage } from './EditArticleFormPage';
import { ErrorPage } from './ErrorPage';
import { LoadingPage } from './LoadingPage';
import { Grid, List, ListItemButton } from '@mui/material';

export type ShowArticlePageProps = {
    articleId: Article['id'];
};

export function ShowArticlePage({ articleId }: ShowArticlePageProps) {
    const [editting, setEditting] = React.useState<boolean>(false);
    const handleStartEdit = React.useCallback(() => {
        setEditting(true);
    }, []);
    if (Number.isNaN(articleId)) return <></>;
    return (
        <RequireAuthorized>
            <ArticleLoader id={articleId}>
                {(loading, loadResult) => {
                    if (loading) return <LoadingPage />;
                    if (loadResult === null)
                        return <ErrorPage errorMessage="記事が見つかりませんでした" />;
                    if (!(loadResult instanceof Article))
                        return <ErrorPage errorMessage={loadResult.id} />;
                    if (editting)
                        return (
                            <EditArticleFormPage initialArticle={loadResult} initialMode="update" />
                        );
                    return (
                        <NavBar>
                            <Grid container>
                                <Grid item xs={2}>
                                    <List>
                                        <ListItemButton onClick={handleStartEdit}>
                                            <Edit />
                                            編集
                                        </ListItemButton>
                                    </List>
                                </Grid>
                                <Grid item xs={8}>
                                    <ParsedMarkdown markdownSrc={loadResult.content} />
                                </Grid>
                                <Grid item xs={2}></Grid>
                            </Grid>
                        </NavBar>
                    );
                }}
            </ArticleLoader>
        </RequireAuthorized>
    );
}
