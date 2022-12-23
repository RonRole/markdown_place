
import { AuthContext } from "../context/AuthContextProvider"
import LoadingPage from "../pages/LoadingPage"
import LoginPage from "../pages/LoginPage"
import AuthStatusSwitcher, { OnAuthorized, OnLoading, OnUnauthorized } from "./AuthStatusSwitcher"

export type RequireAuthorizedProps = {
    children: React.ReactNode,
}

export default function RequireAuthorized({children}: RequireAuthorizedProps) {
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
                        <LoginPage login={login} />
                    </OnUnauthorized>
                </AuthStatusSwitcher>
            )
        }}
        </AuthContext.Consumer>
    )    
}