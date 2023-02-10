import React from 'react';
import { ListArticleParams, ListArticleResult, useArticles } from '../../hooks';
import { Loader, LoaderProps } from './Loader';
import { ReloadOnAuthStatusChangedLoader } from './ReloadOnAuthStatusChangedLoader';

export type ArticleListLoaderProps = Pick<LoaderProps<ListArticleResult>, 'children'> &
    ListArticleParams;

export function ArticleListLoader({ q, page, children }: ArticleListLoaderProps) {
    const { list } = useArticles();
    const load = React.useCallback(() => list({ q, page }), [list, page, q]);
    return (
        <ReloadOnAuthStatusChangedLoader load={load}>{children}</ReloadOnAuthStatusChangedLoader>
    );
}
