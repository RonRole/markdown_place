import { Grid } from '@mui/material';
import Article from '../../domains/article';
import ArticleCard from './ArticleCard';

export type ArticleCardsAreaProps = {
    articles: Article[];
    onClickArticle?: (articleId: Article['id']) => Promise<void>;
};

export function ArticleCardsArea({
    articles,
    onClickArticle = async () => {},
}: ArticleCardsAreaProps) {
    return (
        <Grid container spacing={1}>
            {articles.map((article) => (
                <Grid xs={2} item key={article.id}>
                    <ArticleCard
                        sx={{
                            width: '100%',
                            height: '100%',
                            overflow: 'hidden',
                            whiteSpace: 'nowrap',
                            cursor: 'pointer',
                            ':hover': { borderColor: 'blue' },
                        }}
                        variant="outlined"
                        cardContentProps={{
                            sx: {
                                maxHeight: 275,
                            },
                        }}
                        article={article}
                        onClick={() => onClickArticle(article.id)}
                    />
                </Grid>
            ))}
        </Grid>
    );
}
