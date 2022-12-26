import { AuthContext } from '../context/AuthContextProvider';
import { LoadingPage, LoginPage } from '../pages';

export type RequireAuthorizedProps = {
    children: React.ReactNode;
};

export function RequireAuthorized({ children }: RequireAuthorizedProps) {
    return (
        <AuthContext.Consumer>
            {({ currentAuthStatus }) => (
                <>
                    {currentAuthStatus === 'loading' && <LoadingPage />}
                    {currentAuthStatus === 'authorized' && <>{children}</>}
                    {currentAuthStatus === 'unauthorized' && <LoginPage />}
                </>
            )}
        </AuthContext.Consumer>
    );
}
