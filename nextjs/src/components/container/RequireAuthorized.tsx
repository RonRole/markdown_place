import React from 'react';
import { AuthContext } from '../context/AuthContextProvider';
import { LoadingPage, LoginPage } from '../pages';
import { RequireLoginPage } from '../pages/RequireLoginPage';
import { NavBar } from './NavBar';

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
