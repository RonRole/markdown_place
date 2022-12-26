import React from 'react';
import { EditNewArticleDialog } from '../container';

export type EditNewArticleDialogContext = {
    open(): void;
    close(): void;
};

export const EditNewArticleDialogContext = React.createContext<EditNewArticleDialogContext>({
    open() {
        console.log('now is loading...');
    },
    close() {
        console.log('now is loading...');
    },
});

export type EditNewArticleDialogContextProps = {
    children: React.ReactNode;
};

export function EditNewArticleDialogContextProvider({
    children,
}: EditNewArticleDialogContextProps) {
    const [isOpen, setOpen] = React.useState<boolean>(false);
    const open = React.useCallback(() => setOpen(true), []);
    const close = React.useCallback(() => setOpen(false), []);
    return (
        <EditNewArticleDialogContext.Provider value={{ open, close }}>
            {children}
            <EditNewArticleDialog open={isOpen} onClose={close} />
        </EditNewArticleDialogContext.Provider>
    );
}
