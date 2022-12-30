import axios, { AxiosError, AxiosResponse } from 'axios';
import React from 'react';
import Article from '../../domains/article';
import { ServerErrorFormat } from '../../errors';
import { InputError } from '../../errors/input_error';

type CreateArticleParams = Pick<Article, 'title' | 'content'>;
type ListArticleParams = {
    count: number;
    skipPages?: number;
};
type UpdateArticleParams = Pick<Article, 'title' | 'content'>;

export type UseArticleFunctions = {
    create(props: CreateArticleParams): Promise<Article | InputError<CreateArticleParams>>;
    list(params: ListArticleParams): Promise<Article[] | InputError<ListArticleParams>>;
    update(article: Article): Promise<true | InputError<UpdateArticleParams>>;
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
                    title: errorData.errors?.title,
                    content: errorData.errors?.content,
                };
            });
        return result;
    }, []);
    const list = React.useCallback(async ({ count, skipPages = 0 }: ListArticleParams) => {
        const result: Article[] | InputError<ListArticleParams> = await axios
            .get(`/api/articles?count=${encodeURIComponent(count)}&skip-pages=${skipPages}`)
            .then((res: AxiosResponse) => {
                console.log(res);
                return [];
            })
            .catch((error: AxiosError) => {
                const errorData = error.response?.data as ServerErrorFormat;
                return {
                    count: errorData.errors?.count,
                    skipPages: errorData.errors?.['skip-pages'],
                };
            });
        return result;
    }, []);
    const update = React.useCallback(async (article: Article) => {
        const result: true | InputError<UpdateArticleParams> = await axios
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
                    title: errorData.errors?.title,
                    content: errorData.errors?.content,
                };
            });
        return result;
    }, []);
    return {
        create,
        list,
        update,
    };
}
