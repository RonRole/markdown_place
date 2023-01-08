import { Container } from '@mui/material';
import React from 'react';
import { NavBar, RequireAuthorized } from '../container';
import { ArticleListLoader } from '../functional/ArticleListLoader';
import { ArticleSearchFormComponent } from '../presentational/ArticleSearchFormComponent';
import { ErrorPage } from './ErrorPage';
import { LoadingPage } from './LoadingPage';
import ArticleCard from '../presentational/ArticleCard';
import Article from '../../domains/article';
import { ArticleCardsArea } from '../presentational/ArticleCardsArea';

export type ListArticlePageProps = {
    onSubmit: (q: string) => Promise<void>;
    query?: string;
    skipPages?: number;
    onClickArticle?: (id: Article['id']) => Promise<void>;
};

export function ListArticlePage({
    onSubmit,
    query = '',
    skipPages = 0,
    onClickArticle,
}: ListArticlePageProps) {
    const handleSubmit = React.useCallback(
        async (q: string) => {
            onSubmit(q);
        },
        [onSubmit]
    );
    return (
        <RequireAuthorized>
            <NavBar>
                <Container maxWidth="xl" sx={{ mt: 2 }}>
                    <Container
                        maxWidth="sm"
                        sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}
                    >
                        <ArticleSearchFormComponent
                            textFieldProps={{
                                fullWidth: true,
                            }}
                            style={{
                                width: '100%',
                            }}
                            onSubmit={handleSubmit}
                        />
                    </Container>
                    <ArticleListLoader q={query} skipPages={skipPages}>
                        {(loading, result) => {
                            if (loading) return <div>検索中...</div>;
                            if (!Array.isArray(result))
                                return <ErrorPage errorMessage="error occurs" />;
                            return (
                                <ArticleCardsArea
                                    articles={result}
                                    onClickArticle={onClickArticle}
                                />
                            );
                        }}
                    </ArticleListLoader>
                </Container>
            </NavBar>
        </RequireAuthorized>
    );
}
