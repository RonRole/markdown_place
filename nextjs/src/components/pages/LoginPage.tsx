import { Box, Container, Link } from '@mui/material';
import NextLink from 'next/link';
import React from 'react';
import { LoginForm } from '../container';

export function LoginPage() {
    return (
        <Container
            maxWidth="xl"
            sx={{
                height: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <LoginForm
                emailFieldProps={{ fullWidth: true, sx: { mb: 1 } }}
                passwordFieldProps={{ fullWidth: true }}
                submitButtonProps={{ variant: 'outlined', fullWidth: true }}
                sx={{
                    maxWidth: 275,
                }}
            >
                {(submitting: boolean) => {
                    return (
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <NextLink href="/signup" passHref legacyBehavior>
                                <Link
                                    sx={
                                        submitting
                                            ? { color: 'gray', pointerEvents: 'none' }
                                            : undefined
                                    }
                                >
                                    新規登録
                                </Link>
                            </NextLink>
                        </Box>
                    );
                }}
            </LoginForm>
        </Container>
    );
}
