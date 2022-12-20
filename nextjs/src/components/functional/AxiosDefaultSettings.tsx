import axios, { AxiosResponse } from "axios";
import React from "react";
import AuthStatus from "../../domains/entities/auth-status";

export type AxiosDefaultSettingsProviderProps = {
    children: React.ReactNode,
    setAuthStatus(authStatus:AuthStatus):void,
}

export default function AxiosDefaultSettings({children, setAuthStatus}: AxiosDefaultSettingsProviderProps) {
    axios.defaults.baseURL = process.env.NEXT_PUBLIC_APP_API_URL;
    axios.defaults.withCredentials = true;
    axios.interceptors.response.use(
        (value:AxiosResponse)=> value,
        (error: any) => {
            switch(error.response?.status) {
                case 401:
                case 419:
                case 422:
                    setAuthStatus('unauthorized');
                    return Promise.reject(error.response?.data);
            }
        });
    return (
        <>{children}</>
    )
}