import { Box, Chip, FormLabel } from '@mui/material';
import Article from '../../domains/article';
import { ParsedMarkdown, ParsedMarkdownProps } from './ParsedMarkdown';

export type ArticleMarkdownProps = {
    article?: Article;
} & ParsedMarkdownProps;

export function ArticleMarkdown({ article, ...props }: ArticleMarkdownProps) {
    return (
        <>
            <FormLabel>{article?.title}</FormLabel>
            <Box sx={{ display: 'flex' }}>
                {article?.tags.map(({ id, name }) => (
                    <Chip key={id} label={name} />
                ))}
            </Box>
            <ParsedMarkdown markdownSrc={article?.content} {...props} />
        </>
    );
}
