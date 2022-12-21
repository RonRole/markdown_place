import axios, { AxiosResponse } from "axios";
import { UseAuthStateFunctions } from "../hooks/authorization";

export type AxiosInterceptorsSettingsProps = {
    children: React.ReactNode,
    setCurrent: UseAuthStateFunctions['setCurrent']
}

export default function AxiosInterceptorsSettings({children, setCurrent}: AxiosInterceptorsSettingsProps) {
    axios.interceptors.response.use(
        (value:AxiosResponse)=> value,
        (error: any) => {
            switch(error.response?.status) {
                case 401:
                case 419:
                case 422:
                    setCurrent('unauthorized');
                    return Promise.reject(error.response?.data);
            }
        });
    return <>{children}</>;
}