import React from 'react';
import Article from '../../domains/article';
import { InputError } from '../../errors';
import { useArticles } from '../hooks';

type LoadResult = Article | InputError<Pick<Article, 'id'>> | null;

export type ArticleLoaderProps = {
    id: Article['id'];
    children: (loading: boolean, loadResult: LoadResult) => React.ReactNode;
};

export function ArticleLoader({ id, children }: ArticleLoaderProps) {
    const { show } = useArticles();
    const [loading, setLoading] = React.useState<boolean>(false);
    const [loadResult, setLoadResult] = React.useState<LoadResult>(null);
    React.useEffect(() => {
        setLoading(true);
        show(id)
            .then((value) => setLoadResult(value))
            .finally(() => setLoading(false));
    }, [id, show]);
    const component = React.useMemo(
        () => children(loading, loadResult),
        [children, loadResult, loading]
    );
    return <>{component}</>;
}
