import React from 'react';

export type ValidationResult = {
    isValid: boolean;
    messages?: string[];
};

export type Validate = (currentValue?: string) => ValidationResult;

/**
 * バリデーションルール
 * 汎用的なものは作っておく
 */
export type ValidationRuleKeys = 'NO_CHECK';
export const ValidationRules: { [key in ValidationRuleKeys]: Validate } = {
    NO_CHECK: () => {
        return { isValid: true as true, messages: [] };
    },
} as const;

type KeyAndValidationSettings = {
    [key: string]: Validate;
};

export type ValidateResults<T extends KeyAndValidationSettings> = {
    [key in keyof T]: ValidationResult;
};

export type FormRefs<T extends KeyAndValidationSettings> = {
    [key in keyof T]: React.RefObject<HTMLInputElement>;
};

export type CurrentValues<T extends KeyAndValidationSettings> = {
    [key in keyof T]: string;
};

export type FormWithValidation<T extends KeyAndValidationSettings> = {
    refs: FormRefs<T>;
    validate(): boolean;
    validateResults: ValidateResults<T>;
    clearValidateResults(): void;
    setValidateResults: React.Dispatch<React.SetStateAction<ValidateResults<T>>>;
};

const getDefaultResults = <T extends KeyAndValidationSettings>(
    keyAndValidationSettings: T
): ValidateResults<T> => {
    return (Object.keys(keyAndValidationSettings) as (keyof T)[]).reduce<ValidateResults<T>>(
        (pre, cur) => {
            pre[cur] = { isValid: true, messages: [] };
            return pre;
        },
        {} as ValidateResults<T>
    );
};

const getRefs = <T extends KeyAndValidationSettings>(keyAndValidationSettings: T): FormRefs<T> => {
    return (Object.keys(keyAndValidationSettings) as (keyof T)[]).reduce<FormRefs<T>>(
        (pre, cur) => {
            pre[cur] = React.useRef(null);
            return pre;
        },
        {} as FormRefs<T>
    );
};

const getValidate = <T extends KeyAndValidationSettings>(
    keyAndValidationSettings: T,
    refs: FormRefs<T>
): (() => ValidateResults<T>) => {
    return (): ValidateResults<T> => {
        return (Object.keys(keyAndValidationSettings) as (keyof T)[]).reduce<ValidateResults<T>>(
            (pre, cur) => {
                pre[cur] = keyAndValidationSettings[cur](refs[cur]?.current?.value);
                return pre;
            },
            {} as ValidateResults<T>
        );
    };
};

export function useFormWithValidation<T extends KeyAndValidationSettings>(
    validationSettings: T
): FormWithValidation<T> {
    const defaultResults = getDefaultResults<T>(validationSettings);
    const [validateResults, setValidateResults] =
        React.useState<ValidateResults<T>>(defaultResults);
    const refs = getRefs<T>(validationSettings);
    const validate = () => {
        const result = getValidate<T>(validationSettings, refs)();
        setValidateResults(result);
        return Object.values(result).every((value) => value.isValid);
    };
    const clearValidateResults = () => setValidateResults(defaultResults);
    return {
        refs,
        validate,
        validateResults,
        clearValidateResults,
        setValidateResults,
    };
}
