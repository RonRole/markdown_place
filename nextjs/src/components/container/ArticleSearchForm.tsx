import { Search } from '@mui/icons-material';
import { IconButton, InputAdornment, TextField, TextFieldProps } from '@mui/material';
import React from 'react';
import Article from '../../domains/article';
import { InputError } from '../../errors';
import { ListArticleParams, useArticles } from '../hooks';
import { FormWithSubmittingState, FormWithSubmittingStateProps } from '../presentational';

export type ArticleSearchFormProps = {
    onSubmit(result: Article[] | InputError<ListArticleParams>): Promise<void>;
    listItemCount?: number;
    skipPages?: number;
    textFieldProps?: Omit<TextFieldProps, 'InputProps' | 'placeholder' | 'inputRef' | 'onSubmit'>;
} & Omit<FormWithSubmittingStateProps, 'onSubmit'>;

export function ArticleSearchForm({
    onSubmit,
    listItemCount = 20,
    skipPages = 0,
    textFieldProps,
    ...props
}: ArticleSearchFormProps) {
    const { list } = useArticles();
    const searchFieldInputRef = React.useRef<HTMLInputElement>(null);
    const handleSubmit = React.useCallback(
        async (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            const searchResult = await list({
                count: listItemCount,
                skipPages,
            });
            await onSubmit(searchResult);
        },
        [list, listItemCount, onSubmit, skipPages]
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
                    placeholder="検索フォームでやんす"
                    inputRef={searchFieldInputRef}
                    {...textFieldProps}
                />
            )}
        </FormWithSubmittingState>
    );
}
