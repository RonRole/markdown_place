import axios, { Axios, AxiosError, AxiosResponse } from 'axios';
import React from 'react';
import { AuthStatus } from '../../domains/auth-status';
import { ServerErrorFormat } from '../../errors';
import { InputError } from '../../errors/input_error';

export type LoginParams = {
    email?: string;
    password?: string;
};

export type LoginResult = true | InputError<LoginParams>;

export type SignUpParams = {
    name?: string;
    email?: string;
    password?: string;
    passwordConfirmation?: string;
};

export type SignUpResult = true | InputError<LoginParams>;

export type UseAuthStateFunctions = {
    setUnauthorized(): void;
    login(params: LoginParams): Promise<LoginResult>;
    logout(): Promise<void>;
    signUp(params: SignUpParams): Promise<SignUpResult>;
};
export type UseAuthStateItems = [current: AuthStatus, useAuthStateFunctions: UseAuthStateFunctions];

axios.defaults.baseURL = process.env.NEXT_PUBLIC_APP_API_URL;
axios.defaults.withCredentials = true;

/**
 *
 * @returns UseAuthorizationItems
 */
export function useAuthState(): UseAuthStateItems {
    const [current, setCurrent] = React.useState<AuthStatus>(AuthStatus.Loading);
    React.useEffect(() => {
        axios
            .get('/api/user')
            .then((res: AxiosResponse) => {
                const authStatus = res.data?.is_admin
                    ? AuthStatus.AuthorizedAsAdmin
                    : AuthStatus.AuthorizedAsNormal;
                setCurrent(authStatus);
                return;
            })
            .catch((error: AxiosError) => setCurrent(AuthStatus.Unauthorized));
    }, []);
    const setUnauthorized = React.useCallback(() => setCurrent(AuthStatus.Unauthorized), []);
    const login = React.useCallback(async ({ email, password }: LoginParams) => {
        await axios.get('/sanctum/csrf-cookie');
        const result: LoginResult = await axios
            .post('/api/login', {
                email,
                password,
            })
            .then((res: AxiosResponse) => {
                const authStatus = res.data?.is_admin
                    ? AuthStatus.AuthorizedAsAdmin
                    : AuthStatus.AuthorizedAsNormal;
                setCurrent(authStatus);
                return true as true;
            })
            .catch((error: AxiosError) => {
                const errorData = error.response?.data as ServerErrorFormat;
                return {
                    email: errorData?.errors?.email,
                    password: errorData?.errors?.password,
                };
            });
        return result;
    }, []);
    const logout = React.useCallback(async () => {
        await axios.post('/api/logout').finally(() => {
            setCurrent(AuthStatus.Unauthorized);
        });
    }, []);
    const signUp = React.useCallback(
        async ({ name, email, password, passwordConfirmation }: SignUpParams) => {
            await axios.get('/sanctum/csrf-cookie');
            const result = await axios
                .post('/api/register', {
                    name,
                    email,
                    password,
                    password_confirmation: passwordConfirmation,
                })
                .then((_: AxiosResponse) => {
                    setCurrent(AuthStatus.AuthorizedAsNormal);
                    return true as true;
                })
                .catch((error: AxiosError) => {
                    const errorData = error.response?.data as ServerErrorFormat;
                    return {
                        name: errorData?.errors?.name,
                        email: errorData?.errors?.email,
                        password: errorData?.errors?.password,
                        passwordConfirmation: errorData?.errors?.password_confirmation,
                    };
                });
            return result;
        },
        []
    );
    return [
        current,
        {
            setUnauthorized,
            login,
            logout,
            signUp,
        },
    ];
}
