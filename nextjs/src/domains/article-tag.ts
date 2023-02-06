type ArticleTagParams = {
    id: number;
    name: string;
};

export default class ArticleTag {
    readonly id: number;
    readonly name: string;

    constructor({ id, name }: ArticleTagParams) {
        this.id = id;
        this.name = name;
    }
}
