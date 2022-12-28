import axios from 'axios';
import React from 'react';
import Article from '../../domains/article';

type CreateArticleProps = Omit<Article, 'id'>;
export type UseArticleFunctions = {
    create(article: CreateArticleProps): Promise<boolean>;
};

export function useArticles(): UseArticleFunctions {
    const create = React.useCallback(async (props: CreateArticleProps) => {
        const result = await axios.post('/api/articles', {
            title: props.title,
            content: props.content,
        });
        return result.status === 200;
    }, []);
    return {
        create,
    };
}
