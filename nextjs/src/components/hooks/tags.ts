import ArticleTag from '../../domains/article-tag';
import { InputError, ServerErrorFormat } from '../../errors';
import { ApiResponse } from './api-response';
import React from 'react';
import axios, { AxiosError, AxiosResponse } from 'axios';

export type CreateArticleTagParams = Partial<{ name: string }>;
export type CreateArticleTagResult = ApiResponse<ArticleTag, InputError<CreateArticleTagParams>>;

type ListTagsApiResponse = {
    id: number;
    name: string;
}[];
export type ListArticleTagParams = {};
export type ListArticleTagResult = ApiResponse<ArticleTag[], InputError<ListArticleTagParams>>;

export type UseArticleTagFunctions = {
    create(params: CreateArticleTagParams): Promise<CreateArticleTagResult>;
    list(params: ListArticleTagParams): Promise<ListArticleTagResult>;
};

export function useTags(): UseArticleTagFunctions {
    const create = React.useCallback(async ({ name }: CreateArticleTagParams) => {
        return await axios
            .post('/api/tags', { name })
            .then((response: AxiosResponse) => {
                return {
                    isSuccess: true as true,
                    data: new ArticleTag({
                        id: response.data.id,
                        name: response.data.name,
                    }),
                };
            })
            .catch((error: AxiosError) => {
                const errorData = error.response?.data as ServerErrorFormat;
                return {
                    isSuccess: false as false,
                    data: {
                        name: errorData?.errors?.name,
                    },
                };
            });
    }, []);
    const list = React.useCallback(async (params: ListArticleTagParams) => {
        return await axios
            .get('/api/tags')
            .then((response: AxiosResponse) => {
                const apiRes = response.data as ListTagsApiResponse;
                return {
                    isSuccess: true as true,
                    data: apiRes.map(
                        ({ id, name }) =>
                            new ArticleTag({
                                id,
                                name,
                            })
                    ),
                };
            })
            .catch((_: AxiosError) => {
                return {
                    isSuccess: false as false,
                    data: {},
                };
            });
    }, []);
    return {
        create,
        list,
    };
}
