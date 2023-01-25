import React from 'react';
import { ListArticleParams, ListArticleResult, useArticles } from '../hooks';

export type ArticleListLoaderProps = {
    children(loading: boolean, result: ListArticleResult): React.ReactNode;
} & ListArticleParams;

export function ArticleListLoader({ q, page, children }: ArticleListLoaderProps) {
    const { list } = useArticles();
    const [loading, setLoading] = React.useState<boolean>(false);
    const [result, setResult] = React.useState<ListArticleResult>({
        isSuccess: true,
        data: { articles: [], pageCount: 0 },
    });
    React.useEffect(() => {
        setLoading(true);
        list({ q, page })
            .then((result: ListArticleResult) => setResult(result))
            .finally(() => setLoading(false));
    }, [list, q, page]);
    const component = React.useMemo(() => children(loading, result), [children, loading, result]);
    return <>{component}</>;
}
