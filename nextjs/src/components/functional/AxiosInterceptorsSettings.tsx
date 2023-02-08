import axios, { AxiosResponse } from 'axios';
import React from 'react';
import { AuthContext } from '../context';
import { AlertDialogContext } from '../context/AlertDialogContextProvider';

export type AxiosInterceptorsSettingsProps = {
    children: React.ReactNode;
};

/**
 * Axiosのinterceptors設定用のコンポーネント
 * interceptorsでコンテキストなどに触れたいので、コンポーネントとして作成
 *
 * コンポーネント描画後に設定を追加する関係で、useLayoutEffect、
 * またはgetServerSidePropsでのaxiosには効果がないので注意
 *
 * @param param0
 * @returns
 */
export function AxiosInterceptorsSettings({ children }: AxiosInterceptorsSettingsProps) {
    const { setUnauthorized } = React.useContext(AuthContext);
    const { open, close } = React.useContext(AlertDialogContext);
    axios.interceptors.response.use(
        (value: AxiosResponse) => value,
        (error: any) => {
            if (!axios.isAxiosError(error)) {
                return Promise.reject(error);
            }
            switch (error.code) {
                // 補足しないエラー
                case 'ERR_BAD_REQUEST':
                case 'ERR_CANCELED':
                    break;
                default:
                    open({
                        message: '予期しないエラーが発生しました',
                    });
            }
            switch (error.response?.status) {
                case 401:
                    setUnauthorized();
                    break;
                case 419:
                    setUnauthorized();
                    open({
                        message: '認証エラーが発生しました',
                        description: '続行するには、再度ログインしてください',
                    });
            }
            return Promise.reject(error);
        }
    );
    return <>{children}</>;
}
