import { Container } from "@mui/material";
import React from "react";
import { LoginForm } from "../container";

export function LoginPage() {
    return (
        <Container maxWidth='xl' sx={{height:'100vh', display:'flex', justifyContent:'center', alignItems:'center'}}>
            <LoginForm
                emailFieldProps={{fullWidth:true, margin: 'normal'}}
                passwordFieldProps={{fullWidth:true}}
                submitButtonProps={{variant:'outlined', fullWidth:true}}
                sx={{
                    maxWidth: 275
                }}
                />
        </Container>
    )
}