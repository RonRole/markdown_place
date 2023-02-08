import { List } from '@mui/material';
import { ApiResponse } from './api-response';
import Article from '../../domains/article';
import ArticleTag from '../../domains/article-tag';
import { InputError, ServerErrorFormat } from '../../errors';
import React from 'react';
import axios, { AxiosError, AxiosResponse } from 'axios';

export type ListArticleTagParams = Partial<{
    articleId: Article['id'];
}>;
export type ListArticleRelatedTags = ApiResponse<ArticleTag[], InputError<ListArticleTagParams>>;

type ListArticleRelatedTagsApiResponse = { id: number; name: string }[];

export type ResetArticleRelatedTagParams = {
    articleId: Article['id'];
    tagIds: ArticleTag['id'][];
};
export type ResetArticleTagResult = ApiResponse<null, InputError<ResetArticleRelatedTagParams>>;

export type UseArticleRelatedTagFunctions = {
    list(params: ListArticleTagParams): Promise<ListArticleRelatedTags>;
    reset(params: ResetArticleRelatedTagParams): Promise<ResetArticleTagResult>;
};

export function useArticleRelatedTag(): UseArticleRelatedTagFunctions {
    const list = React.useCallback(async ({ articleId }: ListArticleTagParams) => {
        if (articleId === undefined) {
            return {
                isSuccess: false as false,
                data: {
                    articleId: ['article id is required.'],
                },
            };
        }
        return await axios
            .get(`/api/articles/${encodeURIComponent(articleId)}/tags`)
            .then((response: AxiosResponse) => {
                const apiRes = response.data as ListArticleRelatedTagsApiResponse;
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
            .catch((error: AxiosError) => {
                const errorData = error.response?.data as ServerErrorFormat;
                return {
                    isSuccess: false as false,
                    data: {
                        articleId: errorData?.errors?.article_id,
                    },
                };
            });
    }, []);
    const reset = React.useCallback(async ({ articleId, tagIds }: ResetArticleRelatedTagParams) => {
        return await axios
            .post(`/api/articles/${encodeURIComponent(articleId)}/tags`, {
                tag_ids: tagIds,
            })
            .then((_: AxiosResponse) => {
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
                        articleId: errorData?.errors?.article_id,
                        tagIds: errorData?.errors?.tag_ids,
                    },
                };
            });
    }, []);
    return {
        list,
        reset,
    };
}
