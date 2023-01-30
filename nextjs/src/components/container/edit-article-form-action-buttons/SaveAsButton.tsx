import { SaveAs } from '@mui/icons-material';
import { ButtonProps, IconButton, IconButtonProps, Tooltip } from '@mui/material';
import React from 'react';
import Article from '../../../domains/article';
import { CreateArticleResult } from '../../hooks';
import { ArticleSaveAsFormDialog, ArticleSaveAsFormDialogProps } from '../ArticleSaveAsDialog';

export type SaveAsButtonProps = Omit<IconButtonProps, 'onClick'> & ArticleSaveAsFormDialogProps;

type SaveAsButtonState = {
    openDialog: boolean;
};

const initialState = {
    openDialog: false,
};

type SaveAsButtonAction =
    | {
          type: 'openDialog';
      }
    | {
          type: 'closeDialog';
      };

const saveAsButtonReducer = (
    state: SaveAsButtonState,
    action: SaveAsButtonAction
): SaveAsButtonState => {
    switch (action.type) {
        case 'openDialog':
            return { ...state, openDialog: true };
        case 'closeDialog':
            return { ...state, openDialog: false };
    }
};

export const SaveAsButton = ({
    contentTextAreaRef,
    beforeCreateCallbacks,
    afterCreateCallbacks,
    ...props
}: SaveAsButtonProps) => {
    const [state, dispatch] = React.useReducer(saveAsButtonReducer, initialState);
    const handleCreateCallbacks = React.useMemo(
        () => [
            ...afterCreateCallbacks,
            async (result: CreateArticleResult) => {
                if (result.isSuccess) {
                    dispatch({ type: 'closeDialog' });
                }
            },
        ],
        [afterCreateCallbacks]
    );
    return (
        <>
            <IconButton {...props} onClick={() => dispatch({ type: 'openDialog' })}>
                <SaveAs />
            </IconButton>
            <ArticleSaveAsFormDialog
                fullWidth
                maxWidth="xs"
                open={state.openDialog}
                onClose={() => dispatch({ type: 'closeDialog' })}
                contentTextAreaRef={contentTextAreaRef}
                beforeCreateCallbacks={beforeCreateCallbacks}
                afterCreateCallbacks={handleCreateCallbacks}
                onClickCancelButton={() => dispatch({ type: 'closeDialog' })}
            />
        </>
    );
};
