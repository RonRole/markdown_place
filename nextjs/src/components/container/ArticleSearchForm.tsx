import { Search } from '@mui/icons-material';
import { IconButton, InputAdornment, TextField, TextFieldProps } from '@mui/material';
import React from 'react';
import Article from '../../domains/article';
import { InputError } from '../../errors';
import { ListArticleParams, useArticles } from '../hooks';
import { FormWithSubmittingState, FormWithSubmittingStateProps } from '../presentational';
import { ArticleSearchFormComponentProps } from '../presentational/ArticleSearchFormComponent';

export type ArticleListSearchFormProps = {
    onSubmit(result: Article[] | InputError<ListArticleParams>): Promise<void>;
    listItemCount?: number;
    skipPages?: number;
} & Omit<ArticleSearchFormComponentProps, 'onSubmit'>;

export function ArticleListSearchForm({
    onSubmit,
    listItemCount = 20,
    skipPages = 0,
    textFieldProps,
    ...props
}: ArticleListSearchFormProps) {
    const { list } = useArticles();
    const searchFieldInputRef = React.useRef<HTMLInputElement>(null);
    const handleSubmit = React.useCallback(
        async (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            const searchResult = await list({
                skipPages,
            });
            await onSubmit(searchResult);
        },
        [list, onSubmit, skipPages]
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
