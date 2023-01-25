import { Search } from '@mui/icons-material';
import { IconButton, InputAdornment, TextField, TextFieldProps } from '@mui/material';
import React from 'react';
import { ListArticleParams, ListArticleResult, useArticles } from '../hooks';
import { FormWithSubmittingState, FormWithSubmittingStateProps } from '../presentational';
import { ArticleSearchFormComponentProps } from '../presentational/ArticleSearchFormComponent';

export type ArticleListSearchFormProps = {
    onSubmit(result: ListArticleResult): Promise<void>;
    page?: number;
} & Omit<ArticleSearchFormComponentProps, 'onSubmit'>;

export function ArticleListSearchForm({
    onSubmit,
    page,
    textFieldProps,
    ...props
}: ArticleListSearchFormProps) {
    const { list } = useArticles();
    const searchFieldInputRef = React.useRef<HTMLInputElement>(null);
    const handleSubmit = React.useCallback(
        async (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            const searchResult = await list({
                q: searchFieldInputRef.current?.value,
                page,
            });
            await onSubmit(searchResult);
        },
        [list, onSubmit, page]
    );
    return (
        <FormWithSubmittingState onSubmit={handleSubmit} {...props}>
            {(submitting) => (
                <TextField
                    InputProps={{
                        endAdornment: (
                            <InputAdornment disablePointerEvents={submitting} position="end">
                                <IconButton type="submit">
                                    <Search />
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                    disabled={submitting}
                    placeholder="タイトル,内容で検索"
                    inputRef={searchFieldInputRef}
                    {...textFieldProps}
                />
            )}
        </FormWithSubmittingState>
    );
}
