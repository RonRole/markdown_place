import {
    Button,
    ButtonProps,
    Card,
    CardContent,
    CardHeader,
    CardProps,
    TextField,
    TextFieldProps,
} from '@mui/material';
import React, { FormEvent } from 'react';
import { AuthContext } from '../context/AuthContextProvider';
import { LoginResult, UseAuthStateFunctions } from '../hooks';
import {
    FormWithSubmittingState,
    FormWithSubmittingStateProps,
} from '../presentational/FormWithSubmittingState';

export type LoginFormProps = {
    emailFieldProps?: Omit<TextFieldProps, 'inputRef'>;
    passwordFieldProps?: Omit<TextFieldProps, 'inputRef'>;
    submitButtonProps?: Omit<ButtonProps, 'type' | 'disabled'>;
    afterLoginCallback?(result: LoginResult): Promise<void>;
} & Omit<FormWithSubmittingStateProps, 'onSubmit'> &
    Omit<CardProps, 'children' | 'onSubmit'>;

export function LoginForm({
    children,
    emailFieldProps,
    passwordFieldProps,
    submitButtonProps,
    afterLoginCallback,
    ...props
}: LoginFormProps) {
    const { login } = React.useContext(AuthContext);
    const emailInputRef = React.useRef<HTMLInputElement>(null);
    const passwordInputRef = React.useRef<HTMLInputElement>(null);
    const onSubmit = React.useCallback(
        async (e: FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            const loginResult = await login({
                email: emailInputRef.current?.value,
                password: passwordInputRef.current?.value,
            });
            if (afterLoginCallback) {
                await afterLoginCallback(loginResult);
            }
        },
        [login, afterLoginCallback]
    );
    return (
        <FormWithSubmittingState onSubmit={onSubmit}>
            {(submitting) => (
                <Card {...props}>
                    <CardHeader title="Sawai Kei" />
                    <CardContent>
                        <TextField
                            inputRef={emailInputRef}
                            label="email"
                            placeholder="sample@example.com"
                            {...emailFieldProps}
                        />
                        <TextField
                            inputRef={passwordInputRef}
                            label="password"
                            type="password"
                            placeholder="password"
                            {...passwordFieldProps}
                        />
                    </CardContent>
                    <CardContent>
                        <Button type="submit" disabled={submitting} {...submitButtonProps}>
                            ログイン
                        </Button>
                    </CardContent>
                    {children && <CardContent>{children(submitting)}</CardContent>}
                </Card>
            )}
        </FormWithSubmittingState>
    );
}
