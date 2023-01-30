import { Delete } from '@mui/icons-material';
import { IconButton, IconButtonProps, Tooltip } from '@mui/material';
import React from 'react';
import Article from '../../domains/article';
import { DestroyArticleResult, useArticles } from '../hooks';
import { AlertDialog } from '../presentational/AlertDialog';
import { ConfirmDialog } from '../presentational/ConfirmDialog';

export type DeleteArticleButtonProps = {
    targetArticles: Article[];
    afterDeleteCallback?: (result: DestroyArticleResult) => Promise<void>;
} & Omit<IconButtonProps, 'onClick'>;

type State = {
    openDialog: boolean;
    disabled: boolean;
};

type Actions =
    | {
          type: 'setOpenDialog';
          payload: State['openDialog'];
      }
    | {
          type: 'startSubmitting';
      }
    | {
          type: 'finishSubmitting';
      };

const reducer = (state: State, action: Actions): State => {
    switch (action.type) {
        case 'setOpenDialog':
            return {
                ...state,
                openDialog: action.payload,
            };
        case 'startSubmitting':
            return {
                ...state,
                disabled: true,
            };
        case 'finishSubmitting':
            return {
                ...state,
                openDialog: false,
                disabled: false,
            };
    }
};

const initialState: State = {
    openDialog: false,
    disabled: false,
};

export function DeleteArticleButton({
    targetArticles,
    afterDeleteCallback = async () => {},
    ...props
}: DeleteArticleButtonProps) {
    const { destroy } = useArticles();
    const [state, dispatch] = React.useReducer(reducer, initialState);
    const onSubmit = React.useCallback(async () => {
        dispatch({
            type: 'startSubmitting',
        });
        const result = await destroy(targetArticles.map((article) => article.id));
        await afterDeleteCallback(result);
        dispatch({
            type: 'finishSubmitting',
        });
    }, [afterDeleteCallback, destroy, targetArticles]);
    return (
        <>
            <IconButton
                disabled={state.disabled}
                onClick={() =>
                    dispatch({
                        type: 'setOpenDialog',
                        payload: true,
                    })
                }
                {...props}
            >
                <Tooltip title="削除">
                    <Delete />
                </Tooltip>
            </IconButton>
            <AlertDialog
                open={state.openDialog && targetArticles.length === 0}
                message="削除する記事を選んでください"
                onClickOk={() => {
                    dispatch({
                        type: 'setOpenDialog',
                        payload: false,
                    });
                }}
                onClose={() => {
                    dispatch({
                        type: 'setOpenDialog',
                        payload: false,
                    });
                }}
            />
            <ConfirmDialog
                disabled={state.disabled}
                message="以下の記事を削除します。よろしいですか?"
                open={state.openDialog && targetArticles.length > 0}
                okButtonProps={{
                    onClick: onSubmit,
                }}
                cancelButtonProps={{
                    onClick: () => {
                        dispatch({
                            type: 'setOpenDialog',
                            payload: false,
                        });
                    },
                }}
                onClose={() => {
                    dispatch({
                        type: 'setOpenDialog',
                        payload: false,
                    });
                }}
            >
                <ul>
                    {targetArticles.map((article) => (
                        <li key={article.id}>{article.title}</li>
                    ))}
                </ul>
            </ConfirmDialog>
        </>
    );
}
