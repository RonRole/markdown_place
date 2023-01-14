import { Grid, GridProps, List, ListItem, ListItemButton } from '@mui/material';
import React from 'react';
import Article from '../../domains/article';
import { ParsedMarkdown } from './ParsedMarkdown';

export type ArticlesGridAreaProps = {
    articles: Article[];
    onClickArticle?: (article: Article) => Promise<void>;
} & GridProps;

export function ArticlesArea({
    articles,
    onClickArticle = async () => {},
    ...props
}: ArticlesGridAreaProps) {
    const [selectedArticle, setSelectedArticle] = React.useState<Article | null>(null);
    return (
        <Grid container spacing={1} {...props}>
            <Grid xs={4} item sx={{ height: '100%', overflow: 'scroll' }}>
                <List>
                    {articles.map((article) => (
                        <ListItemButton
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
            </Grid>
            <Grid xs={8} item sx={{ height: '100%', overflow: 'scroll' }}>
                <ParsedMarkdown markdownSrc={selectedArticle?.content} />
            </Grid>
        </Grid>
    );
}
