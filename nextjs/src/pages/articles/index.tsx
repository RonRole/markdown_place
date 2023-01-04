import { Button, Grid } from '@mui/material';
import { Container } from '@mui/system';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { ArticleListSearchForm, RequireAuthorized } from '../../components/container';
import { ArticleListLoader } from '../../components/functional/ArticleListLoader';
import { LoadingPage } from '../../components/pages';
import { ErrorPage } from '../../components/pages/ErrorPage';
import ArticleCard from '../../components/presentational/ArticleCard';
import { ArticleSearchFormComponent } from '../../components/presentational/ArticleSearchFormComponent';

const parseQueryItemToNumber = (queryItem: string | string[] | undefined, defaultValue = 0) => {
    return Number.isNaN(Number(queryItem)) ? defaultValue : Number(queryItem);
};

export default function Articles() {
    const router = useRouter();
    const skipPages = parseQueryItemToNumber(router.query['skip-pages']);
    const onSubmit = React.useCallback(
        async (value = '') => {
            router.push(`/articles?q=${encodeURIComponent(value)}&skip-pages=0&count=3`);
            return;
        },
        [router]
    );
    return (
        <RequireAuthorized>
            <Container maxWidth="xl" sx={{ mt: 2 }}>
                <Container maxWidth="sm" sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                    <ArticleSearchFormComponent
                        textFieldProps={{
                            fullWidth: true,
                        }}
                        style={{
                            width: '100%',
                        }}
                        onSubmit={onSubmit}
                    />
                </Container>
                <ArticleListLoader skipPages={skipPages}>
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
