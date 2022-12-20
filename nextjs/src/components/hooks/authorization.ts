import axios, { Axios, AxiosResponse } from "axios";
import React from "react";
import AuthStatus from "../../domains/entities/auth-status";

export type UseAuthorizationReturnType = {
    getStatus():Promise<AuthStatus>,
    auth(email?:string, password?: string):Promise<AuthStatus>,
}

export default function useAuthorization() : UseAuthorizationReturnType {
    const getStatus = React.useCallback(async ()=>{
        const response = await axios.get('/api/user');
        if(response?.status === 204) {
            return 'authorized';
        }
        return 'unauthorized';
    }, []);
    const auth = React.useCallback(async (email:string, password:string)=>{
        await axios.get('/sanctum/csrf-cookie');
        const response = await axios.post('/api/login', {
            email,
            password
        });
        if(response?.status === 200) return 'authorized';
        return 'unauthorized';
    }, []);
    return {
        getStatus,
        auth,
    }
}