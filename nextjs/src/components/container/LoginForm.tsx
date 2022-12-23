import React from "react";
import { AuthContext } from "../context/AuthContextProvider";
import { LoginFormCard, LoginFormCardProps, LoginFormInput } from "../presentational/LoginFormCard";

export type LoginFormProps = Omit<LoginFormCardProps, 'onSubmit'>;

export function LoginForm(props: LoginFormProps) {
    const {login} = React.useContext(AuthContext);
    const onSubmit = React.useCallback(async ({email, password}: LoginFormInput)=>{
        await login(email, password);
    },[login]);
    return (
        <LoginFormCard onSubmit={onSubmit} {...props} />
    )
}