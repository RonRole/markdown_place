import { Button, Grid } from '@mui/material';
import { Container } from '@mui/system';
import Link from 'next/link';
import React from 'react';
import { ArticleSearchForm, RequireAuthorized } from '../../components/container';
import { EditNewArticleDialogContext } from '../../components/context/EditNewArticleDialogContextProvider';
import { ArticleListLoader } from '../../components/functional/ArticleListLoader';
import { ListArticleParams, ListArticleResult, useArticles } from '../../components/hooks';
import { LoadingPage } from '../../components/pages';
import { ErrorPage } from '../../components/pages/ErrorPage';
import ArticleCard from '../../components/presentational/ArticleCard';
import Article from '../../domains/article';

export default function Articles() {
    const [articles, setArticles] = React.useState<Article[]>([]);
    const onSubmit = React.useCallback(async (result: ListArticleResult) => {
        if (Array.isArray(result)) {
            setArticles(() => result);
            return;
        }
    }, []);
    return (
        <RequireAuthorized>
            <EditNewArticleDialogContext.Consumer>
                {({ open, close }) => (
                    <Container maxWidth="xl" sx={{ mt: 2 }}>
                        <Container
                            maxWidth="sm"
                            sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}
                        >
                            <ArticleSearchForm
                                textFieldProps={{
                                    fullWidth: true,
                                }}
                                style={{
                                    width: '100%',
                                }}
                                onSubmit={onSubmit}
                                listItemCount={20}
                                skipPages={0}
                            />
                        </Container>
                        <ArticleListLoader count={20} skipPages={0}>
                            {(loading, result) => {
                                if (loading) return <LoadingPage />;
                                if (!Array.isArray(result))
                                    return <ErrorPage errorMessage="error occurs" />;
                                return (
                                    <Grid container spacing={1}>
                                        {result.map((article) => (
                                            <Grid xs={2} item key={article.id}>
                                                <Link
                                                    href={`/articles/${encodeURIComponent(
                                                        article.id
                                                    )}`}
                                                    passHref
                                                >
                                                    <ArticleCard
                                                        sx={{
                                                            width: '100%',
                                                            height: '100%',
                                                            overflow: 'hidden',
                                                            whiteSpace: 'nowrap',
                                                            border: '1px solid rgba(0,0,0,0)',
                                                            cursor: 'pointer',
                                                            ':hover': { borderColor: 'blue' },
                                                        }}
                                                        cardContentProps={{
                                                            sx: {
                                                                maxHeight: 275,
                                                            },
                                                        }}
                                                        article={article}
                                                    />
                                                </Link>
                                            </Grid>
                                        ))}
                                    </Grid>
                                );
                            }}
                        </ArticleListLoader>
                    </Container>
                )}
            </EditNewArticleDialogContext.Consumer>
        </RequireAuthorized>
    );
}
