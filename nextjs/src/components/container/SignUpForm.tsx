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
import React from 'react';
import { AuthContext } from '../context';
import { SignUpResult } from '../hooks';
import { FormWithSubmittingState, FormWithSubmittingStateProps } from '../presentational';

export type SignUpFormProps = {
    children?(submitting: boolean): React.ReactNode;
    afterSignUpCallback?(signUpResult: SignUpResult): Promise<void>;
    nameFieldProps?: Omit<TextFieldProps, 'inputRef'>;
    emailFieldProps?: Omit<TextFieldProps, 'inputRef'>;
    passwordFieldProps?: Omit<TextFieldProps, 'type' | 'inputRef'>;
    passwordConfirmationFieldProps?: Omit<TextFieldProps, 'type' | 'inputRef'>;
    submitButtonProps?: Omit<ButtonProps, 'type' | 'disabled'>;
} & Omit<FormWithSubmittingStateProps, 'onSubmit' | 'children'> &
    Omit<CardProps, 'onSubmit' | 'children'>;

export function SignUpForm({
    children,
    afterSignUpCallback,
    nameFieldProps,
    emailFieldProps,
    passwordFieldProps,
    passwordConfirmationFieldProps,
    submitButtonProps,
    ...props
}: SignUpFormProps) {
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
            if (afterSignUpCallback) {
                await afterSignUpCallback(signUpResult);
            }
        },
        [signUp, afterSignUpCallback]
    );
    return (
        <FormWithSubmittingState onSubmit={onSubmit}>
            {(submitting) => (
                <Card {...props}>
                    <CardHeader title="Sign Up" />
                    <CardContent {...props}>
                        <TextField
                            {...nameFieldProps}
                            disabled={submitting || nameFieldProps?.disabled}
                            inputRef={nameInputRef}
                            label="name"
                            placeholder="your name"
                        />
                        <TextField
                            {...emailFieldProps}
                            disabled={submitting || emailFieldProps?.disabled}
                            inputRef={emailInputRef}
                            label="email"
                            placeholder="sample@example.com"
                        />
                        <TextField
                            {...passwordFieldProps}
                            disabled={submitting || passwordFieldProps?.disabled}
                            inputRef={passwordInputRef}
                            type="password"
                            label="password"
                            placeholder="password"
                        />
                        <TextField
                            {...passwordConfirmationFieldProps}
                            disabled={submitting || passwordConfirmationFieldProps?.disabled}
                            inputRef={passwordConfirmationInputRef}
                            type="password"
                            label="confirm password"
                            placeholder="comfirm password"
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
