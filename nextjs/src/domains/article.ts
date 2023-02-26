import ArticleTag from './article-tag';

type ArticleConstructorParams = {
    id: number;
    title: string;
    content?: string;
    tags?: ArticleTag[];
};

export default class Article {
    readonly id: number;
    readonly title: string;
    readonly content: string;
    readonly tags: ArticleTag[];

    constructor({ id, title, content = '', tags = [] }: ArticleConstructorParams) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.tags = tags;
    }
    /**
     * このArticleが、引数のラベルを"全て"持っているかを返す
     * @param targetTags
     * @returns
     */
    hasAllTags(...targetTags: ArticleTag[]): boolean {
        return targetTags.every((targetTag) => this.tags.some((tag) => targetTag.id === tag.id));
    }
}
