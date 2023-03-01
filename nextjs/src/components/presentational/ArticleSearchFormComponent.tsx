import React from 'react';
import { SearchByTags, SearchByTagsProps } from './ArticleSearchForm/SearchByTags';
import {
    SearchByTitleOrContent,
    SearchByTitleOrContentProps,
} from './ArticleSearchForm/SearchByTitleOrContent';
import { FormWithSubmittingStateProps } from './FormWithSubmittingState';

export type SearchBy = 'titleOrContent' | 'tags';

export type ArticleSearchFormComponentProps<T extends SearchBy> = {
    searchBy: T;
} & (T extends 'titleOrContent' ? SearchByTitleOrContentProps : {}) &
    (T extends 'tags' ? SearchByTagsProps : {}) &
    Omit<FormWithSubmittingStateProps, 'onSubmit'>;

export function ArticleSearchFormComponent<T extends SearchBy>(
    props: ArticleSearchFormComponentProps<T>
) {
    if (props.searchBy === 'titleOrContent') {
        const titleOrContentProps = props as ArticleSearchFormComponentProps<'titleOrContent'>;
        return (
            <SearchByTitleOrContent
                onSubmit={titleOrContentProps.onSubmit}
                componentProps={titleOrContentProps.componentProps}
            />
        );
    }
    if (props.searchBy === 'tags') {
        const tagsProps = props as ArticleSearchFormComponentProps<'tags'>;
        return (
            <SearchByTags
                onSubmit={tagsProps.onSubmit}
                tagOptions={tagsProps.tagOptions}
                sx={tagsProps.sx}
            />
        );
    }
    return <></>;
}
