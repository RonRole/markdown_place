import axios, { AxiosResponse } from "axios";
import React from "react";
import AuthStatus from "../../domains/entities/auth-status";
import { getStatus } from "../effects/authorization";

export type AuthorizationStatusChecker = {
    children: React.ReactNode,
    authStatus: AuthStatus,
    setAuthStatus(authStatus:AuthStatus):void,
}

export function OnLoading({children}:{children: React.ReactNode}) : React.ReactElement {
    return (
        <>{children}</>
    )
}

    export function OnAuthorized({children}:{children: React.ReactNode}) : React.ReactElement {
    return (
        <>{children}</>
    )
}
        
export function OnUnauthorized({children}:{children: React.ReactNode}) : React.ReactElement {
    return (
        <>{children}</>
    )
}

export default function AuthorizationStatusChecker({children, authStatus, setAuthStatus }: AuthorizationStatusChecker) {
    React.useEffect(()=>{
        if(authStatus === 'authorized') {
            return;
        }
        setAuthStatus('loading');
        getStatus().then(setAuthStatus);
    }, []);
    const childrenArray = React.Children.toArray(children);
    switch(authStatus) {
        case 'loading':
            return (
                <>
                    {childrenArray.filter(child=>React.isValidElement(child) && child.type === OnLoading)}
                </>
            );
        case 'authorized':
            return ( 
                <>
                    {childrenArray.filter(child=>React.isValidElement(child) && child.type === OnAuthorized)}
                </>
            );
        case 'unauthorized':
            return ( 
                <>
                    {childrenArray.filter(child=>React.isValidElement(child) && child.type === OnUnauthorized)}
                </>
            );
    }
}