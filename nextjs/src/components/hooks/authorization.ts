import axios, { Axios, AxiosResponse } from "axios";
import AuthStatus from "../../domains/entities/auth-status";

export type UseAuthorizationReturnType = {
    getStatus():Promise<AuthStatus>,
    auth(email?:string, password?: string):Promise<AuthStatus>,
}

export default function useAuthorization() : UseAuthorizationReturnType {
    return {
        async getStatus(): Promise<AuthStatus>  {
            const response = await axios.get('/api/user');
            if(response?.status === 200) {
                return 'authorized';
            }
            return 'unauthorized';
        },
        async auth(email: string, password: string): Promise<AuthStatus> {
            await axios.get('/sanctum/csrf-cookie');
            const response = await axios.post('/api/login', {
                email,
                password
            });
            if(response?.status === 200) return 'authorized';
            return 'unauthorized';
        }
    }
}