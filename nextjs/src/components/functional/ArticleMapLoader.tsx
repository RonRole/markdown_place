import React from 'react';
import Article from '../../domains/article';
import { InputError } from '../../errors';
import { ListArticleParams, ListArticleResult, useArticles } from '../hooks';
import { ApiResponse } from '../hooks/api-response';

export type ArticleMapResult = ApiResponse<
    { articles: { [key: Article['id']]: Article }; pageCount: number },
    InputError<ListArticleParams>
>;

export type ArticleMapLoaderProps = {
    children(loading: boolean, result: ArticleMapResult): React.ReactNode;
} & ListArticleParams;

export function ArticleMapLoader({ q, page, children }: ArticleMapLoaderProps) {
    const { list } = useArticles();
    const [loading, setLoading] = React.useState<boolean>(false);
    const [result, setResult] = React.useState<ArticleMapResult>({
        isSuccess: false,
        data: {},
    });
    React.useEffect(() => {
        setLoading(true);
        list({ q, page })
            .then((result: ListArticleResult) => {
                if (result.isSuccess) {
                    const articles = result.data.articles.reduce((pre, cur) => {
                        pre[cur.id] = cur;
                        return pre;
                    }, {} as { [key: Article['id']]: Article });
                    setResult({
                        isSuccess: true,
                        data: {
                            articles,
                            pageCount: result.data.pageCount,
                        },
                    });
                }
            })
            .finally(() => setLoading(false));
    }, [list, q, page]);
    const component = React.useMemo(() => children(loading, result), [children, loading, result]);
    return <>{component}</>;
}
