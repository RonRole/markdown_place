export type ApiResponse<Success, Error> = ApiResponseSuccess<Success> | ApiResponseError<Error>;

export type ApiResponseSuccess<Data> = {
    isSuccess: true;
    data: Data;
};

export type ApiResponseError<Data> = {
    isSuccess: false;
    data: Data;
};
