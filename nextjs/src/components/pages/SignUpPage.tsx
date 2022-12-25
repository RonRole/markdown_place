import { Box, Container, Link } from "@mui/material";
import { SignUpForm } from "../container/SignUpForm";
import NextLink from "next/link";

export function SignUpPage() {
    return (
        <Container maxWidth='xl' sx={({height: '100vh', display:'flex', justifyContent:'center', alignItems:'center'})}>
            <SignUpForm
                nameFieldProps={{fullWidth: true, sx:{mb:1}}}
                emailFieldProps={{fullWidth: true, sx:{mb:1}}}
                passwordFieldProps={{fullWidth: true, sx:{mb:1}}}
                passwordConfirmationFieldProps={{fullWidth: true}}
                submitButtonProps={{variant: 'outlined', fullWidth: true}}
                sx={{
                    maxWidth: 275
                }}
            >
                <Box sx={{display:'flex', justifyContent:'center'}}>
                    <NextLink href='/' passHref legacyBehavior>
                        <Link>トップページへ</Link>
                    </NextLink>
                </Box>
            </SignUpForm>
        </Container>
    )
}