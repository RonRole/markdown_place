import React from "react"
import AuthStatus from "../../domains/entities/auth-status"
import useAuthState, { UseAuthStateFunctions, UseAuthStateItems } from "../hooks/authorization";

export type AuthContext = {
    currentAuthStatus: AuthStatus
} & UseAuthStateFunctions;

export type AuthContextProviderProps = {
    children: React.ReactNode,
}

export const AuthContext = React.createContext<AuthContext>({
    currentAuthStatus: 'loading',
    setCurrent(authStatue) {
        console.log('now is loading...');   
    },
    async login(email?:string, password?:string) {
        console.log('now is loading...');
        return false;
    },
    async logout() {
        console.log('now is loading...');
    },
});

/**
 * AuthStatusとその更新メソッドを供給するコンポーネント
 * @param param0 
 * @returns 
 */
export default function AuthContextProvider({children}: AuthContextProviderProps) {
    const [currentAuthStatus, functions] = useAuthState();
    return (
        <AuthContext.Provider value={{currentAuthStatus, ...functions}}> 
            {children}
        </AuthContext.Provider>
    )
}