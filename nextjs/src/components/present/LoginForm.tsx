import { Button, ButtonProps, Card, CardContent, CardProps, TextField, TextFieldProps } from "@mui/material";
import React from "react";

export type LoginFormInput = {
    email?: string;
    password?: string;
}

export type LoginFormProps = {
    onSubmit: (input: LoginFormInput)=>Promise<void>,
    emailFieldProps?: Omit<TextFieldProps, 'inputRef'>,
    passwordFieldProps?: Omit<TextFieldProps, 'inputRef'>,
    submitButtonProps? : Omit<ButtonProps, 'type'>
} & Omit<CardProps, 'onSubmit'>

export default function LoginForm({emailFieldProps, passwordFieldProps, submitButtonProps, onSubmit, ...cardProps} : LoginFormProps) {
    const emailInputRef    = React.useRef<HTMLInputElement>(null);
    const passwordInputRef = React.useRef<HTMLInputElement>(null);
    const handleSubmit = React.useCallback<React.FormEventHandler<HTMLFormElement>>(async (e: React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        await onSubmit({
            email: emailInputRef.current?.value,
            password: passwordInputRef.current?.value
        });
    },[]);
    return (
        <Card {...cardProps}>
            <form onSubmit={handleSubmit}>
                <CardContent>
                    <TextField inputRef={emailInputRef} label="email" placeholder='sample@example.com' {...emailFieldProps}/>
                    <TextField inputRef={passwordInputRef} label="password" type='password' placeholder='password' {...passwordFieldProps} />
                </CardContent>
                <CardContent>
                    <Button type='submit' {...submitButtonProps}>ログイン</Button>
                </CardContent>
            </form>
        </Card>
    )
}