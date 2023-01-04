import React from 'react';
import { ListArticleParams, ListArticleResult, useArticles } from '../hooks';

export type ArticleListLoaderProps = {
    children(loading: boolean, result: ListArticleResult): React.ReactNode;
} & ListArticleParams;

export function ArticleListLoader({ skipPages = 0, children }: ArticleListLoaderProps) {
    const { list } = useArticles();
    const [loading, setLoading] = React.useState<boolean>(false);
    const [result, setResult] = React.useState<ListArticleResult>([]);
    React.useEffect(() => {
        setLoading(true);
        list({ skipPages })
            .then((result: ListArticleResult) => setResult(result))
            .finally(() => setLoading(false));
    }, [list, skipPages]);
    const component = React.useMemo(() => children(loading, result), [children, loading, result]);
    return <>{component}</>;
}
