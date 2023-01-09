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
    const skipPages = parseQueryItemToNumber(router.query['skip-pages']);
    const onSubmit = React.useCallback(
        async (value = '') => {
            router.push(`/articles?q=${encodeURIComponent(value)}&skip-pages=0`);
            return;
        },
        [router]
    );
    const onClickArticle = React.useCallback(
        async (articleId: Article['id']) => {
            router.push(`/articles/${encodeURIComponent(articleId)}`);
        },
        [router]
    );
    return (
        <ListArticlePage
            onSubmit={onSubmit}
            query={q}
            skipPages={skipPages}
            onClickArticle={onClickArticle}
        />
    );
}
