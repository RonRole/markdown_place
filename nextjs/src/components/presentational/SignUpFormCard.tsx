import { Button, ButtonProps, Card, CardContent, CardHeader, CardProps, TextField, TextFieldProps } from "@mui/material"
import React from "react";

export type SignUpFormInput = {
    name?: string,
    email?: string,
    password?: string,
    passwordConfirmation?: string,
}

export type SignUpFormCardProps = {
    children?: React.ReactNode,
    onSubmit: (input: SignUpFormInput)=>Promise<void>,
    nameFieldProps?: Omit<TextFieldProps, 'inputRef'>,
    emailFieldProps?: Omit<TextFieldProps, 'inputRef'>,
    passwordFieldProps?: Omit<TextFieldProps, 'type' | 'inputRef'>,
    passwordConfirmationFieldProps?: Omit<TextFieldProps, 'type' | 'inputRef'>,
    submitButtonProps?: Omit<ButtonProps, 'type' | 'disabled'>,
} & Omit<CardProps, 'onSubmit'>;

export default function SignUpFormCard({children, onSubmit, nameFieldProps, emailFieldProps, passwordFieldProps, passwordConfirmationFieldProps, submitButtonProps, ...cardProps}: SignUpFormCardProps) {
    const [submitting, setSubmitting] = React.useState<boolean>(false);
    const nameInputRef = React.useRef<HTMLInputElement>(null);
    const emailInputRef = React.useRef<HTMLInputElement>(null);
    const passwordInputRef = React.useRef<HTMLInputElement>(null);
    const passwordConfirmationInputRef = React.useRef<HTMLInputElement>(null);
    const handleSubmit = React.useCallback<React.FormEventHandler<HTMLFormElement>>(async (e: React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        setSubmitting(true);
        await onSubmit({
            name: nameInputRef.current?.value,
            email: emailInputRef.current?.value,
            password: passwordInputRef.current?.value,
            passwordConfirmation: passwordConfirmationInputRef.current?.value,
        });
        setSubmitting(false);
    }, [onSubmit, setSubmitting]);
    return (
        <Card {...cardProps}>
            <CardHeader title='Sign Up' />
            <form onSubmit={handleSubmit}>
                <CardContent>
                    <TextField inputRef={nameInputRef} label="name" placeholder="your name" {...nameFieldProps} />
                    <TextField inputRef={emailInputRef} label="email" placeholder="sample@example.com" {...emailFieldProps} />
                    <TextField inputRef={passwordInputRef} type='password' label="password" placeholder="password" {...passwordFieldProps} />
                    <TextField inputRef={passwordConfirmationInputRef} type='password' label="confirm password" placeholder="comfirm password" {...passwordConfirmationFieldProps} />
                </CardContent>
                <CardContent>
                    <Button type='submit' disabled={submitting} {...submitButtonProps}>ユーザー登録</Button>
                </CardContent>
                {children && <CardContent>{children}</CardContent>}
            </form>
        </Card>
    )
}