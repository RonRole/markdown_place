import { Box, Container, Grid, GridProps, List, Pagination, PaginationProps } from '@mui/material';
import React from 'react';
import { NavBar, RequireAuthorized } from '../container';
import Article from '../../domains/article';
import { ListItemArticle, ListItemArticleProps } from '../presentational/ListItemArticle';
import { DeleteArticleButton, DeleteArticleButtonProps } from '../container/DeleteArticleButton';
import { ArticleMarkdown } from '../presentational/ArticleMarkdown';
import { ArticleList } from '../presentational/ArticleList';
import { DestroyArticleResult, ListArticleParams, useArticles } from '../hooks';

export type ListArticlePageProps = {
    // general
    articles: Article[];
    disabled?: boolean;
    // delete
    afterDeleteCallback: (
        result: DestroyArticleResult,
        currentCheckedArticles: State['checkedArticles']
    ) => Promise<State['checkedArticles']>;
    // list
    onEditArticle?: ListItemArticleProps['onEdit'];
    // pagination
    page: PaginationProps['page'];
    pageCount: PaginationProps['count'];
    onChangePage?: (page: number) => Promise<void>;
} & ListArticleParams;

type State = {
    // general
    articleAreaOffsetY: number;
    // delete
    openDeleteDialog: boolean;
    // list
    featuredArticle?: Article;
    fixedArticle?: Article;
    checkedArticles: Article[];
};

type Actions =
    | {
          type: 'initialize';
      }
    | {
          type: 'setCheckedArticles';
          payload: State['checkedArticles'];
      }
    | {
          type: 'changeArticleFixing';
          payload: State['fixedArticle'];
      }
    | {
          type: 'featureArticle';
          payload: State['featuredArticle'];
      }
    | {
          type: 'changeArticleChecking';
          payload: {
              checked: boolean;
              article: Article;
          };
      }
    | {
          type: 'setOpenDeleteDialog';
          payload: boolean;
      }
    | {
          type: 'setDisabled';
          payload: boolean;
      };

const initialState: State = {
    checkedArticles: [],
    articleAreaOffsetY: 0,
    openDeleteDialog: false,
};

const reducer = (state: State, action: Actions): State => {
    switch (action.type) {
        case 'initialize':
            return initialState;
        case 'setCheckedArticles':
            return {
                ...state,
                checkedArticles: action.payload,
            };
        case 'changeArticleFixing':
            if (state.fixedArticle === action.payload) {
                return {
                    ...state,
                    fixedArticle: undefined,
                };
            }
            return {
                ...state,
                fixedArticle: action.payload,
            };
        case 'featureArticle':
            return {
                ...state,
                featuredArticle: action.payload,
            };
        case 'changeArticleChecking':
            if (action.payload.checked) {
                return {
                    ...state,
                    checkedArticles: [...state.checkedArticles, action.payload.article],
                };
            }
            return {
                ...state,
                checkedArticles: state.checkedArticles.filter(
                    (article) => article.id !== action.payload.article.id
                ),
            };
        case 'setOpenDeleteDialog':
            return {
                ...state,
                openDeleteDialog: action.payload,
            };
        default:
            return state;
    }
};
export function ListArticlePage({
    articles,
    disabled,
    afterDeleteCallback = async () => [],
    onChangePage = async () => {},
    onEditArticle = async () => {},
    page,
    pageCount,
}: ListArticlePageProps) {
    const [state, dispatch] = React.useReducer(reducer, initialState);
    React.useEffect(() => {
        dispatch({
            type: 'initialize',
        });
        return () => {
            dispatch({
                type: 'initialize',
            });
        };
    }, []);
    const ListMemo = React.useMemo(
        () => (
            <ArticleList
                articles={articles}
                fixedArticleId={state.fixedArticle?.id}
                checkedArticleIdsSet={new Set(state.checkedArticles.map((article) => article.id))}
                disabled={disabled}
                onChangeChecking={async (checked, article) =>
                    dispatch({
                        type: 'changeArticleChecking',
                        payload: {
                            checked,
                            article,
                        },
                    })
                }
                onFeature={async (article) =>
                    dispatch({
                        type: 'featureArticle',
                        payload: article,
                    })
                }
                onClick={async (article) =>
                    dispatch({
                        type: 'changeArticleFixing',
                        payload: article,
                    })
                }
                onEdit={onEditArticle}
            />
        ),
        [articles, state.fixedArticle?.id, state.checkedArticles, disabled, onEditArticle]
    );
    const PaginationMemo = React.useMemo(
        () => (
            <Pagination
                disabled={disabled}
                page={page}
                count={pageCount}
                color="primary"
                onChange={(_, page) => onChangePage(page)}
            />
        ),
        [disabled, page, pageCount, onChangePage]
    );
    const DeleteArticleButtonMemo = React.useMemo(
        () => (
            <DeleteArticleButton
                disabled={disabled}
                afterDeleteCallback={async (result: DestroyArticleResult) => {
                    const newCheckedArticles = await afterDeleteCallback(
                        result,
                        state.checkedArticles
                    );
                    dispatch({
                        type: 'setCheckedArticles',
                        payload: newCheckedArticles,
                    });
                }}
                targetArticles={state.checkedArticles}
            />
        ),
        [afterDeleteCallback, disabled, state]
    );
    const ArticleMarkdownMemo = React.useMemo(
        () => <ArticleMarkdown article={state.fixedArticle || state.featuredArticle} />,
        [state.featuredArticle, state.fixedArticle]
    );
    return (
        <RequireAuthorized>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100vh',
                    overflow: 'hidden',
                }}
            >
                <NavBar>
                    <Grid
                        id="article-area"
                        container
                        spacing={1}
                        sx={{ height: `calc(100% - ${state.articleAreaOffsetY}px)` }}
                    >
                        <Grid xs={4} item sx={{ height: '100%', overflow: 'scroll' }}>
                            {DeleteArticleButtonMemo}
                            {ListMemo}
                            {PaginationMemo}
                        </Grid>
                        <Grid xs={8} item sx={{ height: '100%', overflow: 'scroll' }}>
                            {ArticleMarkdownMemo}
                        </Grid>
                    </Grid>
                </NavBar>
            </Box>
        </RequireAuthorized>
    );
}
