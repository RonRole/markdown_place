import { Card, CardProps } from '@mui/material';
import React from 'react';

export type FormCardProps = {
    children?: (submitting: boolean) => React.ReactNode;
    onSubmit: React.FormEventHandler<HTMLFormElement>;
} & Omit<CardProps, 'children' | 'onSubmit'>;

export function FormCard({ children, onSubmit, ...props }: FormCardProps) {
    const [submitting, setSubmitting] = React.useState<boolean>(false);
    const handleSubmit = React.useCallback(
        async (e: React.FormEvent<HTMLFormElement>) => {
            setSubmitting(true);
            await onSubmit(e);
            setSubmitting(false);
        },
        [setSubmitting, onSubmit]
    );
    const childNodes = children ? children(submitting) : <></>;
    return (
        <Card {...props}>
            <form onSubmit={handleSubmit}>{childNodes}</form>
        </Card>
    );
}
