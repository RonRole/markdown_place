type ArticleConstructorParams = {
    id: number;
    title: string;
    content: string;
};

export default class Article {
    readonly id: number;
    readonly title: string;
    readonly content: string;

    constructor({ id, title, content }: ArticleConstructorParams) {
        this.id = id;
        this.title = title;
        this.content = content;
    }
}
