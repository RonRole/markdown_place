import { FormLabel } from '@mui/material';
import Article from '../../domains/article';
import { ParsedMarkdown, ParsedMarkdownProps } from './ParsedMarkdown';

export type ArticleMarkdownProps = {
    article?: Article;
} & ParsedMarkdownProps;

export function ArticleMarkdown({ article, ...props }: ArticleMarkdownProps) {
    return (
        <>
            <FormLabel>{article?.title}</FormLabel>
            <ParsedMarkdown markdownSrc={article?.content} {...props} />
        </>
    );
}
