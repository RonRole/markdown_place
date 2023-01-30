import { List, ListProps } from '@mui/material';
import Article from '../../domains/article';
import { ListItemArticle, ListItemArticleProps } from './ListItemArticle';

export type ArticleListProps = {
    articles: Article[];
    fixedArticleId?: Article['id'];
    checkedArticleIdsSet?: Set<Article['id']>;
} & Pick<
    ListItemArticleProps,
    'disabled' | 'onChangeChecking' | 'onClick' | 'onEdit' | 'onFeature'
> &
    Omit<ListProps, 'onClick'>;

export function ArticleList({
    articles,
    fixedArticleId,
    checkedArticleIdsSet = new Set(),
    disabled,
    onChangeChecking,
    onClick,
    onEdit,
    onFeature,
    ...props
}: ArticleListProps) {
    return (
        <List {...props}>
            {articles.map((article: Article) => {
                return (
                    <ListItemArticle
                        key={article.id}
                        disabled={disabled}
                        article={article}
                        checked={checkedArticleIdsSet.has(article.id)}
                        fixed={fixedArticleId === article.id}
                        onChangeChecking={onChangeChecking}
                        onFeature={onFeature}
                        onClick={onClick}
                        onEdit={onEdit}
                    />
                );
            })}
        </List>
    );
}
