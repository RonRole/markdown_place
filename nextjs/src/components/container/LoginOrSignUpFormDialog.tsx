import { Box, Container, Dialog, DialogProps, Link as MuiLink } from '@mui/material';
import React from 'react';
import { LoginForm, LoginFormProps } from './LoginForm';
import { SignUpForm, SignUpFormProps } from './SignUpForm';

type LoginFormInDialogProps = {
    onClickLinkToSignUp(): Promise<void>;
} & Pick<LoginFormProps, 'afterLoginCallback'>;
const LoginFormInDialog = ({ onClickLinkToSignUp, afterLoginCallback }: LoginFormInDialogProps) => {
    return (
        <LoginForm
            sx={{ width: '100%', maxWidth: 275 }}
            emailFieldProps={{ fullWidth: true, sx: { mb: 1 } }}
            passwordFieldProps={{ fullWidth: true }}
            submitButtonProps={{ fullWidth: true, variant: 'outlined' }}
            afterLoginCallback={afterLoginCallback}
        >
            {(submitting) => (
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <MuiLink
                        onClick={onClickLinkToSignUp}
                        sx={{
                            cursor: 'pointer',
                            ...(submitting ? { color: 'gray', pointerEvents: 'none' } : {}),
                        }}
                    >
                        ユーザー登録
                    </MuiLink>
                </Box>
            )}
        </LoginForm>
    );
};

type SignUpFormInDialogProps = {
    onClickLinkToLogin(): Promise<void>;
} & Pick<SignUpFormProps, 'afterSignUpCallback'>;
const SignUpFormInDialog = ({
    onClickLinkToLogin,
    afterSignUpCallback,
}: SignUpFormInDialogProps) => {
    return (
        <SignUpForm
            sx={{ width: '100%', maxWidth: 275 }}
            afterSignUpCallback={afterSignUpCallback}
            nameFieldProps={{ fullWidth: true, sx: { mb: 1 } }}
            emailFieldProps={{ fullWidth: true, sx: { mb: 1 } }}
            passwordFieldProps={{ fullWidth: true, sx: { mb: 1 } }}
            passwordConfirmationFieldProps={{ fullWidth: true, sx: { mb: 1 } }}
            submitButtonProps={{ fullWidth: true, variant: 'outlined' }}
        >
            {(submitting) => (
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <MuiLink
                        onClick={onClickLinkToLogin}
                        sx={{
                            cursor: 'pointer',
                            ...(submitting ? { color: 'gray', pointerEvents: 'none' } : {}),
                        }}
                    >
                        ログイン
                    </MuiLink>
                </Box>
            )}
        </SignUpForm>
    );
};

export type LoginOrSignUpFormDialogProps = Pick<LoginFormInDialogProps, 'afterLoginCallback'> &
    Pick<SignUpFormInDialogProps, 'afterSignUpCallback'> &
    DialogProps;

export function LoginOrSignUpFormDialog({
    afterLoginCallback,
    afterSignUpCallback,
    ...props
}: LoginOrSignUpFormDialogProps) {
    const [formType, setFormType] = React.useState<'login' | 'signup'>('login');
    const changeToSignUp = React.useCallback(async () => setFormType('signup'), []);
    const changeToLogin = React.useCallback(async () => setFormType('login'), []);
    return (
        <Dialog {...props}>
            {formType === 'login' && (
                <LoginFormInDialog
                    onClickLinkToSignUp={changeToSignUp}
                    afterLoginCallback={afterLoginCallback}
                />
            )}
            {formType === 'signup' && (
                <SignUpFormInDialog
                    onClickLinkToLogin={changeToLogin}
                    afterSignUpCallback={afterSignUpCallback}
                />
            )}
        </Dialog>
    );
}
