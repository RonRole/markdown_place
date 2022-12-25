import { Button, ButtonProps, Card, CardContent, CardHeader, CardHeaderProps, CardProps, TextField, TextFieldProps } from "@mui/material";
import React from "react";

export type LoginFormInput = {
    email?: string;
    password?: string;
}

export type LoginFormCardProps = {
    children?: React.ReactNode,
    onSubmit: (input: LoginFormInput)=>Promise<void>,
    emailFieldProps?: Omit<TextFieldProps, 'inputRef'>,
    passwordFieldProps?: Omit<TextFieldProps, 'inputRef'>,
    submitButtonProps? : Omit<ButtonProps, 'type' | 'disabled'>
} & Omit<CardProps, 'onSubmit'>

export function LoginFormCard({children, emailFieldProps, passwordFieldProps, submitButtonProps, onSubmit, ...cardProps} : LoginFormCardProps) {
    const [submitting, setSubmitting] = React.useState<boolean>(false);
    const emailInputRef    = React.useRef<HTMLInputElement>(null);
    const passwordInputRef = React.useRef<HTMLInputElement>(null);
    const handleSubmit = React.useCallback<React.FormEventHandler<HTMLFormElement>>(async (e: React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        setSubmitting(true);
        await onSubmit({
            email: emailInputRef.current?.value,
            password: passwordInputRef.current?.value
        });
        setSubmitting(false);
    },[onSubmit]);
    return (
        <Card {...cardProps}>
            <CardHeader title='Sawai Kei'/>
            <form onSubmit={handleSubmit}>
                <CardContent>
                    <TextField inputRef={emailInputRef} label="email" placeholder='sample@example.com' {...emailFieldProps}/>
                    <TextField inputRef={passwordInputRef} label="password" type='password' placeholder='password' {...passwordFieldProps} />
                </CardContent>
                <CardContent>
                    <Button type='submit' disabled={submitting} {...submitButtonProps}>ログイン</Button>
                </CardContent>
                {children && <CardContent>{children}</CardContent>}
            </form>
        </Card>
    )
}