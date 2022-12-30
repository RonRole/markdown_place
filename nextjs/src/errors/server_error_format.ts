/**
 * laravelの422エラーの形式を想定
 */
export type ServerErrorFormat = {
    errors: {
        [key: string]: string[];
    };
    message: string;
};
