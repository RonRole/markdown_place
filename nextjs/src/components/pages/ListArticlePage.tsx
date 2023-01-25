import { Box, Container } from '@mui/material';
import React from 'react';
import { NavBar, RequireAuthorized } from '../container';
import { ArticleListLoader } from '../functional/ArticleListLoader';
import { ArticlesArea } from '../presentational/ArticlesArea';
import Article from '../../domains/article';
import { EditArticleFormPage } from './EditArticleFormPage';

export type ListArticlePageProps = {
    onClickArticle: (article: Article) => Promise<void>;
    query?: string;
    page?: number;
    onChangePage: (page: number) => Promise<void>;
};

export function ListArticlePage({
    onClickArticle,
    query = '',
    page,
    onChangePage,
}: ListArticlePageProps) {
    const [editArticle, setEditArticle] = React.useState<Article | null>(null);
    if (editArticle) {
        return <EditArticleFormPage initialArticle={editArticle} initialMode="update" />;
    }
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
                                    loading={loading || !result.isSuccess}
                                    page={page}
                                    onChangePage={onChangePage}
                                    articles={result.isSuccess ? result.data.articles : undefined}
                                    onClickArticle={onClickArticle}
                                    onEdit={async (article: Article) => setEditArticle(article)}
                                />
                            );
                        }}
                    </ArticleListLoader>
                </NavBar>
            </Box>
        </RequireAuthorized>
    );
}
