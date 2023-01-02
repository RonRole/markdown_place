import { AuthContext } from '../context/AuthContextProvider';
import { LoadingPage, LoginPage } from '../pages';
import { RequireLoginPage } from '../pages/RequireLoginPage';

export type RequireAuthorizedProps = {
    children: React.ReactNode;
};

export function RequireAuthorized({ children }: RequireAuthorizedProps) {
    return (
        <AuthContext.Consumer>
            {({ currentAuthStatus }) => (
                <>
                    {currentAuthStatus === 'authorized' && <>{children}</>}
                    {currentAuthStatus === 'unauthorized' && <RequireLoginPage />}
                </>
            )}
        </AuthContext.Consumer>
    );
}
