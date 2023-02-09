import { Autocomplete, AutocompleteProps, Stack, TextField } from '@mui/material';
import React from 'react';
import Article from '../../domains/article';
import ArticleTag from '../../domains/article-tag';
import { ResetArticleTagResult, useArticleRelatedTag } from '../hooks/article-tag';
import { ListArticleTagResult, useTags } from '../hooks/tags';
import { ConfirmDialog, ConfirmDialogProps } from '../presentational/ConfirmDialog';

export type BeforeSetArticleTagsCallback = () => Promise<void>;
export type AfterSetArticleTagsCallback = (result: ResetArticleTagResult) => Promise<void>;

export type SetArticleTagsDialogProps = {
    article?: Article;
    beforeSetArticleTagsCallbacks?: (BeforeSetArticleTagsCallback | undefined)[];
    afterSetArticleTagsCallbacks?: (AfterSetArticleTagsCallback | undefined)[];
} & Omit<ConfirmDialogProps, 'disabled' | 'okButtonProps' | 'cancelButtonProps'>;

type State = {
    loading: boolean;
    // ユーザーの持っているタグの一覧
    // autocompleteのoptionとして使用
    userTagOptions: ArticleTag[];
    // 編集前のタグ
    defaultTags: ArticleTag[];
    // 現在のタグ
    currentTags: ArticleTag[];
};

type Actions =
    | {
          type: 'initialize';
          payload: State;
      }
    | {
          type: 'startLoading';
      }
    | {
          type: 'finishLoading';
      }
    | {
          type: 'startSubmitting';
      }
    | {
          type: 'finishSubmitting';
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
        case 'initialize':
            return {
                ...action.payload,
            };
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
        case 'startSubmitting':
            return {
                ...state,
                loading: true,
            };
        case 'finishSubmitting':
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
    defaultTags: [],
    currentTags: [],
};

export function SetArticleTagsDialog({
    article,
    beforeSetArticleTagsCallbacks = [],
    afterSetArticleTagsCallbacks = [],
    onClose = () => {},
    ...props
}: SetArticleTagsDialogProps) {
    const { list, create } = useTags();
    const { reset } = useArticleRelatedTag();
    const defaultState = {
        ...initialState,
        currentTags: article?.tags || [],
    };
    const [state, dispatch] = React.useReducer(reducer, defaultState);
    React.useEffect(() => {
        dispatch({ type: 'startLoading' });
        list({})
            .then((result) => {
                result.isSuccess && dispatch({ type: 'setUserTagOptions', payload: result.data });
            })
            .finally(() => dispatch({ type: 'finishLoading' }));
        return () => {
            dispatch({
                type: 'initialize',
                payload: defaultState,
            });
        };
    }, [list]);

    const clearEditting = React.useCallback(() => {
        dispatch({ type: 'initialize', payload: defaultState });
    }, []);

    const handleClose: ConfirmDialogProps['onClose'] = React.useCallback(
        (event: {}, reason: 'backdropClick' | 'escapeKeyDown') => {
            clearEditting();
            onClose(event, reason);
        },
        []
    );
    const onSubmit = React.useCallback(async () => {
        if (!article) return;
        dispatch({ type: 'startSubmitting' });
        beforeSetArticleTagsCallbacks.forEach(async (callback) => {
            if (callback) await callback();
        });
        const result = await reset({
            articleId: article.id,
            tags: state.currentTags,
        });
        if (result.isSuccess) {
            dispatch({
                type: 'setDefaultTags',
                payload: state.currentTags,
            });
        }
        afterSetArticleTagsCallbacks.forEach(async (callback) => {
            if (callback) await callback(result);
        });
        dispatch({ type: 'finishSubmitting' });
    }, [article, reset, state.currentTags]);
    return (
        <ConfirmDialog
            message="タグを選択してください"
            okButtonProps={{
                onClick: onSubmit,
            }}
            cancelButtonProps={{
                onClick: () => handleClose({}, 'backdropClick'),
            }}
            disabled={state.loading}
            onClose={handleClose}
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
