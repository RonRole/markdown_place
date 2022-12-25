import {
    Button,
    ButtonProps,
    CardContent,
    CardHeader,
    TextField,
    TextFieldProps,
} from '@mui/material';
import { useRouter } from 'next/router';
import React from 'react';
import { AuthContext } from '../context';
import { FormCard, FormCardProps } from '../presentational';

export type SignUpFormProps = {
    nameFieldProps?: Omit<TextFieldProps, 'inputRef'>;
    emailFieldProps?: Omit<TextFieldProps, 'inputRef'>;
    passwordFieldProps?: Omit<TextFieldProps, 'type' | 'inputRef'>;
    passwordConfirmationFieldProps?: Omit<TextFieldProps, 'type' | 'inputRef'>;
    submitButtonProps?: Omit<ButtonProps, 'type' | 'disabled'>;
} & Omit<FormCardProps, 'onSubmit'>;

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
            const successed = await signUp(
                nameInputRef.current?.value,
                emailInputRef.current?.value,
                passwordInputRef.current?.value,
                passwordConfirmationInputRef.current?.value
            );
            if (successed) {
                await router.push('/');
            }
        },
        [signUp, router]
    );
    return (
        <FormCard onSubmit={onSubmit}>
            {(submitting) => (
                <>
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
                </>
            )}
        </FormCard>
    );
}
