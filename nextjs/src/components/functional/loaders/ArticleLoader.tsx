import React from 'react';
import { AuthStatus } from '../../../domains/auth-status';
import Article from '../../../domains/article';
import { ShowArticleResult, useArticles } from '../../hooks';
import { Loader, LoaderProps } from './Loader';
import { ReloadOnAuthStatusChangedLoader } from './ReloadOnAuthStatusChangedLoader';

export type LoadResult = ShowArticleResult | null;

export type ArticleLoaderProps = {
    id: Article['id'];
} & Pick<LoaderProps<ShowArticleResult>, 'children'>;

export function ArticleLoader({ id, children }: ArticleLoaderProps) {
    const { show } = useArticles();
    const load = React.useCallback(() => show(id), [id, show]);
    return (
        <ReloadOnAuthStatusChangedLoader load={load}>{children}</ReloadOnAuthStatusChangedLoader>
    );
}
