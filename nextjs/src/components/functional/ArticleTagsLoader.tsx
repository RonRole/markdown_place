import React from 'react';
import { AuthContext } from '../context';
import { ListArticleTagResult, useTags } from '../hooks/tags';
import { Loader, LoaderProps } from './loaders/Loader';

export type ArticleTagsLoaderProps = Pick<LoaderProps<ListArticleTagResult>, 'children'>;

/**
 * 記事タグの一覧を読み込む
 * ログイン状態が変わったとき、読み込み直す
 * @param param0
 * @returns
 */
export function ArticleTagsLoader({ children }: ArticleTagsLoaderProps) {
    const { currentAuthStatus } = React.useContext(AuthContext);
    const { list } = useTags();
    const load = React.useCallback(() => list({}), [list]);
    return (
        <Loader reloadDeps={[currentAuthStatus.isFixedAsAuthorized]} load={load}>
            {children}
        </Loader>
    );
}
