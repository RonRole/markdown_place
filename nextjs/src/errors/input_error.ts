/**
 * 入力値のエラー
 * hooksを使ったときに、サーバー側で不正と判断された入力値を返すときなどを想定
 * ex:
 *     login('invalid email', 'username') => {email: 'メールアドレスの形式が正しくありません'} : InputError<Parameters<typeof login>>
 */
export type InputError<T> = {
    [key in keyof T]: string[];
};
