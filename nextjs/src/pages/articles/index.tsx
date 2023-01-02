import { Button, Grid } from '@mui/material';
import { Container } from '@mui/system';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { ArticleSearchForm, RequireAuthorized } from '../../components/container';
import { EditNewArticleDialogContext } from '../../components/context/EditNewArticleDialogContextProvider';
import { ArticleListLoader } from '../../components/functional/ArticleListLoader';
import { ListArticleParams, ListArticleResult, useArticles } from '../../components/hooks';
import { LoadingPage } from '../../components/pages';
import { ErrorPage } from '../../components/pages/ErrorPage';
import ArticleCard from '../../components/presentational/ArticleCard';

export default function Articles() {
    const router = useRouter();
    const onSubmit = React.useCallback(
        async (result: ListArticleResult) => {
            if (Array.isArray(result)) {
                router.push('/articles');
                return;
            }
        },
        [router]
    );
    return (
        <RequireAuthorized>
            <Container maxWidth="xl" sx={{ mt: 2 }}>
                <Container maxWidth="sm" sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
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
                <ArticleListLoader count={12} skipPages={0}>
                    {(loading, result) => {
                        if (loading) return <LoadingPage />;
                        if (!Array.isArray(result))
                            return <ErrorPage errorMessage="error occurs" />;
                        return (
                            <Grid container spacing={1}>
                                {result.map((article) => (
                                    <Grid xs={2} item key={article.id}>
                                        <Link
                                            href={`/articles/${encodeURIComponent(article.id)}`}
                                            passHref
                                        >
                                            <ArticleCard
                                                sx={{
                                                    width: '100%',
                                                    height: '100%',
                                                    overflow: 'hidden',
                                                    whiteSpace: 'nowrap',
                                                    cursor: 'pointer',
                                                    ':hover': { borderColor: 'blue' },
                                                }}
                                                variant="outlined"
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
        </RequireAuthorized>
    );
}
