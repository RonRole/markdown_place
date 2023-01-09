import { Search } from '@mui/icons-material';
import { IconButton, InputAdornment, TextField, TextFieldProps } from '@mui/material';
import React from 'react';
import { FormWithSubmittingState, FormWithSubmittingStateProps } from './FormWithSubmittingState';

export type ArticleSearchFormComponentProps = {
    onSubmit(value?: string): Promise<void>;
    textFieldProps?: Omit<TextFieldProps, 'InputProps' | 'placeholder' | 'inputRef' | 'onSubmit'>;
} & Omit<FormWithSubmittingStateProps, 'onSubmit'>;

export function ArticleSearchFormComponent({
    onSubmit,
    textFieldProps,
    ...props
}: ArticleSearchFormComponentProps) {
    const searchFieldInputRef = React.useRef<HTMLInputElement>(null);
    const handleSubmit = React.useCallback(
        async (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            await onSubmit(searchFieldInputRef.current?.value);
        },
        [onSubmit]
    );
    return (
        <FormWithSubmittingState onSubmit={handleSubmit} {...props}>
            {(submitting) => (
                <TextField
                    {...textFieldProps}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment disablePointerEvents={submitting} position="end">
                                <IconButton type="submit">
                                    <Search />
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                    disabled={textFieldProps?.disabled || submitting}
                    placeholder="タイトル、内容で検索"
                    inputRef={searchFieldInputRef}
                />
            )}
        </FormWithSubmittingState>
    );
}
