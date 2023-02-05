type LabelParams = {
    id: number;
    name: string;
};

export default class Label {
    readonly id: number;
    readonly name: string;

    constructor({ id, name }: LabelParams) {
        this.id = id;
        this.name = name;
    }
}
