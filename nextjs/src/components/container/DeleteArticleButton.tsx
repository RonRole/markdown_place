import { Delete } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import Article from '../../domains/article';

export type DeleteArticleButtonProps = {
    targetArticleIdsRef: React.MutableRefObject<Set<Article['id']>>;
};

export function DeleteArticleButton({ targetArticleIdsRef }: DeleteArticleButtonProps) {
    return (
        <IconButton onClick={() => console.log(targetArticleIdsRef.current)}>
            <Delete />
        </IconButton>
    );
}
