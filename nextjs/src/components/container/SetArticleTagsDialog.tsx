import { Autocomplete, AutocompleteProps, Stack, TextField } from '@mui/material';
import React from 'react';
import Article from '../../domains/article';
import ArticleTag from '../../domains/article-tag';
import { useArticleRelatedTag } from '../hooks/article-tag';
import { ListArticleTagResult, useTags } from '../hooks/tags';
import { ConfirmDialog, ConfirmDialogProps } from '../presentational/ConfirmDialog';

export type SetArticleTagsDialogProps = {
    article?: Article;
} & ConfirmDialogProps;

type State = {
    loading: boolean;
    // ユーザーの持っているタグの一覧
    // autocompleteのoptionとして使用
    userTagOptions: ArticleTag[];
    // 現在のタグ
    currentTags: ArticleTag[];
};

type Actions =
    | {
          type: 'startLoading';
      }
    | {
          type: 'finishLoading';
      }
    | {
          type: 'setUserTagOptions';
          payload: ArticleTag[];
      }
    | {
          type: 'setDefaultTags';
          payload: ArticleTag[];
      }
    | {
          type: 'setCurrentTags';
          payload: ArticleTag[];
      };

const reducer = (state: State, action: Actions): State => {
    switch (action.type) {
        case 'startLoading':
            return {
                ...state,
                loading: true,
            };
        case 'finishLoading':
            return {
                ...state,
                loading: false,
            };
        case 'setUserTagOptions':
            return {
                ...state,
                userTagOptions: action.payload,
            };
        case 'setCurrentTags':
            return {
                ...state,
                currentTags: action.payload,
            };
        default:
            return state;
    }
};

const initialState: State = {
    loading: false,
    userTagOptions: [],
    currentTags: [],
};

export function SetArticleTagsDialog({ article, onClose, ...props }: SetArticleTagsDialogProps) {
    const { list, create } = useTags();
    const { reset } = useArticleRelatedTag();
    const [state, dispatch] = React.useReducer(reducer, initialState);

    React.useEffect(() => {
        dispatch({ type: 'startLoading' });
        dispatch({ type: 'setCurrentTags', payload: article?.tags || [] });
        list({})
            .then((result) => {
                result.isSuccess && dispatch({ type: 'setUserTagOptions', payload: result.data });
            })
            .finally(() => dispatch({ type: 'finishLoading' }));
    }, [article?.tags, list]);

    const onSubmit = React.useCallback(async () => {
        if (!article) {
            alert('記事が未設定です');
            return;
        }
        const result = await reset({
            articleId: article.id,
            tagIds: state.currentTags.map((tag) => tag.id),
        });
        if (result.isSuccess) {
            alert('タグを設定しました');
            dispatch({
                type: 'setDefaultTags',
                payload: state.currentTags,
            });
            return;
        }
    }, [article, reset, state.currentTags]);
    return (
        <ConfirmDialog
            message="タグを選択してください"
            okButtonProps={{
                onClick: onSubmit,
            }}
            {...props}
        >
            <Stack maxWidth={275}>
                <Autocomplete
                    // freeSolo
                    multiple
                    disabled={state.loading}
                    value={state.currentTags}
                    isOptionEqualToValue={(option, value) => {
                        return option.id === value.id;
                    }}
                    sx={{ width: '100%' }}
                    options={state.userTagOptions}
                    getOptionLabel={(option: string | ArticleTag) => {
                        if (typeof option === 'string') return option;
                        return option.name;
                    }}
                    renderInput={(params) => (
                        <TextField {...params} label="タグ" variant="standard" />
                    )}
                    onChange={(_, values) =>
                        dispatch({
                            type: 'setCurrentTags',
                            payload: values,
                        })
                    }
                />
            </Stack>
        </ConfirmDialog>
    );
}
