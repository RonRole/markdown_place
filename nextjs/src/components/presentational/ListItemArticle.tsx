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
    onFeatured?: () => Promise<void>;
    onClicked?: () => Promise<void>;
    onEdit?: () => Promise<void>;
};

export function ListItemArticle({
    article,
    disabled = false,
    fixed = false,
    onChangeChecking,
    onFeatured,
    onClicked,
    onEdit,
}: ListItemArticleProps) {
    return (
        <ListItemButton
            disabled={disabled}
            onFocus={onFeatured}
            onMouseOver={onFeatured}
            sx={{
                padding: 0,
                whiteSpace: 'nowrap',
            }}
        >
            <Checkbox disableRipple />
            <ListItem onClick={onClicked} sx={{ overflow: 'hidden' }}>
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
