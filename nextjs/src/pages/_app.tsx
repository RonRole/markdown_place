import '../styles/globals.css'
import type { AppProps } from 'next/app'
import AuthStatusSwitcher, { OnAuthorized, OnLoading, OnUnauthorized } from '../components/functional/AuthStatusSwitcher'
import React from 'react';
import AuthContextProvider, { AuthContext } from '../components/context/AuthContextProvider';
import dynamic from 'next/dynamic';
import AxiosInterceptorsSettings from '../components/functional/AxiosInterceptorsSettings';
import axios from 'axios';
import LoginFormContainer from '../components/container/LoginFormContainer';

/**
 * 内部でwindowを使用しているため、ssrでのエラーを回避するために
 * dynamic import
 */
const PrefersColorSchemeMuiThemeProvider = dynamic(
  ()=>import('../components/context').then(muiThemeProvider=>muiThemeProvider.PrefersColorSchemeMuiThemeProvider),
  {ssr: false}
);

axios.defaults.baseURL = process.env.NEXT_PUBLIC_APP_API_URL;
axios.defaults.withCredentials = true;

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthContextProvider>
      <AuthContext.Consumer>{({currentAuthStatus, setUnauthorized, login})=>{
        return (
          <PrefersColorSchemeMuiThemeProvider>
            <AxiosInterceptorsSettings setUnauthorized={setUnauthorized}>
              <AuthStatusSwitcher authStatus={currentAuthStatus}>
                <OnLoading>
                  <div>Loading...</div>
                </OnLoading>
                <OnAuthorized>
                  <Component {...pageProps} />
                </OnAuthorized>
                <OnUnauthorized>
                  <LoginFormContainer login={login}/>
                </OnUnauthorized>
              </AuthStatusSwitcher>
            </AxiosInterceptorsSettings>
          </PrefersColorSchemeMuiThemeProvider>
        )
      }}
      </AuthContext.Consumer>
    </AuthContextProvider>
  )
}
