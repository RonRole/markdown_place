import { AppBar, Grid, GridProps, TextareaAutosize } from '@mui/material';
import { before } from 'node:test';
import React from 'react';
import Article from '../../domains/article';
import { ParsedMarkdown } from '../presentational/ParsedMarkdown';
import {
    EditArticleToolBar,
    BottomBarActionCallbacks,
} from './edit-article-form-action-buttons/EditArticleToolBar';

const EditArticleFormModes = {
    unauthorized: {
        isAbleSave: false,
        isAbleSaveAs: false,
    },
    create: {
        isAbleSave: false,
        isAbleSaveAs: true,
    },
    update: {
        isAbleSave: true,
        isAbleSaveAs: true,
    },
} as const;

export type EditArticleModeKey = keyof typeof EditArticleFormModes;

type EditArticleFormState = {
    content?: Article['content'];
    submitting: boolean;
};

type EditArticleFormActions =
    | {
          type: 'changeContent';
          payload: Pick<EditArticleFormState, 'content'>;
      }
    | {
          type: 'startSubmitting';
      }
    | {
          type: 'finishSubmitting';
      };

const reducer = (
    state: EditArticleFormState,
    action: EditArticleFormActions
): EditArticleFormState => {
    switch (action.type) {
        case 'changeContent':
            return {
                ...state,
                content: action.payload.content,
            };
        case 'startSubmitting':
            return {
                ...state,
                submitting: true,
            };
        case 'finishSubmitting':
            return {
                ...state,
                submitting: false,
            };
        default:
            throw new Error(`action is not defined`);
    }
};

export type EditArticleFormProps = {
    mode: EditArticleModeKey;
    article?: Article;
    callbacks?: BottomBarActionCallbacks;
} & GridProps;

export function EditArticleForm({ mode, article, callbacks, ...props }: EditArticleFormProps) {
    const contentInputRef = React.useRef<HTMLTextAreaElement>(null);
    const [state, dispatch] = React.useReducer(reducer, {
        content: article?.content,
        submitting: false,
    });
    return (
        <>
            <Grid container {...props}>
                <Grid item xs={4} sx={{ height: '100%' }}>
                    <TextareaAutosize
                        ref={contentInputRef}
                        defaultValue={state.content}
                        disabled={state.submitting}
                        onChange={() =>
                            dispatch({
                                type: 'changeContent',
                                payload: {
                                    content: contentInputRef.current?.value,
                                },
                            })
                        }
                        style={{
                            width: '100%',
                            resize: 'none',
                            height: '100%',
                            overflow: 'scroll',
                        }}
                        placeholder="こっちが入力エリア"
                    />
                </Grid>
                <Grid item xs={8} sx={{ height: '100%', overflowY: 'scroll' }}>
                    <ParsedMarkdown sx={{ height: '100%' }} markdownSrc={state.content} />
                </Grid>
            </Grid>
            <AppBar
                position="fixed"
                sx={{
                    top: 'auto',
                    bottom: '0',
                    opacity: 0.5,
                }}
            >
                <EditArticleToolBar
                    article={article}
                    sx={{ justifyContent: 'end' }}
                    contentTextAreaRef={contentInputRef}
                    disabled={state.submitting}
                    commonCallbacks={{
                        before: async () => dispatch({ type: 'startSubmitting' }),
                        after: async () => dispatch({ type: 'finishSubmitting' }),
                    }}
                    itemCallbacks={callbacks}
                    itemStates={{
                        save: {
                            disabled: !EditArticleFormModes[mode].isAbleSave,
                        },
                        saveAs: {
                            disabled: !EditArticleFormModes[mode].isAbleSaveAs,
                        },
                    }}
                />
            </AppBar>
        </>
    );
}
