import axios, { Axios, AxiosError, AxiosResponse } from 'axios';
import React from 'react';
import { AuthStatus } from '../../domains/auth-status';
import { ServerErrorFormat } from '../../errors';
import { InputError } from '../../errors/input_error';
import { ApiResponse } from './api-response';

export type LoginParams = {
    email?: string;
    password?: string;
};

export type LoginResult = ApiResponse<null, InputError<LoginParams>>;

export type SignUpParams = {
    name?: string;
    email?: string;
    password?: string;
    passwordConfirmation?: string;
};

export type SignUpResult = ApiResponse<null, InputError<SignUpParams>>;

export type UseAuthStateFunctions = {
    setUnauthorized(): void;
    setAuthStatusIfSessionExists(): Promise<boolean>;
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
    const setUnauthorized = React.useCallback(() => setCurrent(AuthStatus.Unauthorized), []);
    const setAuthStatusIfSessionExists = React.useCallback(async () => {
        const response = await axios.get('/api/user').catch(() => false as false);
        if (!response) {
            setCurrent(AuthStatus.Unauthorized);
            return false;
        }
        const authStatus = response.data?.is_admin
            ? AuthStatus.AuthorizedAsAdmin
            : AuthStatus.AuthorizedAsNormal;
        setCurrent(authStatus);
        return true;
    }, []);
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
                return {
                    isSuccess: true as true,
                    data: null,
                };
            })
            .catch((error: AxiosError) => {
                const errorData = error.response?.data as ServerErrorFormat;
                return {
                    isSuccess: false as false,
                    data: {
                        email: errorData?.errors?.email,
                        password: errorData?.errors?.password,
                    },
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
                    return {
                        isSuccess: true as true,
                        data: null,
                    };
                })
                .catch((error: AxiosError) => {
                    const errorData = error.response?.data as ServerErrorFormat;
                    return {
                        isSuccess: false as false,
                        data: {
                            name: errorData?.errors?.name,
                            email: errorData?.errors?.email,
                            password: errorData?.errors?.password,
                            passwordConfirmation: errorData?.errors?.password_confirmation,
                        },
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
            setAuthStatusIfSessionExists,
            login,
            logout,
            signUp,
        },
    ];
}
