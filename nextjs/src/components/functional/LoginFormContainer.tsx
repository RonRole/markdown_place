import { Container } from "@mui/material";
import axios, { AxiosResponse } from "axios";
import { useRouter } from "next/router";
import React from "react";
import AuthStatus from "../../domains/entities/auth-status";

import { auth } from "../effects/authorization";
import LoginForm, { LoginFormInput } from "../present/LoginForm";

export type LoginFormContainerProps = {
    setAuthStatus(authStatus:AuthStatus):void;
}

export default function LoginFormContainer({setAuthStatus}:LoginFormContainerProps) {
    const router = useRouter();
    const [submitting, setSubmitting] = React.useState<boolean>(false);
    const onSubmit = React.useCallback(async ({email, password}:LoginFormInput)=>{
        setSubmitting(true);
        const authStatus = await auth(email, password);
        setSubmitting(false);
        if(authStatus === 'authorized') {
            setAuthStatus(authStatus);
            router.push('/');
        }
    }, []);
    return (
        <Container sx={{height:'100vh', display:'flex', justifyContent:'center', alignItems:'center'}}>
            <LoginForm 
                onSubmit={onSubmit} 
                emailFieldProps={{fullWidth:true, margin: 'normal'}}
                passwordFieldProps={{fullWidth:true}}
                submitButtonProps={{variant:'outlined', fullWidth:true, disabled:submitting}}
                sx={{
                    maxWidth: 275
                }}
                />
        </Container>
    )
}