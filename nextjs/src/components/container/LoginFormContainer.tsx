import { Container } from "@mui/material";
import React from "react";
import { useAuthorization } from "../hooks";
import { UseAuthStateFunctions } from "../hooks/authorization";

import LoginForm, { LoginFormInput } from "./LoginForm";

export type LoginFormContainerProps = {
    login: UseAuthStateFunctions['login']
}

export default function LoginFormContainer({login}:LoginFormContainerProps) {
    const [submitting, setSubmitting] = React.useState<boolean>(false);
    const onSubmit = React.useCallback(async ({email, password}:LoginFormInput)=>{
        setSubmitting(true);
        await login(email, password);
        setSubmitting(false);
    }, [login]);
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