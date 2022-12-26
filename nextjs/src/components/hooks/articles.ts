import Article from '../../domains/article';

export type UseArticleFunctions = {
    create(article: Article): Promise<boolean>;
};
