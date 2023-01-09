import React from 'react';
import { AuthStatus } from '../../domains/auth-status';
import { LoginParams, SignUpParams, useAuthState, UseAuthStateFunctions } from '../hooks';

export type AuthContext = {
    currentAuthStatus: AuthStatus;
} & UseAuthStateFunctions;

export type AuthContextProviderProps = {
    children: React.ReactNode;
};

export const AuthContext = React.createContext<AuthContext>({
    currentAuthStatus: AuthStatus.Loading,
    setUnauthorized() {
        console.log('now is loading...');
    },
    async login(params: LoginParams) {
        return {
            email: ['now is loading...'],
            password: ['now is loading...'],
        };
    },
    async logout() {
        console.log('now is loading...');
    },
    async signUp(params: SignUpParams) {
        return {
            name: ['now is loading...'],
            email: ['now is loading...'],
            password: ['now is loading...'],
            passwordConfirmation: ['now is loading...'],
        };
    },
});

/**
 * AuthStatusとその更新メソッドを供給するコンポーネント
 * @param param0
 * @returns
 */
export function AuthContextProvider({ children }: AuthContextProviderProps) {
    const [currentAuthStatus, functions] = useAuthState();
    return (
        <AuthContext.Provider value={{ currentAuthStatus, ...functions }}>
            {children}
        </AuthContext.Provider>
    );
}
