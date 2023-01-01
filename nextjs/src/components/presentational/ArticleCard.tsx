import {
    Card,
    CardContent,
    CardContentProps,
    CardHeader,
    CardHeaderProps,
    CardProps,
} from '@mui/material';
import Article from '../../domains/article';
import { ParsedMarkdown } from './ParsedMarkdown';

export type ArticleCardProps = {
    article: Article;
    cardHeaderProps?: Omit<CardHeaderProps, 'title'>;
    cardContentProps?: Omit<CardContentProps, 'children'>;
} & CardProps;

export default function ArticleCard({
    article,
    cardHeaderProps,
    cardContentProps,
    ...props
}: ArticleCardProps) {
    return (
        <Card {...props}>
            <CardContent {...cardContentProps}>
                <ParsedMarkdown markdownSrc={article.content} />
            </CardContent>
        </Card>
    );
}
