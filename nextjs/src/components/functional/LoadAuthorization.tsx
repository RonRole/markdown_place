import React from 'react';
import { AuthContext } from '../context';
import { LoadingPage } from '../pages';

export type LoadAuthorizationProps = {
    children: React.ReactNode;
};
export function LoadAuthorization({ children }: LoadAuthorizationProps) {
    const { currentAuthStatus } = React.useContext(AuthContext);
    const isLoading = React.useMemo(() => currentAuthStatus.isLoading, [currentAuthStatus]);
    if (isLoading) return <LoadingPage />;
    return <>{children}</>;
}
