import { Delete } from '@mui/icons-material';
import {
    Box,
    FormLabel,
    Grid,
    GridProps,
    IconButton,
    List,
    Pagination,
    PaginationProps,
} from '@mui/material';
import React from 'react';
import Article from '../../domains/article';
import { DeleteArticleButton } from '../container/DeleteArticleButton';
import { ArticleMarkdown } from './ArticleMarkdown';
import { ListItemArticle } from './ListItemArticle';

export type ArticlesAreaProps = {
    // general
    articles?: Article[];
    disabled?: boolean;
    // list article
    onEditArticle?: (article: Article) => Promise<void>;
    // pagination
    page?: PaginationProps['page'];
    pageCount?: PaginationProps['count'];
    onChangePage?: (page: number) => Promise<void>;
} & GridProps;

type State = {
    featuredArticle?: Article;
    fixedArticle?: Article;
    checkedArticleIds: Set<Article['id']>;
};

type Actions =
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
              articleId: Article['id'];
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
        case 'featureArticle':
            return {
                ...state,
                featuredArticle: action.payload,
            };
        case 'changeArticleChecking':
            action.payload.checked
                ? state.checkedArticleIds.add(action.payload.articleId)
                : state.checkedArticleIds.delete(action.payload.articleId);
            return {
                ...state,
            };
        default:
            return state;
    }
};

const initialState: State = { checkedArticleIds: new Set() };

export function ArticlesArea({
    articles = [],
    disabled = false,
    onEditArticle = async () => {},
    page,
    pageCount,
    onChangePage = async () => {},
    ...props
}: ArticlesAreaProps) {
    const [state, dispatch] = React.useReducer(reducer, initialState);
    const checketArticleIdsRef = React.useRef<State['checkedArticleIds']>(state.checkedArticleIds);
    return (
        <Grid container spacing={1} {...props}>
            <Grid xs={4} item sx={{ height: '100%', overflow: 'scroll' }}>
                <Box sx={{ display: 'flex' }}>
                    <DeleteArticleButton targetArticleIdsRef={checketArticleIdsRef} />
                </Box>
                <List>
                    {articles?.map((article: Article) => {
                        return (
                            <ListItemArticle
                                disabled={disabled}
                                key={article.id}
                                article={article}
                                fixed={state.fixedArticle?.id === article.id}
                                onChangeChecking={async (checked) =>
                                    dispatch({
                                        type: 'changeArticleChecking',
                                        payload: {
                                            checked,
                                            articleId: article.id,
                                        },
                                    })
                                }
                                onFeature={async () =>
                                    dispatch({
                                        type: 'featureArticle',
                                        payload: article,
                                    })
                                }
                                onClick={async () =>
                                    dispatch({
                                        type: 'changeArticleFixing',
                                        payload: article,
                                    })
                                }
                                onEdit={() => onEditArticle(article)}
                            />
                        );
                    })}
                </List>
                <Pagination
                    disabled={disabled}
                    count={pageCount}
                    page={page}
                    color="primary"
                    onChange={(_, page) => onChangePage(page)}
                />
            </Grid>
            <Grid xs={8} item sx={{ height: '100%', overflow: 'scroll' }}>
                <ArticleMarkdown article={state.fixedArticle || state.featuredArticle} />
            </Grid>
        </Grid>
    );
}
