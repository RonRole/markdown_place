import { useRouter } from 'next/router';
import { ShowErrorPageIfArticleIdIsInvalid } from '../../../components/functional/ShowErrorPageIfArticleIdIsInvalid';
import { ShowArticlePage } from '../../../components/pages/ShowArticlePage';

export default function ShowArticle() {
    const { articleId } = useRouter().query;
    return (
        <ShowErrorPageIfArticleIdIsInvalid articleId={articleId}>
            {(validArticleId) => <ShowArticlePage articleId={validArticleId} />}
        </ShowErrorPageIfArticleIdIsInvalid>
    );
}
