import React from 'react';

export type FormWithSubmittingStateProps = {
    children?(submitting: boolean): React.ReactNode;
    onSubmit: React.FormEventHandler<HTMLFormElement>;
};

export function FormWithSubmittingState({ children, onSubmit }: FormWithSubmittingStateProps) {
    const [submitting, setSubmitting] = React.useState<boolean>(false);
    const handleSubmit = React.useCallback(
        async (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            setSubmitting(true);
            await onSubmit(e);
            setSubmitting(false);
        },
        [setSubmitting, onSubmit]
    );
    const childNodes = React.useMemo<React.ReactNode>(
        () => (children ? children(submitting) : <></>),
        [children, submitting]
    );
    return <form onSubmit={handleSubmit}>{childNodes}</form>;
}
