import { Box, Container } from '@mui/material';
import React from 'react';
import { NavBar, RequireAuthorized } from '../container';
import { ArticleListLoader } from '../functional/ArticleListLoader';
import { ArticleSearchFormComponent } from '../presentational/ArticleSearchFormComponent';
import { ArticlesArea } from '../presentational/ArticlesArea';
import Article from '../../domains/article';
import { ShowArticlePage } from './ShowArticlePage';

export type ListArticlePageProps = {
    onSubmit: (q: string) => Promise<void>;
    onClickArticle: (article: Article) => Promise<void>;
    query?: string;
    skipPages?: number;
};

export function ListArticlePage({
    onSubmit,
    onClickArticle,
    query = '',
    skipPages = 0,
}: ListArticlePageProps) {
    const handleSubmit = React.useCallback(
        async (q: string) => {
            onSubmit(q);
        },
        [onSubmit]
    );
    return (
        <RequireAuthorized>
            <Box
                sx={{
                    height: '100vh',
                }}
            >
                <NavBar>
                    <Container
                        maxWidth="xl"
                        sx={{ mt: 2, display: 'flex', flexDirection: 'column' }}
                    >
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
                                if (loading || !Array.isArray(result)) return <div>検索中...</div>;
                                return (
                                    <ArticlesArea
                                        sx={{ flexGrow: 1 }}
                                        articles={result}
                                        onClickArticle={onClickArticle}
                                    />
                                );
                            }}
                        </ArticleListLoader>
                    </Container>
                </NavBar>
            </Box>
        </RequireAuthorized>
    );
}
