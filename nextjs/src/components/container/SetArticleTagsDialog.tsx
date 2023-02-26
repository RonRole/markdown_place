import { Autocomplete, AutocompleteProps, Stack, TextField } from '@mui/material';
import React from 'react';
import Article from '../../domains/article';
import ArticleTag from '../../domains/article-tag';
import { ResetArticleTagResult, useArticleRelatedTag } from '../hooks/article-tag';
import { CreateArticleTagResult, useTags } from '../hooks/tags';
import { ConfirmDialog, ConfirmDialogProps } from '../presentational/ConfirmDialog';

export type BeforeSetArticleTagsCallback = () => Promise<void>;
export type AfterSetArticleTagsCallback = (
    result: CreateArticleTagResult | ResetArticleTagResult
) => Promise<void>;

export type SetArticleTagsDialogProps = {
    article?: Article;
    tagOptions?: ArticleTag[];
    beforeSetArticleTagsCallbacks?: (BeforeSetArticleTagsCallback | undefined)[];
    afterSetArticleTagsCallbacks?: (AfterSetArticleTagsCallback | undefined)[];
} & Omit<ConfirmDialogProps, 'disabled' | 'okButtonProps' | 'cancelButtonProps'>;

type CurrentTag = string | ArticleTag;

type ResetCurrentTagResult = {
    result: CreateArticleTagResult | ResetArticleTagResult;
    newTags: ArticleTag[];
};

type State = {
    loading: boolean;
    // タグを新しく作る可能性があるので、
    // tagOptionsをステートにする
    tagOptions: ArticleTag[];
    // 編集前のタグ
    defaultTags: ArticleTag[];
    // 現在のタグ
    // freesoloで新規作成できる
    currentTags: CurrentTag[];
};

type Actions =
    | {
          type: 'initialize';
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
          type: 'addTagOptions';
          payload: ArticleTag[];
      }
    | {
          type: 'setDefaultTags';
          payload: ArticleTag[];
      }
    | {
          type: 'setCurrentTags';
          payload: CurrentTag[];
      };

const reducer = (state: State, action: Actions): State => {
    switch (action.type) {
        case 'initialize':
            return {
                ...initialState,
                tagOptions: state.tagOptions,
                defaultTags: state.defaultTags,
                currentTags: state.defaultTags,
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
        case 'addTagOptions':
            return {
                ...state,
                tagOptions: [...state.tagOptions, ...action.payload],
            };
        case 'setCurrentTags':
            return {
                ...state,
                currentTags: action.payload,
            };
        case 'setDefaultTags':
            return {
                ...state,
                defaultTags: action.payload,
            };
        default:
            return state;
    }
};

const initialState: State = {
    loading: false,
    tagOptions: [],
    defaultTags: [],
    currentTags: [],
};

const isEqualCurrentTag = (tag: CurrentTag, anotherTag: CurrentTag): boolean => {
    const tagName = tag instanceof ArticleTag ? tag.name : tag;
    const anotherTagName = anotherTag instanceof ArticleTag ? anotherTag.name : anotherTag;
    return tagName === anotherTagName;
};

export function SetArticleTagsDialog({
    article,
    tagOptions = [],
    beforeSetArticleTagsCallbacks = [],
    afterSetArticleTagsCallbacks = [],
    onClose = () => {},
    ...props
}: SetArticleTagsDialogProps) {
    const { create } = useTags();
    const { reset } = useArticleRelatedTag();
    const [state, dispatch] = React.useReducer(reducer, {
        loading: false,
        tagOptions: tagOptions || initialState.tagOptions,
        defaultTags: article?.tags || initialState.defaultTags,
        currentTags: article?.tags || initialState.currentTags,
    });
    const clearEditting = React.useCallback(() => {
        dispatch({
            type: 'initialize',
        });
    }, []);
    const handleClose: ConfirmDialogProps['onClose'] = React.useCallback(
        (event: {}, reason: 'backdropClick' | 'escapeKeyDown') => {
            clearEditting();
            onClose(event, reason);
        },
        [clearEditting, onClose]
    );
    const resetCurrentTags = React.useCallback(
        async (article: Article, currentTags: CurrentTag[]): Promise<ResetCurrentTagResult> => {
            const newTagNames = currentTags.filter((tag): tag is string => {
                return typeof tag === 'string';
            });
            const createNewTagsResult = await create({ name: newTagNames });
            if (!createNewTagsResult.isSuccess) {
                return {
                    result: createNewTagsResult,
                    newTags: [],
                };
            }
            const existsTags = currentTags.filter((tag): tag is ArticleTag => {
                return tag instanceof ArticleTag;
            });
            const tags = [...createNewTagsResult.data, ...existsTags];
            const result = await reset({
                articleId: article.id,
                tags,
            });
            return {
                result,
                newTags: createNewTagsResult.data,
            };
        },
        [create, reset]
    );
    const onSubmit = React.useCallback(async () => {
        if (!article) return;
        dispatch({ type: 'startSubmitting' });
        beforeSetArticleTagsCallbacks.forEach(async (callback) => {
            if (callback) await callback();
        });
        const { result, newTags } = await resetCurrentTags(article, state.currentTags);
        if (result.isSuccess) {
            dispatch({ type: 'setDefaultTags', payload: result.data });
            dispatch({ type: 'setCurrentTags', payload: result.data });
            dispatch({ type: 'addTagOptions', payload: newTags });
        }
        afterSetArticleTagsCallbacks.forEach(async (callback) => {
            if (callback) await callback(result);
        });
        dispatch({ type: 'finishSubmitting' });
    }, [
        afterSetArticleTagsCallbacks,
        article,
        beforeSetArticleTagsCallbacks,
        resetCurrentTags,
        state.currentTags,
    ]);

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
                    freeSolo
                    multiple
                    disabled={state.loading}
                    value={state.currentTags}
                    isOptionEqualToValue={(option, value) => {
                        return isEqualCurrentTag(option, value);
                    }}
                    sx={{ width: '100%' }}
                    options={state.tagOptions}
                    getOptionLabel={(option: CurrentTag) => {
                        return option instanceof ArticleTag ? option.name : option;
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
