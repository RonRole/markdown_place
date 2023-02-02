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
import { InputError } from '../../errors';
import { AuthContext } from '../context';
import { SignUpParams, SignUpResult } from '../hooks';
import { useFormWithValidation, Validate, ValidationRules } from '../hooks/form-with-validation';
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

type SignUpFormValidationSettings = {
    [key in 'name' | 'email' | 'password' | 'passwordConfirmation']: Validate;
};

const signUpFormValidations: SignUpFormValidationSettings = {
    name: ValidationRules.NO_CHECK,
    email: ValidationRules.NO_CHECK,
    password: ValidationRules.NO_CHECK,
    passwordConfirmation: ValidationRules.NO_CHECK,
};

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
    const { refs, validate, validateResults, clearValidateResults, setValidateResults } =
        useFormWithValidation(signUpFormValidations);
    const onSubmit = React.useCallback(
        async (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            clearValidateResults();
            if (!validate()) {
                return;
            }
            const signUpResult = await signUp({
                name: refs.name.current?.value,
                email: refs.email.current?.value,
                password: refs.password.current?.value,
                passwordConfirmation: refs.passwordConfirmation.current?.value,
            });
            if (!signUpResult.isSuccess) {
                setValidateResults({
                    name: { isValid: !signUpResult.data.name, messages: signUpResult.data.name },
                    email: { isValid: !signUpResult.data.email, messages: signUpResult.data.email },
                    password: {
                        isValid: !signUpResult.data.password,
                        messages: signUpResult.data.password,
                    },
                    passwordConfirmation: {
                        isValid: !signUpResult.data.passwordConfirmation,
                        messages: signUpResult.data.passwordConfirmation,
                    },
                });
            }
            if (afterSignUpCallback) {
                await afterSignUpCallback(signUpResult);
            }
        },
        [
            clearValidateResults,
            validate,
            signUp,
            refs.name,
            refs.email,
            refs.password,
            refs.passwordConfirmation,
            afterSignUpCallback,
            setValidateResults,
        ]
    );
    return (
        <FormWithSubmittingState onSubmit={onSubmit}>
            {(submitting) => (
                <Card {...props}>
                    <CardHeader title="Sign Up" />
                    <CardContent>
                        <TextField
                            {...nameFieldProps}
                            disabled={submitting || nameFieldProps?.disabled}
                            inputRef={refs.name}
                            label="name"
                            placeholder="your name"
                            error={!validateResults.name.isValid}
                            helperText={validateResults.name.messages}
                        />
                        <TextField
                            {...emailFieldProps}
                            disabled={submitting || emailFieldProps?.disabled}
                            inputRef={refs.email}
                            label="email"
                            placeholder="sample@example.com"
                            error={!validateResults.email.isValid}
                            helperText={validateResults.email.messages}
                        />
                        <TextField
                            {...passwordFieldProps}
                            disabled={submitting || passwordFieldProps?.disabled}
                            inputRef={refs.password}
                            type="password"
                            label="password"
                            placeholder="password"
                            error={!validateResults.password.isValid}
                            helperText={validateResults.password.messages}
                        />
                        <TextField
                            {...passwordConfirmationFieldProps}
                            disabled={submitting || passwordConfirmationFieldProps?.disabled}
                            inputRef={refs.passwordConfirmation}
                            type="password"
                            label="confirm password"
                            placeholder="comfirm password"
                            error={!validateResults.passwordConfirmation.isValid}
                            helperText={validateResults.passwordConfirmation.messages}
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
