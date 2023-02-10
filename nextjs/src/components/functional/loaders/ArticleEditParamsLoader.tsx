import React from 'react';
import Article from '../../../domains/article';
import { ListArticleTagResult, useTags } from '../../hooks/tags';
import { ShowArticleResult, useArticles } from '../../hooks';
import { ReloadOnAuthStatusChangedLoader } from './ReloadOnAuthStatusChangedLoader';
import { LoaderProps } from './Loader';

export type LoadResult = {
    article: ShowArticleResult;
    tags: ListArticleTagResult;
} | null;

export type ArticleEditParamsLoaderProps = {
    id: Article['id'];
} & Pick<LoaderProps<LoadResult>, 'children'>;

export function ArticleEditParamsLoader({ id, children }: ArticleEditParamsLoaderProps) {
    const { show } = useArticles();
    const { list } = useTags();
    const load = React.useCallback(async (): Promise<LoadResult> => {
        const [article, tags] = await Promise.all([show(id), list({})]);
        return {
            article,
            tags,
        };
    }, [id, list, show]);
    return (
        <ReloadOnAuthStatusChangedLoader load={load}>{children}</ReloadOnAuthStatusChangedLoader>
    );
}
