import { Edit } from '@mui/icons-material';
import { Grid, IconButton, Tooltip } from '@mui/material';
import { useRouter } from 'next/router';
import React from 'react';
import { EditArticleForm, NavBar, RequireAuthorized } from '../../components/container';
import { ArticleLoader } from '../../components/functional/ArticleLoader';
import { LoadingPage } from '../../components/pages';
import { ErrorPage } from '../../components/pages/ErrorPage';
import { ParsedMarkdown } from '../../components/presentational/ParsedMarkdown';
import Article from '../../domains/article';

export default function EditArticlePage() {
    const { articleId } = useRouter().query;
    const [editting, setEditting] = React.useState<boolean>(false);
    const handleStartEdit = React.useCallback(() => {
        setEditting(true);
    }, []);
    if (Number.isNaN(articleId)) return <></>;
    return (
        <RequireAuthorized>
            <ArticleLoader id={Number(articleId)}>
                {(loading, loadResult) => {
                    if (loading) return <LoadingPage />;
                    if (loadResult === null) return <ErrorPage errorMessage="article not found" />;
                    if (!(loadResult instanceof Article))
                        return <ErrorPage errorMessage={loadResult.id} />;
                    if (editting) return <EditArticleForm article={loadResult} />;
                    return (
                        <Grid container>
                            <Grid item xs={2}>
                                <Tooltip title="編集">
                                    <IconButton onClick={handleStartEdit}>
                                        <Edit />
                                    </IconButton>
                                </Tooltip>
                            </Grid>
                            <Grid item xs={8}>
                                <ParsedMarkdown markdownSrc={loadResult.content} />
                            </Grid>
                            <Grid item xs={2}></Grid>
                        </Grid>
                    );
                }}
            </ArticleLoader>
        </RequireAuthorized>
    );
}
