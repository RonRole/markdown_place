import '../styles/globals.css';
import type { AppProps } from 'next/app';
import React from 'react';
import dynamic from 'next/dynamic';
import axios from 'axios';
import { AuthContextProvider, EditNewArticleDialogContextProvider } from '../components/context';
import { AxiosInterceptorsSettings } from '../components/functional';
import { LoadAuthorization } from '../components/functional/LoadAuthorization';
import { AlertDialogContextProvider } from '../components/context/AlertDialogContextProvider';

/**
 * 内部でwindowを使用しているため、ssrでのエラーを回避するために
 * dynamic import
 */
const PrefersColorSchemeMuiThemeProvider = dynamic(
    () =>
        import('../components/context').then(
            (muiThemeProvider) => muiThemeProvider.PrefersColorSchemeMuiThemeProvider
        ),
    { ssr: false }
);

axios.defaults.baseURL = process.env.NEXT_PUBLIC_APP_API_URL;
axios.defaults.withCredentials = true;

export default function App({ Component, pageProps }: AppProps) {
    return (
        <AuthContextProvider>
            <PrefersColorSchemeMuiThemeProvider>
                <AlertDialogContextProvider>
                    <EditNewArticleDialogContextProvider>
                        <AxiosInterceptorsSettings>
                            <LoadAuthorization>
                                <Component {...pageProps} />
                            </LoadAuthorization>
                        </AxiosInterceptorsSettings>
                    </EditNewArticleDialogContextProvider>
                </AlertDialogContextProvider>
            </PrefersColorSchemeMuiThemeProvider>
        </AuthContextProvider>
    );
}
