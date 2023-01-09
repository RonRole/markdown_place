export type AppGlobalConfigParams = {
    listArticleCount: number;
};

export class AppGlobalConfig {
    readonly listArticleCount: number;

    constructor(params: AppGlobalConfigParams) {
        this.listArticleCount = params.listArticleCount;
    }
}
