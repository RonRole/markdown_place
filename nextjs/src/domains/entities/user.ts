import Entity from "./entity";

type UserConstructorParams = {
    id: number;
    name: string,
    email: string,
    is_admin: boolean,
}

export default class User implements Entity<number | undefined> {
    readonly id?: number;
    readonly name: string;
    readonly email: string;
    readonly isAdmin: boolean;

    constructor({id, name, email, is_admin} : UserConstructorParams) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.isAdmin = is_admin;
    }
    get uniqueKey(): number | undefined {
        return this.id;
    }
}