import React from "react";
import AuthStatus from "../../domains/entities/auth-status"
import { useAuthorization } from "../hooks";

export type AuthStatusLoaderProps = {
    children: React.ReactNode,
    setAuthStatus(authStatus:AuthStatus):void,
}

/**
 * 画面の表示前に認証情報を読み込み、
 * 結果を反映させる
 * @param param0 
 */
export default function AuthStatusLoader({children, setAuthStatus}:AuthStatusLoaderProps) {
    const {getStatus} = useAuthorization();
    React.useEffect(()=>{
        setAuthStatus('loading');
        getStatus().then(setAuthStatus);
    }, [getStatus, setAuthStatus]);
    return <>{children}</>
}