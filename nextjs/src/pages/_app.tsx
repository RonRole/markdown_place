import '../styles/globals.css'
import type { AppProps } from 'next/app'
import AxiosDefaultSettings from '../components/functional/AxiosDefaultSettings'
import AuthStatusSwitcher, { OnAuthorized, OnLoading, OnUnauthorized } from '../components/functional/AuthStatusSwitcher'
import React from 'react';
import LoginFormContainer from '../components/functional/LoginFormContainer';
import AuthContextProvider, { AuthContext } from '../components/context/AuthContextProvider';
import AuthStatusLoader from '../components/functional/AuthStatusLoader';
import dynamic from 'next/dynamic';

/**
 * 内部でwindowを使用しているため、ssrでのエラーを回避するために
 * dynamic import
 */
const PrefersColorSchemeMuiThemeProvider = dynamic(
  ()=>import('../components/context').then(muiThemeProvider=>muiThemeProvider.PrefersColorSchemeMuiThemeProvider),
  {ssr: false}
);

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthContextProvider>
      <AuthContext.Consumer>{({authStatus, setAuthStatus})=>{
        return (
          <PrefersColorSchemeMuiThemeProvider>
            <AxiosDefaultSettings setAuthStatus={setAuthStatus}>
              <AuthStatusLoader setAuthStatus={setAuthStatus}>
                <AuthStatusSwitcher authStatus={authStatus}>
                  <OnLoading>
                    <div>Loading...</div>
                  </OnLoading>
                  <OnAuthorized>
                    <Component {...pageProps} />
                  </OnAuthorized>
                  <OnUnauthorized>
                    <LoginFormContainer setAuthStatus={setAuthStatus} />
                  </OnUnauthorized>
                </AuthStatusSwitcher>
              </AuthStatusLoader>
            </AxiosDefaultSettings>
          </PrefersColorSchemeMuiThemeProvider>
        )
      }}
      </AuthContext.Consumer>
    </AuthContextProvider>
  )
}
