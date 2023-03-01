import { Search } from '@mui/icons-material';
import {
    Autocomplete,
    AutocompleteProps,
    IconButton,
    InputAdornment,
    SxProps,
    TextField,
} from '@mui/material';
import React from 'react';
import ArticleTag from '../../../domains/article-tag';
import { FormWithSubmittingState, FormWithSubmittingStateProps } from '../FormWithSubmittingState';

export type SearchByTagsProps = {
    onSubmit(value?: ArticleTag[]): Promise<void>;
    tagOptions: ArticleTag[];
    sx?: SxProps;
} & Omit<FormWithSubmittingStateProps, 'onSubmit'>;

export function SearchByTags({ onSubmit, tagOptions, sx }: SearchByTagsProps) {
    const [currentTags, setCurrentTags] = React.useState<ArticleTag[]>([]);
    const handleSubmit = React.useCallback(() => onSubmit(currentTags), [currentTags, onSubmit]);
    return (
        <FormWithSubmittingState onSubmit={handleSubmit}>
            {(submitting) => (
                <Autocomplete
                    multiple
                    disabled={submitting}
                    value={currentTags}
                    isOptionEqualToValue={(option, value) => {
                        return option.id === value.id;
                    }}
                    sx={sx}
                    options={tagOptions}
                    getOptionLabel={(option) => option.name}
                    disableClearable
                    forcePopupIcon={false}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            InputProps={{
                                ...params.InputProps,
                                endAdornment: (
                                    <InputAdornment
                                        disablePointerEvents={submitting}
                                        position="end"
                                    >
                                        <IconButton type="submit">
                                            <Search />
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            fullWidth
                            placeholder="タグで検索"
                            variant="outlined"
                            disabled={submitting}
                        />
                    )}
                    onChange={(_, values) => setCurrentTags(values)}
                />
            )}
        </FormWithSubmittingState>
    );
}
