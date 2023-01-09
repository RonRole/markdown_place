import { AuthContext } from '../context';
import { RequireAdminPage } from '../pages/RequireAdminPage';

export type RequireAdminProps = {
    children: React.ReactNode;
};

export function RequireAdmin({ children }: RequireAdminProps) {
    return (
        <AuthContext.Consumer>
            {({ currentAuthStatus }) => (
                <>{currentAuthStatus.isFixedAsAdmin ? <>{children}</> : <RequireAdminPage />}</>
            )}
        </AuthContext.Consumer>
    );
}
