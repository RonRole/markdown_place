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
import { useRouter } from 'next/router';
import React from 'react';
import { AuthContext } from '../context';
import { FormWithSubmittingState, FormWithSubmittingStateProps } from '../presentational';

export type SignUpFormProps = {
    nameFieldProps?: Omit<TextFieldProps, 'inputRef'>;
    emailFieldProps?: Omit<TextFieldProps, 'inputRef'>;
    passwordFieldProps?: Omit<TextFieldProps, 'type' | 'inputRef'>;
    passwordConfirmationFieldProps?: Omit<TextFieldProps, 'type' | 'inputRef'>;
    submitButtonProps?: Omit<ButtonProps, 'type' | 'disabled'>;
} & Omit<FormWithSubmittingStateProps, 'onSubmit'> &
    Omit<CardProps, 'onSubmit'>;

export function SignUpForm({
    children,
    nameFieldProps,
    emailFieldProps,
    passwordFieldProps,
    passwordConfirmationFieldProps,
    submitButtonProps,
    ...props
}: SignUpFormProps) {
    const router = useRouter();
    const { signUp } = React.useContext(AuthContext);
    const nameInputRef = React.useRef<HTMLInputElement>(null);
    const emailInputRef = React.useRef<HTMLInputElement>(null);
    const passwordInputRef = React.useRef<HTMLInputElement>(null);
    const passwordConfirmationInputRef = React.useRef<HTMLInputElement>(null);
    const onSubmit = React.useCallback(
        async (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            const signUpResult = await signUp({
                name: nameInputRef.current?.value,
                email: emailInputRef.current?.value,
                password: passwordInputRef.current?.value,
                passwordConfirmation: passwordConfirmationInputRef.current?.value,
            });
            if (signUpResult === true) {
                await router.push('/');
            } else {
                console.log(signUpResult);
            }
        },
        [signUp, router]
    );
    return (
        <FormWithSubmittingState onSubmit={onSubmit}>
            {(submitting) => (
                <Card {...props}>
                    <CardHeader title="Sign Up" />
                    <CardContent {...props}>
                        <TextField
                            inputRef={nameInputRef}
                            label="name"
                            placeholder="your name"
                            {...nameFieldProps}
                        />
                        <TextField
                            inputRef={emailInputRef}
                            label="email"
                            placeholder="sample@example.com"
                            {...emailFieldProps}
                        />
                        <TextField
                            inputRef={passwordInputRef}
                            type="password"
                            label="password"
                            placeholder="password"
                            {...passwordFieldProps}
                        />
                        <TextField
                            inputRef={passwordConfirmationInputRef}
                            type="password"
                            label="confirm password"
                            placeholder="comfirm password"
                            {...passwordConfirmationFieldProps}
                        />
                    </CardContent>
                    <CardContent>
                        <Button type="submit" disabled={submitting} {...submitButtonProps}>
                            ユーザー登録
                        </Button>
                    </CardContent>
                    {children && <CardContent>{children(submitting)}</CardContent>}
                </Card>
            )}
        </FormWithSubmittingState>
    );
}
