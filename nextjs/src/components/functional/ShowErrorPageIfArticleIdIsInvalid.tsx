import React from 'react';
import Article from '../../domains/article';
import { ErrorPage } from '../pages/ErrorPage';

export type ShowErrorPageIfArticleIdIsInvalidProps = {
    articleId: any;
    children: (articleId: Article['id']) => React.ReactNode;
};

export function ShowErrorPageIfArticleIdIsInvalid({
    articleId,
    children,
}: ShowErrorPageIfArticleIdIsInvalidProps) {
    if (typeof articleId !== 'string' || Number.isNaN(articleId)) {
        return <ErrorPage errorMessage="記事IDが不正です" />;
    }
    const node = children(Number(articleId));
    return <>{node}</>;
}
