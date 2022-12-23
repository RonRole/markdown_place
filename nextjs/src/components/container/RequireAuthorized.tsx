
import { AuthContext } from "../context/AuthContextProvider"
import { LoadingPage, LoginPage } from "../pages"
import { AuthStatusSwitcher, OnAuthorized, OnLoading, OnUnauthorized } from "../presentational"

export type RequireAuthorizedProps = {
    children: React.ReactNode,
}

export function RequireAuthorized({children}: RequireAuthorizedProps) {
    return (
        <AuthContext.Consumer>{({currentAuthStatus, login})=>{
            return (
                <AuthStatusSwitcher authStatus={currentAuthStatus}>
                    <OnLoading>
                        <LoadingPage />
                    </OnLoading>
                    <OnAuthorized>
                        {children}
                    </OnAuthorized>
                    <OnUnauthorized>
                        <LoginPage />
                    </OnUnauthorized>
                </AuthStatusSwitcher>
            )
        }}
        </AuthContext.Consumer>
    )    
}