import { Box, Container } from '@mui/material';
import React from 'react';
import { NavBar, RequireAuthorized } from '../container';
import { ArticleListLoader } from '../functional/ArticleListLoader';
import { ArticleSearchFormComponent } from '../presentational/ArticleSearchFormComponent';
import { ArticlesArea } from '../presentational/ArticlesArea';
import Article from '../../domains/article';

export type ListArticlePageProps = {
    onSubmit: (q: string) => Promise<void>;
    onClickArticle: (article: Article) => Promise<void>;
    query?: string;
    page?: number;
    onChangePage: (page: number) => Promise<void>;
};

export function ListArticlePage({
    onSubmit,
    onClickArticle,
    query = '',
    page,
    onChangePage,
}: ListArticlePageProps) {
    const handleSubmit = React.useCallback(
        async (q: string) => {
            onSubmit(q);
        },
        [onSubmit]
    );
    const [articleAreaOffsetY, setArticleAreaOffsetY] = React.useState<number>(0);
    React.useEffect(() => {
        const articlesArea = document.getElementById('articles_area');
        if (articlesArea) {
            setArticleAreaOffsetY(articlesArea.offsetTop);
        }
    }, []);
    return (
        <RequireAuthorized>
            <Box
                sx={{
                    height: '100vh',
                    overflow: 'hidden',
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
                        <ArticleListLoader q={query} page={page}>
                            {(loading, result) => {
                                return (
                                    <ArticlesArea
                                        id="articles_area"
                                        pageCount={
                                            result.isSuccess ? result.data.pageCount : undefined
                                        }
                                        sx={{
                                            flexGrow: 1,
                                            overflow: 'scroll',
                                            height: `calc(100vh - ${articleAreaOffsetY}px)`,
                                        }}
                                        loading={loading || !result.isSuccess}
                                        page={page}
                                        onChangePage={onChangePage}
                                        articles={
                                            result.isSuccess ? result.data.articles : undefined
                                        }
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
