import Context from "@mui/base/TabsUnstyled/TabsContext"
import { Axios, AxiosResponse } from "axios"
import React from "react"
import AuthStatus from "../../domains/entities/auth-status"

export type AuthContext = {
    authStatus: AuthStatus,
    setAuthStatus(status:AuthStatus):void,
}

export type AuthContextProviderProps = {
    children: React.ReactNode,
}

export const AppContext = React.createContext<AuthContext>({
    authStatus: 'loading',
    setAuthStatus(status:AuthStatus){},
});

export default function AuthContextProvider({children}: AuthContextProviderProps) {
    const [authStatus, setAuthStatus] = React.useState<AuthStatus>('loading');
    const context: AuthContext = {
        authStatus,
        setAuthStatus,
    }
    return (
        <AppContext.Provider value={context}> 
            {children}
        </AppContext.Provider>
    )
}