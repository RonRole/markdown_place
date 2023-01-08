type AuthStatusParams = {
    isLoaded: boolean;
    isAuthorized: boolean;
    isAdmin: boolean;
};

export class AuthStatus {
    private readonly _params: AuthStatusParams;

    private constructor({
        isLoaded = false,
        isAuthorized = false,
        isAdmin = false,
    }: AuthStatusParams) {
        this._params = {
            isLoaded,
            isAuthorized,
            isAdmin,
        };
    }

    static get Loading(): AuthStatus {
        return new AuthStatus({
            isLoaded: false,
            isAuthorized: false,
            isAdmin: false,
        });
    }

    static get AuthorizedAsNormal(): AuthStatus {
        return new AuthStatus({
            isLoaded: true,
            isAuthorized: true,
            isAdmin: false,
        });
    }

    static get AuthorizedAsAdmin(): AuthStatus {
        return new AuthStatus({
            isLoaded: true,
            isAuthorized: true,
            isAdmin: true,
        });
    }

    static get Unauthorized(): AuthStatus {
        return new AuthStatus({
            isLoaded: true,
            isAuthorized: false,
            isAdmin: false,
        });
    }

    get isFixedAsUnauthorized(): boolean {
        return this._params.isLoaded && !this._params.isAuthorized;
    }

    get isFixedAsAuthorized(): boolean {
        return this._params.isLoaded && this._params.isAuthorized;
    }

    get isFixedAsAdmin(): boolean {
        return this.isFixedAsAuthorized && this._params.isAdmin;
    }
}
