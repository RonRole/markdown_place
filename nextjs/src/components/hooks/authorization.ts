import axios, { Axios, AxiosError, AxiosResponse } from "axios";
import React from "react";
import AuthStatus from "../../domains/entities/auth-status";

export type UseAuthStateFunctions = {
    setCurrent(authStatue:AuthStatus) : void,
    login(email?:string, password?: string):Promise<boolean>,
    logout():Promise<void>,
}
export type UseAuthStateItems = [
    current : AuthStatus,
    useAuthStateFunctions: UseAuthStateFunctions
]

axios.defaults.baseURL = process.env.NEXT_PUBLIC_APP_API_URL;
axios.defaults.withCredentials = true;

/**
 * 
 * @returns UseAuthorizationItems
 */
export default function useAuthState() : UseAuthStateItems {
    const [current, setCurrent] = React.useState<AuthStatus>('loading');
    React.useEffect(()=>{
        axios
            .get('/api/user')
            .then((res:AxiosResponse)=>{
                if(res?.status === 200) {
                    setCurrent('authorized');
                    return
                }
                setCurrent('unauthorized');
            })
            .catch((error:AxiosError)=>setCurrent('unauthorized'));
    },[]);
    const login = React.useCallback(async (email:string, password:string)=>{
        await axios.get('/sanctum/csrf-cookie');
        const response = await axios.post('/api/login', {
            email,
            password
        });
        if(response?.status === 200) {
            setCurrent('authorized');
            return true;
        }
        return false;
    }, []);
    const logout = React.useCallback(async ()=>{
        await axios.post('/api/logout');
        setCurrent('unauthorized');
    }, [])
    return [
        current,
        {
            setCurrent,
            login,
            logout,
        }
    ]
}