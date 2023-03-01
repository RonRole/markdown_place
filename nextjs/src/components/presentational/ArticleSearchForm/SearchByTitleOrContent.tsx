import { Search } from '@mui/icons-material';
import { IconButton, InputAdornment, TextField, TextFieldProps } from '@mui/material';
import React from 'react';
import { FormWithSubmittingState, FormWithSubmittingStateProps } from '../FormWithSubmittingState';

type SearchByTitleOrContentComponentProps = Omit<
    TextFieldProps,
    'InputProps' | 'placeholder' | 'inputRef' | 'onSubmit'
>;

export type SearchByTitleOrContentProps = {
    onSubmit(value?: string): Promise<void>;
    componentProps?: SearchByTitleOrContentComponentProps;
} & Omit<FormWithSubmittingStateProps, 'onSubmit'>;

export function SearchByTitleOrContent({
    onSubmit,
    componentProps,
    ...props
}: SearchByTitleOrContentProps) {
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
                    {...componentProps}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment disablePointerEvents={submitting} position="end">
                                <IconButton type="submit">
                                    <Search />
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                    disabled={componentProps?.disabled || submitting}
                    placeholder="タイトル、内容で検索"
                    inputRef={searchFieldInputRef}
                />
            )}
        </FormWithSubmittingState>
    );
}
