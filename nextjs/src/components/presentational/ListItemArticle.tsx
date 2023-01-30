import { Edit, Place } from '@mui/icons-material';
import {
    Checkbox,
    IconButton,
    ListItem,
    ListItemButton,
    ListItemText,
    Tooltip,
} from '@mui/material';
import Article from '../../domains/article';

export type ListItemArticleProps = {
    article: Article;
    disabled?: boolean;
    checked?: boolean;
    fixed?: boolean;
    onChangeChecking?: (checked: boolean, article: Article) => Promise<void>;
    onFeature?: (article: Article) => Promise<void>;
    onClick?: (article: Article) => Promise<void>;
    onEdit?: (article: Article) => Promise<void>;
};

export function ListItemArticle({
    article,
    disabled = false,
    checked = false,
    fixed = false,
    onChangeChecking = async () => {},
    onFeature = async () => {},
    onClick = async () => {},
    onEdit = async () => {},
}: ListItemArticleProps) {
    return (
        <ListItemButton
            disabled={disabled}
            onFocus={() => onFeature(article)}
            onMouseOver={() => onFeature(article)}
            sx={{
                padding: 0,
                whiteSpace: 'nowrap',
            }}
        >
            <Checkbox
                checked={checked}
                disableRipple
                onChange={(_, checked) => onChangeChecking(checked, article)}
            />
            <ListItem onClick={() => onClick(article)} sx={{ overflow: 'hidden' }}>
                <ListItemText>{article.title}</ListItemText>
            </ListItem>
            {fixed && <Place />}
            <Tooltip arrow placement="top-end" title="編集">
                <IconButton disableRipple onClick={() => onEdit(article)}>
                    <Edit />
                </IconButton>
            </Tooltip>
        </ListItemButton>
    );
}
