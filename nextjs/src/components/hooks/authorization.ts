import axios, { Axios, AxiosError, AxiosResponse } from 'axios';
import React from 'react';
import AuthStatus from '../../domains/auth-status';
import { InputError } from '../../errors/input_error';

export type LoginParams = {
    email?: string;
    password?: string;
};

export type SignUpParams = {
    name?: string;
    email?: string;
    password?: string;
    passwordConfirmation?: string;
};

type ServerErrorFormat = {
    errors: {
        [key: string]: string[];
    };
    message: string;
};

export type UseAuthStateFunctions = {
    setUnauthorized(): void;
    login(params: LoginParams): Promise<true | InputError<LoginParams>>;
    logout(): Promise<void>;
    signUp(params: SignUpParams): Promise<true | InputError<SignUpParams>>;
};
export type UseAuthStateItems = [current: AuthStatus, useAuthStateFunctions: UseAuthStateFunctions];

axios.defaults.baseURL = process.env.NEXT_PUBLIC_APP_API_URL;
axios.defaults.withCredentials = true;

/**
 *
 * @returns UseAuthorizationItems
 */
export function useAuthState(): UseAuthStateItems {
    const [current, setCurrent] = React.useState<AuthStatus>('loading');
    React.useEffect(() => {
        axios
            .get('/api/user')
            .then((res: AxiosResponse) => {
                if (res?.status === 200) {
                    setCurrent('authorized');
                    return;
                }
                setCurrent('unauthorized');
            })
            .catch((error: AxiosError) => setCurrent('unauthorized'));
    }, []);
    const setUnauthorized = React.useCallback(() => setCurrent('unauthorized'), []);
    const login = React.useCallback(async ({ email, password }: LoginParams) => {
        await axios.get('/sanctum/csrf-cookie');
        const result = await axios
            .post('/api/login', {
                email,
                password,
            })
            .then((res: AxiosResponse) => {
                if (res.status === 200) {
                    setCurrent('authorized');
                    return true;
                }
                alert('予期しないエラーが発生しました');
                return {};
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
            setCurrent('unauthorized');
        });
    }, []);
    const signUp = React.useCallback(
        async ({ name, email, password, passwordConfirmation }: SignUpParams) => {
            const result = await axios
                .post('/api/register', {
                    name,
                    email,
                    password,
                    password_confirmation: passwordConfirmation,
                })
                .then((value: AxiosResponse) => {
                    if (value.status === 201) {
                        setCurrent('authorized');
                        return true;
                    }
                    alert('予期しないエラーが発生しました');
                    return {};
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
