import React from 'react';

export type FormWithSubmittingStateProps = {
    children?(submitting: boolean): React.ReactNode;
    onSubmit: React.FormEventHandler<HTMLFormElement>;
} & Omit<
    React.DetailedHTMLProps<React.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>,
    'children' | 'onSubmit'
>;

export function FormWithSubmittingState({
    children,
    onSubmit,
    ...props
}: FormWithSubmittingStateProps) {
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
    return (
        <form {...props} onSubmit={handleSubmit}>
            {childNodes}
        </form>
    );
}
