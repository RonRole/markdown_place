import React from 'react';
import Article from '../../domains/article';
import { ShowArticleResult, useArticles } from '../hooks';
import { ListArticleTagResult, useTags } from '../hooks/tags';

export type LoadResult = {
    article: ShowArticleResult;
    tags: ListArticleTagResult;
} | null;

export type ArticleEditParamsLoaderProps = {
    id: Article['id'];
    children: (loading: boolean, loadResult: LoadResult) => React.ReactNode;
};

export function ArticleEditParamsLoader({ id, children }: ArticleEditParamsLoaderProps) {
    const { show } = useArticles();
    const { list } = useTags();
    const [loading, setLoading] = React.useState<boolean>(false);
    const [loadResult, setLoadResult] = React.useState<LoadResult>(null);
    React.useEffect(() => {
        setLoading(true);
        Promise.all([show(id), list({})])
            .then(([showArticleResult, listTagsResult]) => {
                setLoadResult({
                    article: showArticleResult,
                    tags: listTagsResult,
                });
            })
            .finally(() => setLoading(false));
    }, [id, list, show]);
    const component = React.useMemo(
        () => children(loading, loadResult),
        [children, loadResult, loading]
    );
    return <>{component}</>;
}
