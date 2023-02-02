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
import { useFormWithValidation, Validate, ValidationRules } from '../hooks/form-with-validation';
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

type LoginFormValidationSettings = {
    [key in 'email' | 'password']: Validate;
};
const loginFormValidations: LoginFormValidationSettings = {
    email: ValidationRules.NO_CHECK,
    password: ValidationRules.NO_CHECK,
};

export function LoginForm({
    children,
    emailFieldProps,
    passwordFieldProps,
    submitButtonProps,
    afterLoginCallback,
    ...props
}: LoginFormProps) {
    const { login } = React.useContext(AuthContext);
    const { refs, validate, validateResults, clearValidateResults, setValidateResults } =
        useFormWithValidation(loginFormValidations);
    const onSubmit = React.useCallback(
        async (e: FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            clearValidateResults();
            if (!validate()) {
                return;
            }
            const loginResult = await login({
                email: refs.email.current?.value,
                password: refs.password.current?.value,
            });
            if (!loginResult.isSuccess) {
                setValidateResults({
                    email: {
                        isValid: false,
                        messages: loginResult.data.email,
                    },
                    password: {
                        isValid: false,
                        messages: loginResult.data.password,
                    },
                });
            }
            if (afterLoginCallback) {
                await afterLoginCallback(loginResult);
            }
        },
        [
            clearValidateResults,
            validate,
            login,
            refs.email,
            refs.password,
            afterLoginCallback,
            setValidateResults,
        ]
    );
    return (
        <FormWithSubmittingState onSubmit={onSubmit}>
            {(submitting) => (
                <Card {...props}>
                    <CardHeader title="Log In" />
                    <CardContent>
                        <TextField
                            {...emailFieldProps}
                            disabled={submitting || emailFieldProps?.disabled}
                            inputRef={refs.email}
                            label="email"
                            placeholder="sample@example.com"
                            helperText={validateResults?.email.messages}
                            error={!validateResults?.email.isValid}
                        />
                        <TextField
                            {...passwordFieldProps}
                            disabled={submitting || passwordFieldProps?.disabled}
                            inputRef={refs.password}
                            label="password"
                            type="password"
                            placeholder="password"
                            helperText={validateResults?.password.messages}
                            error={!validateResults?.password.isValid}
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
