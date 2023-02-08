import { useRouter } from 'next/router';
import { RequireAuthorized } from '../../../components/container';
import { ShowErrorPageIfArticleIdIsInvalid } from '../../../components/functional/ShowErrorPageIfArticleIdIsInvalid';
import { ShowArticlePage } from '../../../components/pages/ShowArticlePage';

export default function ShowArticle() {
    const { articleId } = useRouter().query;
    return (
        <RequireAuthorized>
            <ShowErrorPageIfArticleIdIsInvalid articleId={articleId}>
                {(validArticleId) => <ShowArticlePage articleId={validArticleId} />}
            </ShowErrorPageIfArticleIdIsInvalid>
        </RequireAuthorized>
    );
}
