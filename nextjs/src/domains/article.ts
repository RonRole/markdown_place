type ArticleConstructorParams = {
    id: number,
    title: string,
    url: string,
}

export default class Article {
    readonly id?: number;
    readonly title: string;
    readonly url: string;

    constructor({id, title, url}: ArticleConstructorParams) {
        this.id = id;
        this.title = title;
        this.url = url;
    }
}