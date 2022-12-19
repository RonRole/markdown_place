import '../styles/globals.css'
import type { AppProps } from 'next/app'
import AxiosDefaultSettings from '../components/functional/AxiosDefaultSettings'
import AuthorizationStatusChecker, { OnAuthorized, OnLoading, OnUnauthorized } from '../components/functional/AuthContextChecker'
import React from 'react';
import LoginFormContainer from '../components/functional/LoginFormContainer';
import AuthContextProvider, { AuthContext } from '../components/context/AuthContextProvider';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthContextProvider>
        <AuthContext.Consumer>{({authStatus, setAuthStatus})=>{
          return (
            <AxiosDefaultSettings setAuthStatus={setAuthStatus}>
              <AuthorizationStatusChecker authStatus={authStatus} setAuthStatus={setAuthStatus}>
                <OnLoading>
                  <div>Loading...</div>
                </OnLoading>
                <OnAuthorized>
                  <Component {...pageProps} />
                </OnAuthorized>
                <OnUnauthorized>
                  <LoginFormContainer setAuthStatus={setAuthStatus} />
                </OnUnauthorized>
              </AuthorizationStatusChecker>
            </AxiosDefaultSettings>
          )
        }}
        </AuthContext.Consumer>
    </AuthContextProvider>
  )
}
