import React from 'react';
import { AuthContextProviderProps } from './AuthContextProvider';
import { Dialog, Card, CardHeader, CardContent, Button } from '@mui/material';
import { AlertDialog } from '../presentational/AlertDialog';

export type AlertDialogProps = {
    message?: string;
    description?: string;
};

export type AlertDialogContext = {
    open(props: AlertDialogProps): void;
    close(): void;
};

export type AlertDialogContextProviderProps = {
    children: React.ReactNode;
};

export const AlertDialogContext = React.createContext<AlertDialogContext>({
    open(props: AlertDialogProps) {},
    close() {},
});

type State = {
    open: boolean;
} & Partial<AlertDialogProps>;

type Actions =
    | {
          type: 'open';
          data: AlertDialogProps;
      }
    | {
          type: 'close';
      };

const initialState: State = { open: false };
const reducer = (state: State, action: Actions): State => {
    switch (action.type) {
        case 'open':
            return {
                open: true,
                message: action.data.message,
                description: action.data.description,
            };
        case 'close':
            return {
                open: false,
            };
        default:
            throw new Error('undefined action');
    }
};

export function AlertDialogContextProvider({ children }: AuthContextProviderProps) {
    const [state, dispatch] = React.useReducer(reducer, initialState);
    return (
        <AlertDialogContext.Provider
            value={{
                open: (props: AlertDialogProps) => dispatch({ type: 'open', data: props }),
                close: () => dispatch({ type: 'close' }),
            }}
        >
            {children}
            <AlertDialog
                message={state.message}
                description={state.description}
                open={state.open}
                onClose={() => dispatch({ type: 'close' })}
                onClickOk={() => dispatch({ type: 'close' })}
            />
        </AlertDialogContext.Provider>
    );
}
