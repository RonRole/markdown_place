import React from 'react';
import { AuthContext } from '../context';
import { LoadingPage } from '../pages';

export type LoadAuthorizationProps = {
    children: React.ReactNode;
};
export function LoadAuthorization({ children }: LoadAuthorizationProps) {
    const { currentAuthStatus } = React.useContext(AuthContext);
    return currentAuthStatus === 'loading' ? <LoadingPage /> : <>{children}</>;
}
