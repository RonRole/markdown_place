import React from 'react';
import axios, { Axios, AxiosError, AxiosResponse } from 'axios';
import { AppGlobalConfig } from '../../domains/app-global-config';
import { InputError, ServerErrorFormat } from '../../errors';
import { ApiResponse } from './api-response';

export type GetAppGlobalConfigResult = ApiResponse<AppGlobalConfig, Error>;
export type UpdateAppGlobalConfigResult = ApiResponse<null, InputError<Partial<AppGlobalConfig>>>;

export type UseAppGlobalConfigFunctions = {
    load(): Promise<GetAppGlobalConfigResult>;
    update(params: Partial<AppGlobalConfig>): Promise<UpdateAppGlobalConfigResult>;
};

export function useAppGlobalConfig(): UseAppGlobalConfigFunctions {
    const load = React.useCallback(async () => {
        return await axios
            .get('/api/admin/app-global-config')
            .then((res: AxiosResponse) => {
                return {
                    isSuccess: true as true,
                    data: new AppGlobalConfig({
                        listArticleCount: res.data.list_article_count,
                    }),
                };
            })
            .catch((error: AxiosError) => {
                return {
                    isSuccess: false as false,
                    data: new Error('予期しないエラー'),
                };
            });
    }, []);
    const update = React.useCallback(async (params: Partial<AppGlobalConfig>) => {
        return await axios
            .put('/api/admin/app-global-config', {
                list_article_count: params?.listArticleCount,
            })
            .then((res: AxiosResponse) => {
                return {
                    isSuccess: true as true,
                    data: null,
                };
            })
            .catch((error: AxiosError) => {
                const errorData = error.response?.data as ServerErrorFormat;
                return {
                    isSuccess: false as false,
                    data: {
                        listArticleCount: errorData?.errors?.list_article_count,
                    },
                };
            });
    }, []);
    return {
        load,
        update,
    };
}
