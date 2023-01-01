import axios, { AxiosError, AxiosResponse } from 'axios';
import React from 'react';
import Article from '../../domains/article';
import { ServerErrorFormat } from '../../errors';
import { InputError } from '../../errors/input_error';

export type CreateArticleParams = Pick<Article, 'title' | 'content'>;
export type CreateArticleResult = Article | InputError<CreateArticleParams>;
export type ListArticleParams = {
    count: number;
    skipPages?: number;
};
export type ListArticleResult = Article[] | InputError<ListArticleParams>;
export type ShowArticleParams = Article['id'];
export type ShowArticleResult = Article | InputError<Pick<Article, 'id'>>;
export type UpdateArticleParams = Article;
export type UpdateArticleResult = true | InputError<UpdateArticleParams>;

export type UseArticleFunctions = {
    create(props: CreateArticleParams): Promise<CreateArticleResult>;
    list(params: ListArticleParams): Promise<ListArticleResult>;
    show(id: Article['id']): Promise<ShowArticleResult>;
    update(article: Article): Promise<UpdateArticleResult>;
};

export function useArticles(): UseArticleFunctions {
    const create = React.useCallback(async (props: CreateArticleParams) => {
        const result = await axios
            .post('/api/articles', {
                title: props.title,
                content: props.content,
            })
            .then((response: AxiosResponse) => {
                return new Article({
                    id: response.data.id,
                    title: response.data.title,
                    content: response.data.content,
                });
            })
            .catch((error: AxiosError) => {
                const errorData = error.response?.data as ServerErrorFormat;
                return {
                    title: errorData?.errors?.title,
                    content: errorData?.errors?.content,
                };
            });
        return result;
    }, []);
    const list = React.useCallback(async ({ count, skipPages = 0 }: ListArticleParams) => {
        const result: ListArticleResult = await axios
            .get(`/api/articles?count=${encodeURIComponent(count)}&skip-pages=${skipPages}`)
            .then((res: AxiosResponse) => {
                if (Array.isArray(res.data)) {
                    return res.data.map(
                        ({ id, title, content }) =>
                            new Article({
                                id,
                                title,
                                content,
                            })
                    );
                }
                return [];
            })
            .catch((error: AxiosError) => {
                const errorData = error.response?.data as ServerErrorFormat;
                return {
                    count: errorData?.errors?.count,
                    skipPages: errorData?.errors?.['skip-pages'],
                };
            });
        return result;
    }, []);
    const show = React.useCallback(async (id: Article['id']) => {
        const result: ShowArticleResult = await axios
            .get(`/api/articles/${encodeURIComponent(id)}`)
            .then((res: AxiosResponse) => {
                if (res.data) {
                    return new Article({
                        id: res.data.id,
                        title: res.data.title,
                        content: res.data.content,
                    });
                }
                return {
                    id: ['データがありませんでした'],
                };
            })
            .catch((error: AxiosError) => {
                const errorData = error.response?.data as ServerErrorFormat;
                return {
                    id: errorData?.errors?.id,
                };
            });
        return result;
    }, []);
    const update = React.useCallback(async (article: Article) => {
        const result: UpdateArticleResult = await axios
            .put(`/api/articles/${encodeURIComponent(article.id)}`, {
                title: article.title,
                content: article.content,
            })
            .then((_) => {
                return true as true;
            })
            .catch((error: AxiosError) => {
                const errorData = error.response?.data as ServerErrorFormat;
                return {
                    id: errorData?.errors?.id,
                    title: errorData?.errors?.title,
                    content: errorData?.errors?.content,
                };
            });
        return result;
    }, []);
    return {
        create,
        list,
        show,
        update,
    };
}
