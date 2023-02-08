import { useRouter } from 'next/router';
import React from 'react';
import { ListArticlePage } from '../../components/pages/ListArticlePage';
import {
    ListArticlePageWrapper,
    ProvideParams,
} from '../../components/functional/ListArticlePageWrapper';
import Article from '../../domains/article';
import { RequireAuthorized } from '../../components/container';

const parseQueryItemToNumber = (queryItem: string | string[] | undefined, defaultValue = 0) => {
    return Number.isNaN(Number(queryItem)) ? defaultValue : Number(queryItem);
};

export default function Articles() {
    const router = useRouter();
    const q = router.query['q'] as string;
    const page = parseQueryItemToNumber(router.query['page'], 1);
    const [onEditArticle, onChangePage] = [
        React.useCallback(
            async (article: Article) => {
                router.push(`/articles/${encodeURIComponent(article.id)}/edit`);
            },
            [router]
        ),
        React.useCallback(
            async (page: number) => {
                router.push(`/articles?q=${q || ''}&page=${page}`);
            },
            [q, router]
        ),
    ];
    return (
        <RequireAuthorized>
            <ListArticlePageWrapper q={q} page={page}>
                {({ articles, page, pageCount, loading, afterDeleteCallback }: ProvideParams) => (
                    <ListArticlePage
                        articles={articles}
                        page={page}
                        pageCount={pageCount}
                        disabled={loading}
                        afterDeleteCallback={afterDeleteCallback}
                        onEditArticle={onEditArticle}
                        onChangePage={onChangePage}
                    />
                )}
            </ListArticlePageWrapper>
        </RequireAuthorized>
    );
}
