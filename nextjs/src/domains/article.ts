import Label from './label';

type ArticleConstructorParams = {
    id: number;
    title: string;
    content?: string;
    labels?: Label[];
};

export default class Article {
    readonly id: number;
    readonly title: string;
    readonly content: string;
    readonly labels: Label[];

    constructor({ id, title, content = '', labels = [] }: ArticleConstructorParams) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.labels = labels;
    }
    /**
     * このArticleが、引数のラベルを"全て"持っているかを返す
     * @param targetLabels
     * @returns
     */
    hasAllLabels(...targetLabels: Label[]): boolean {
        return targetLabels.every((targetLabel) =>
            this.labels.some((label) => targetLabel.id === label.id)
        );
    }
}
