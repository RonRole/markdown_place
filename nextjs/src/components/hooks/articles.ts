import axios, { AxiosError, AxiosResponse } from 'axios';
import React from 'react';
import Article from '../../domains/article';
import { ServerErrorFormat } from '../../errors';
import { InputError } from '../../errors/input_error';
import { useAbortController } from './abort-controller';
import { ApiResponse } from './api-response';

// create
export type CreateArticleParams = Partial<Pick<Article, 'title' | 'content'>>;
export type CreateArticleResult = ApiResponse<Article, InputError<CreateArticleParams>>;

// list
export type ListArticleParams = {
    q?: string;
    page?: number;
};
export type ListArticleResult = ApiResponse<
    { articles: Article[]; pageCount: number },
    InputError<ListArticleParams>
>;
export type ListArticleAsObjectResult = ApiResponse<
    { articles: { [key: Article['id']]: Article }; pageCount: number },
    InputError<ListArticleParams>
>;

// show
export type ShowArticleParams = Article['id'];
export type ShowArticleResult = ApiResponse<Article, InputError<Pick<Article, 'id'>>>;

// update
export type UpdateArticleParams = Article;
export type UpdateArticleResult = ApiResponse<null, InputError<UpdateArticleParams>>;

// destroy
export type DestroyArticleParams = Article['id'] | Article['id'][];
export type DestroyArticleResult = ApiResponse<null, InputError<Pick<Article, 'id'>>>;

export type UseArticleFunctions = {
    create(props: CreateArticleParams): Promise<CreateArticleResult>;
    list(params: ListArticleParams): Promise<ListArticleResult>;
    listAsObject(params: ListArticleParams): Promise<ListArticleAsObjectResult>;
    show(params: ShowArticleParams): Promise<ShowArticleResult>;
    update(params: UpdateArticleParams): Promise<UpdateArticleResult>;
    destroy(params: DestroyArticleParams): Promise<DestroyArticleResult>;
};

type ListArticleApiResponse = {
    data: {
        id: number;
        author_id: string;
        title: string;
        content: string;
    }[];
    last_page: number;
};

export function useArticles(): UseArticleFunctions {
    const create = React.useCallback(async ({ title, content }: CreateArticleParams) => {
        const result = await axios
            .post('/api/articles', {
                title,
                content,
            })
            .then((response: AxiosResponse) => {
                return {
                    isSuccess: true as true,
                    data: new Article({
                        id: response.data.id,
                        title: response.data.title,
                        content: response.data.content,
                    }),
                };
            })
            .catch((error: AxiosError) => {
                const errorData = error.response?.data as ServerErrorFormat;
                return {
                    isSuccess: false as false,
                    data: {
                        title: errorData?.errors?.title,
                        content: errorData?.errors?.content,
                    },
                };
            });
        return result;
    }, []);
    const { restartProcess, clearAbortSignal } = useAbortController();
    const list = React.useCallback(
        async ({ q = '', page = 1 }: ListArticleParams) => {
            const signal = restartProcess();
            const result: ListArticleResult = await axios
                .get(`/api/articles?q=${q}&page=${page}`, {
                    signal,
                })
                .then((res: AxiosResponse) => {
                    const apiRes = res.data as ListArticleApiResponse;
                    const articles = apiRes.data.map(
                        ({ id, title, content }) =>
                            new Article({
                                id,
                                title,
                                content,
                            })
                    );
                    return {
                        isSuccess: true as true,
                        data: {
                            pageCount: apiRes.last_page,
                            articles,
                        },
                    };
                })
                .catch((error: AxiosError) => {
                    const errorData = error.response?.data as ServerErrorFormat;
                    return {
                        isSuccess: false as false,
                        data: {
                            count: errorData?.errors?.count,
                            page: errorData?.errors?.['page'],
                        },
                    };
                })
                .finally(clearAbortSignal);
            return result;
        },
        [clearAbortSignal, restartProcess]
    );
    const listAsObject = React.useCallback(
        async ({ q, page }: ListArticleParams) => {
            const listResult = await list({ q, page });
            if (!listResult.isSuccess) {
                return listResult;
            }
            return {
                isSuccess: true as true,
                data: {
                    ...listResult.data,
                    articles: listResult.data.articles.reduce((pre, cur) => {
                        pre[cur.id] = cur;
                        return pre;
                    }, {} as { [key: Article['id']]: Article }),
                },
            };
        },
        [list]
    );
    const show = React.useCallback(async (id: Article['id']) => {
        const result: ShowArticleResult = await axios
            .get(`/api/articles/${encodeURIComponent(id)}`)
            .then((res: AxiosResponse) => {
                if (!Object.keys(res.data).length) {
                    return {
                        isSuccess: false as false,
                        data: { id: ['データがありませんでした'] },
                    };
                }
                return {
                    isSuccess: true as true,
                    data: new Article({
                        id: res.data.id,
                        title: res.data.title,
                        content: res.data.content,
                    }),
                };
            })
            .catch((error: AxiosError) => {
                const errorData = error.response?.data as ServerErrorFormat;
                return {
                    isSuccess: false as false,
                    data: {
                        id: errorData?.errors?.id,
                    },
                };
            });
        return result;
    }, []);
    const update = React.useCallback(async ({ id, title, content }: UpdateArticleParams) => {
        const result: UpdateArticleResult = await axios
            .put(`/api/articles/${encodeURIComponent(id)}`, {
                title,
                content,
            })
            .then((_) => {
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
                        id: errorData?.errors?.id,
                        title: errorData?.errors?.title,
                        content: errorData?.errors?.content,
                    },
                };
            });
        return result;
    }, []);
    const destroy = React.useCallback(async (params: DestroyArticleParams) => {
        const targetArticleIds = Array.isArray(params) ? params : [params];
        const result: DestroyArticleResult = await axios
            .delete('/api/articles', {
                data: {
                    article_ids: targetArticleIds,
                },
            })
            .then((_) => {
                return {
                    isSuccess: true as true,
                    data: null,
                };
            })
            .catch((error) => {
                const errorData = error.response?.data as ServerErrorFormat;
                return {
                    isSuccess: false as false,
                    data: {
                        id: errorData?.errors?.id,
                    },
                };
            });
        return result;
    }, []);
    return {
        create,
        list,
        listAsObject,
        show,
        update,
        destroy,
    };
}
