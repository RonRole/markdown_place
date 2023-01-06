import axios, { AxiosResponse } from 'axios';
import React from 'react';
import { AuthContext } from '../context';

export type AxiosInterceptorsSettingsProps = {
    children: React.ReactNode;
};
/**
 * Axiosのinterceptors設定用のコンポーネント
 * interceptorsでコンテキストなどに触れたいので、コンポーネントとして作成
 *
 * コンポーネント描画後に設定を追加する関係で、useEffectやuseLayoutEffect、
 * またはgetServerSidePropsでのaxiosには効果がないので注意
 *
 * これを利用して、React.useEffectでセッションロード
 * ->401エラーが出ても、アラートを発生させない
 * それ以降の401エラー
 * ->アラート発生
 * という実装をおこなっている
 * @param param0
 * @returns
 */
export function AxiosInterceptorsSettings({ children }: AxiosInterceptorsSettingsProps) {
    const { setUnauthorized } = React.useContext(AuthContext);
    axios.interceptors.response.use(
        (value: AxiosResponse) => value,
        (error: any) => {
            switch (error.response?.status) {
                case 401:
                case 419:
                    alert('認証エラーが発生しました');
                    setUnauthorized();
            }
            if (!error.response || error.response?.status >= 500) {
                alert('予期しないエラーが発生しました');
            }
            return Promise.reject(error);
        }
    );
    return <>{children}</>;
}
