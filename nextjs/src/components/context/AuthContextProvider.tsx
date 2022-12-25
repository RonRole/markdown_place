import React from "react"
import AuthStatus from "../../domains/entities/auth-status"
import { useAuthState, UseAuthStateFunctions } from "../hooks";

export type AuthContext = {
    currentAuthStatus: AuthStatus
} & UseAuthStateFunctions;

export type AuthContextProviderProps = {
    children: React.ReactNode,
}

export const AuthContext = React.createContext<AuthContext>({
    currentAuthStatus: 'loading',
    setUnauthorized() {
        console.log('now is loading...');   
    },
    async login(email?:string, password?:string) {
        console.log('now is loading...');
        return false;
    },
    async logout() {
        console.log('now is loading...');
    },
    async signUp(email?:string, password?:string, passwordConfirmation?:string) {
        console.log('now is loading...');
        return false;
    }
});

/**
 * AuthStatusとその更新メソッドを供給するコンポーネント
 * @param param0 
 * @returns 
 */
export function AuthContextProvider({children}: AuthContextProviderProps) {
    const [currentAuthStatus, functions] = useAuthState();
    return (
        <AuthContext.Provider value={{currentAuthStatus, ...functions}}> 
            {children}
        </AuthContext.Provider>
    )
}