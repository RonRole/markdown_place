import axios, { AxiosResponse } from 'axios';
import React from 'react';
import { AuthContext } from '../context';

export type AxiosInterceptorsSettingsProps = {
    children: React.ReactNode;
};

export function AxiosInterceptorsSettings({ children }: AxiosInterceptorsSettingsProps) {
    const { setUnauthorized } = React.useContext(AuthContext);
    axios.interceptors.response.use(
        (value: AxiosResponse) => value,
        (error: any) => {
            switch (error.response?.status) {
                case 401:
                    setUnauthorized();
            }
            return Promise.reject(error);
        }
    );
    return <>{children}</>;
}
