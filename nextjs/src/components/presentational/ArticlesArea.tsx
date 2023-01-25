import { Grid, GridProps, List, ListItem, ListItemButton, Pagination } from '@mui/material';
import React from 'react';
import Article from '../../domains/article';
import { ParsedMarkdown } from './ParsedMarkdown';

export type ArticlesGridAreaProps = {
    articles?: Article[];
    loading?: boolean;
    pageCount?: number;
    page?: number;
    onChangePage: (page: number) => Promise<void>;
    onClickArticle?: (article: Article) => Promise<void>;
} & GridProps;

export function ArticlesArea({
    articles = [],
    loading = false,
    onClickArticle = async () => {},
    pageCount,
    page = 1,
    onChangePage,
    ...props
}: ArticlesGridAreaProps) {
    const [selectedArticle, setSelectedArticle] = React.useState<Article | null>(null);
    return (
        <Grid container spacing={1} {...props}>
            <Grid xs={4} item sx={{ height: '100%', overflow: 'scroll' }}>
                <List>
                    {articles.map((article) => (
                        <ListItemButton
                            disabled={loading}
                            key={article.id}
                            onFocus={() => setSelectedArticle(article)}
                            onMouseOver={() => setSelectedArticle(article)}
                            onClick={() => onClickArticle(article)}
                            sx={{ overflow: 'hidden', whiteSpace: 'nowrap' }}
                        >
                            {article.title}
                        </ListItemButton>
                    ))}
                </List>
                <Pagination
                    disabled={loading}
                    count={pageCount}
                    page={page}
                    color="primary"
                    onChange={(_, page) => onChangePage(page)}
                />
            </Grid>
            <Grid xs={8} item sx={{ height: '100%', overflow: 'scroll' }}>
                <ParsedMarkdown markdownSrc={selectedArticle?.content} />
            </Grid>
        </Grid>
    );
}
