import React from 'react';
import ArticleTag from '../../domains/article-tag';
import { AuthStatus } from '../../domains/auth-status';
import { LoginParams, SignUpParams, useAuthState, UseAuthStateFunctions } from '../hooks';
import { useTags } from '../hooks/tags';

export type AuthContext = {
    currentAuthStatus: AuthStatus;
    tags: ArticleTag[];
} & Omit<UseAuthStateFunctions, 'setAuthStatusIfSessionExists'>;

export type AuthContextProviderProps = {
    children: React.ReactNode;
};

export const AuthContext = React.createContext<AuthContext>({
    currentAuthStatus: AuthStatus.Loading,
    tags: [],
    setUnauthorized() {
        console.log('now is loading...');
    },
    async login(params: LoginParams) {
        return {
            isSuccess: false,
            data: {
                email: ['now is loading...'],
                password: ['now is loading...'],
            },
        };
    },
    async logout() {
        console.log('now is loading...');
    },
    async signUp(params: SignUpParams) {
        return {
            isSuccess: false,
            data: {
                name: ['now is loading...'],
                email: ['now is loading...'],
                password: ['now is loading...'],
                passwordConfirmation: ['now is loading...'],
            },
        };
    },
});

/**
 * AuthStatusとその更新メソッドを供給するコンポーネント
 * @param param0
 * @returns
 */
export function AuthContextProvider({ children }: AuthContextProviderProps) {
    const [
        currentAuthStatus,
        { setUnauthorized, setAuthStatusIfSessionExists, login, logout, signUp },
    ] = useAuthState();
    const { list } = useTags();
    const [tags, setTags] = React.useState<ArticleTag[]>([]);
    const loginWrapped = React.useCallback(
        async (params: LoginParams) => {
            const loginResult = await login(params);
            if (!loginResult.isSuccess) {
                return loginResult;
            }
            const listTagResult = await list({});
            if (listTagResult.isSuccess) {
                setTags(listTagResult.data);
            }
            return loginResult;
        },
        [list, login]
    );
    const logoutWrapped = React.useCallback(async () => {
        await logout();
        setTags([]);
    }, [logout]);
    const signUpWrapped = React.useCallback(
        async (params: SignUpParams) => {
            const signUpResult = await signUp(params);
            if (signUpResult.isSuccess) {
                setTags([]);
            }
            return signUpResult;
        },
        [signUp]
    );
    React.useEffect(() => {
        setAuthStatusIfSessionExists().then((sessionExists) => {
            if (!sessionExists) {
                return;
            }
            list({}).then((result) => {
                if (result.isSuccess) {
                    setTags(result.data);
                }
            });
        });
    }, [list, setAuthStatusIfSessionExists]);
    return (
        <AuthContext.Provider
            value={{
                currentAuthStatus,
                tags,
                setUnauthorized,
                login: loginWrapped,
                logout: logoutWrapped,
                signUp: signUpWrapped,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
