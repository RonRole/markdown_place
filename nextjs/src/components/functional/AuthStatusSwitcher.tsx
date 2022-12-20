import axios, { AxiosResponse } from "axios";
import React from "react";
import AuthStatus from "../../domains/entities/auth-status";

export type AuthStatusSwitcherProps = {
    children: React.ReactNode,
    authStatus: AuthStatus,
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

/**
 * AuthStatusによって画面表示を切り替える
 * loading: OnLoading
 * authorized: OnAuthorized
 * unauthorized: OnUnAuthorized
 * @param param0 
 * @returns 
 */
export default function AuthStatusSwitcher({children, authStatus }: AuthStatusSwitcherProps) {
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