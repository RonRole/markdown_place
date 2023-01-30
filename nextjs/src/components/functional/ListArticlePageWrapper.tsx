import React from 'react';
import { DestroyArticleResult, ListArticleParams, useArticles } from '../hooks';
import { ListArticlePage, ListArticlePageProps } from '../pages/ListArticlePage';

export type ProvideParams = {
    articles: ListArticlePageProps['articles'];
    page: ListArticlePageProps['page'];
    pageCount: ListArticlePageProps['pageCount'];
    loading: ListArticlePageProps['disabled'];
    afterDeleteCallback: ListArticlePageProps['afterDeleteCallback'];
};

export type ListArticlePageWrapperProps = {
    children(params: ProvideParams): React.ReactNode;
} & ListArticleParams &
    Pick<ListArticlePageProps, 'onEditArticle' | 'onChangePage'>;

type State = {
    articles: ListArticlePageProps['articles'];
    page: ListArticlePageProps['page'];
    pageCount: ListArticlePageProps['pageCount'];
    loading: ListArticlePageProps['disabled'];
};

type Actions =
    | {
          type: 'setLoadResult';
          payload: Pick<State, 'articles' | 'page' | 'pageCount'>;
      }
    | {
          type: 'setLoading';
          payload: State['loading'];
      };

const reducer = (state: State, action: Actions): State => {
    switch (action.type) {
        case 'setLoadResult':
            return {
                ...state,
                articles: action.payload.articles,
                page: action.payload.page,
                pageCount: action.payload.pageCount,
            };
        case 'setLoading':
            return {
                ...state,
                loading: action.payload,
            };
        default:
            return state;
    }
};

const initialState: State = {
    articles: [],
    page: 1,
    pageCount: 1,
    loading: true,
};

/**
 * ListArticlePageに渡すpropsを管理するコンポーネント
 * ListArticlePageはarticlesなどを受け取るコンポーネントですが、
 * それに渡すpropsを状態管理したいというケースが出てきたので、
 * その対応用
 *
 * 例
 *   記事を削除した際
 *     1. ListArticlePageに渡すarticlesを読み込み直す
 *     2. articlesのチェック状態はリセットする
 */
export function ListArticlePageWrapper({ children, q, page }: ListArticlePageWrapperProps) {
    const [state, dispatch] = React.useReducer(reducer, initialState);
    const { list } = useArticles();
    const loadList = React.useCallback(() => {
        dispatch({
            type: 'setLoading',
            payload: true,
        });
        list({
            q,
            page,
        })
            .then((listResult) => {
                if (!listResult.isSuccess) {
                    return;
                }
                dispatch({
                    type: 'setLoadResult',
                    payload: {
                        ...listResult.data,
                        page: Math.min(page || 1, listResult.data.pageCount),
                    },
                });
            })
            .finally(() => {
                dispatch({
                    type: 'setLoading',
                    payload: false,
                });
            });
    }, [list, page, q]);
    const afterDeleteCallback: ListArticlePageProps['afterDeleteCallback'] = React.useCallback(
        async (result: DestroyArticleResult, currentCheckedArticles) => {
            if (!result.isSuccess) {
                alert('削除に失敗しました');
                return currentCheckedArticles;
            }
            await loadList();
            return [];
        },
        [loadList]
    );
    React.useEffect(() => {
        loadList();
    }, [loadList, page, q]);
    const child = children({
        articles: state.articles,
        page: state.page,
        pageCount: state.pageCount,
        loading: state.loading,
        afterDeleteCallback,
    });
    return <>{child}</>;
}
