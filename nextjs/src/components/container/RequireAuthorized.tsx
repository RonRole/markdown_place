import React from 'react';
import { AuthContext } from '../context/AuthContextProvider';
import { RequireLoginPage } from '../pages/RequireLoginPage';

export type RequireAuthorizedProps = {
    children: React.ReactNode;
};

export function RequireAuthorized({ children }: RequireAuthorizedProps) {
    return (
        <AuthContext.Consumer>
            {({ currentAuthStatus }) => (
                <>
                    {currentAuthStatus.isFixedAsAuthorized ? <>{children}</> : <RequireLoginPage />}
                </>
            )}
        </AuthContext.Consumer>
    );
}
