import { Box, Container } from '@mui/material';
import React from 'react';
import { NavBar, RequireAuthorized } from '../container';
import { ArticleListLoader } from '../functional/ArticleListLoader';
import { ArticlesArea } from '../presentational/ArticlesArea';
import Article from '../../domains/article';

export type ListArticlePageProps = {
    query?: string;
    page?: number;
    onChangePage: (page: number) => Promise<void>;
    onEditArticle: (article: Article) => Promise<void>;
};

export function ListArticlePage({
    query = '',
    page,
    onChangePage,
    onEditArticle,
}: ListArticlePageProps) {
    return (
        <RequireAuthorized>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100vh',
                    overflow: 'hidden',
                }}
            >
                <NavBar>
                    <ArticleListLoader q={query} page={page}>
                        {(loading, result) => {
                            return (
                                <ArticlesArea
                                    id="articles_area"
                                    pageCount={result.isSuccess ? result.data.pageCount : undefined}
                                    sx={{
                                        flexGrow: 1,
                                        overflow: 'scroll',
                                        height: '100%',
                                    }}
                                    mt={1}
                                    pl={2}
                                    disabled={loading || !result.isSuccess}
                                    page={page}
                                    onChangePage={onChangePage}
                                    articles={result.isSuccess ? result.data.articles : undefined}
                                    onEditArticle={onEditArticle}
                                />
                            );
                        }}
                    </ArticleListLoader>
                </NavBar>
            </Box>
        </RequireAuthorized>
    );
}
