import {
    FormLabel,
    Grid,
    GridProps,
    List,
    ListItem,
    ListItemButton,
    Pagination,
} from '@mui/material';
import React from 'react';
import Article from '../../domains/article';
import { ListItemArticle } from './ListItemArticle';
import { ParsedMarkdown } from './ParsedMarkdown';

export type ArticlesAreaProps = {
    articles?: Article[];
    loading?: boolean;
    pageCount?: number;
    page?: number;
    onChangePage: (page: number) => Promise<void>;
    onClickArticle?: (article: Article) => Promise<void>;
    onEdit?: (article: Article) => Promise<void>;
} & GridProps;

type State = {
    selectedArticle?: Article;
    fixedArticle?: Article;
    checkedArticles: Article[];
};

type Actions =
    | {
          type: 'changeArticleFixing';
          payload: State['fixedArticle'];
      }
    | {
          type: 'selectArticle';
          payload: State['selectedArticle'];
      }
    | {
          type: 'changeArticleChecking';
          payload: {
              checked: boolean;
              article: Article;
          };
      };

const reducer = (state: State, action: Actions): State => {
    switch (action.type) {
        case 'changeArticleFixing':
            if (state.fixedArticle?.id === action.payload?.id) {
                return {
                    ...state,
                    fixedArticle: undefined,
                };
            }
            return {
                ...state,
                fixedArticle: action.payload,
            };
        case 'selectArticle':
            return {
                ...state,
                selectedArticle: action.payload,
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
        default:
            return state;
    }
};

const initialState: State = { checkedArticles: [] };

export function ArticlesArea({
    articles = [],
    loading = false,
    onClickArticle = async () => {},
    pageCount,
    page = 1,
    onEdit = async () => {},
    onChangePage,
    ...props
}: ArticlesAreaProps) {
    const [state, dispatch] = React.useReducer(reducer, initialState);
    return (
        <Grid container spacing={1} {...props}>
            <Grid xs={4} item sx={{ height: '100%', overflow: 'scroll' }}>
                <List>
                    {articles?.map((article: Article) => {
                        return (
                            <ListItemArticle
                                disabled={loading}
                                key={article.id}
                                article={article}
                                fixed={state.fixedArticle?.id === article.id}
                                onChangeChecking={async (checked) =>
                                    dispatch({
                                        type: 'changeArticleChecking',
                                        payload: {
                                            checked,
                                            article,
                                        },
                                    })
                                }
                                onFeatured={async () =>
                                    dispatch({ type: 'selectArticle', payload: article })
                                }
                                onClicked={async () =>
                                    dispatch({
                                        type: 'changeArticleFixing',
                                        payload: article,
                                    })
                                }
                                onEdit={() => onEdit(article)}
                            />
                        );
                    })}
                </List>
                <Pagination
                    disabled={loading}
                    count={pageCount}
                    page={page}
                    color="primary"
                    onChange={(_, page) => onChangePage(page)}
                />
            </Grid>
            <Grid xs={8} item sx={{ height: '100%', overflow: 'scroll' }}>
                <FormLabel>{(state.fixedArticle || state.selectedArticle)?.title}</FormLabel>
                <ParsedMarkdown
                    markdownSrc={(state.fixedArticle || state.selectedArticle)?.content}
                />
            </Grid>
        </Grid>
    );
}
