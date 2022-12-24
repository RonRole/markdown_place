type UserConstructorParams = {
    id: number,
    name: string,
    email: string,
    is_admin: boolean,
}

export default class User {
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
}