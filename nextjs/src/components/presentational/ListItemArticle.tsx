import { Edit, Place } from '@mui/icons-material';
import {
    Checkbox,
    IconButton,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Tooltip,
} from '@mui/material';
import Article from '../../domains/article';

export type ListItemArticleProps = {
    article: Article;
    disabled?: boolean;
    fixed?: boolean;
    onChangeChecking?: (checked: boolean) => Promise<void>;
    onFeature?: () => Promise<void>;
    onClick?: () => Promise<void>;
    onEdit?: () => Promise<void>;
};

export function ListItemArticle({
    article,
    disabled = false,
    fixed = false,
    onChangeChecking = async () => {},
    onFeature,
    onClick,
    onEdit,
}: ListItemArticleProps) {
    return (
        <ListItemButton
            disabled={disabled}
            onFocus={onFeature}
            onMouseOver={onFeature}
            sx={{
                padding: 0,
                whiteSpace: 'nowrap',
            }}
        >
            <Checkbox disableRipple onChange={(_, checked) => onChangeChecking(checked)} />
            <ListItem onClick={onClick} sx={{ overflow: 'hidden' }}>
                <ListItemText>{article.title}</ListItemText>
            </ListItem>
            {fixed && <Place />}
            <Tooltip arrow placement="top-end" title="編集">
                <IconButton disableRipple onClick={onEdit}>
                    <Edit />
                </IconButton>
            </Tooltip>
        </ListItemButton>
    );
}
