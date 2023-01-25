import { useRouter } from 'next/router';
import React from 'react';
import { ListArticlePage } from '../../components/pages/ListArticlePage';
import Article from '../../domains/article';

const parseQueryItemToNumber = (queryItem: string | string[] | undefined, defaultValue = 0) => {
    return Number.isNaN(Number(queryItem)) ? defaultValue : Number(queryItem);
};

export default function Articles() {
    const router = useRouter();
    const q = router.query['q'] as string;
    const page = parseQueryItemToNumber(router.query['page'], 1);
    const onSubmit = React.useCallback(
        async (value = '') => {
            router.push(`/articles?q=${encodeURIComponent(value)}&page=1`);
            return;
        },
        [router]
    );
    const onClickArticle = React.useCallback(
        async (article: Article) => {
            router.push(`/articles/${encodeURIComponent(article.id)}`);
        },
        [router]
    );
    const onChangePage = React.useCallback(
        async (page: number) => {
            router.push(`/articles?q=${q || ''}&page=${page}`);
        },
        [q, router]
    );
    return (
        <ListArticlePage
            onSubmit={onSubmit}
            query={q}
            page={page}
            onClickArticle={onClickArticle}
            onChangePage={onChangePage}
        />
    );
}
