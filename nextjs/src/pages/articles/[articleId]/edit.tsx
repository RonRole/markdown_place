import { useRouter } from 'next/router';
import { EditArticleFormPage } from '../../../components/pages/EditArticleFormPage';
import { ShowErrorPageIfArticleIdIsInvalid } from '../../../components/functional/ShowErrorPageIfArticleIdIsInvalid';
import { LoadingPage } from '../../../components/pages';
import { ErrorPage } from '../../../components/pages/ErrorPage';
import { RequireAuthorized } from '../../../components/container';
import { ArticleEditParamsLoader } from '../../../components/presentational/ArticleEditParamsLoader';

export default function EditArticle() {
    const { articleId } = useRouter().query;
    return (
        <RequireAuthorized>
            <ShowErrorPageIfArticleIdIsInvalid articleId={articleId}>
                {(validArticleId) => (
                    <ArticleEditParamsLoader id={validArticleId}>
                        {(loading, loadResult) => {
                            if (loading) return <LoadingPage />;
                            if (!loadResult?.article.isSuccess || !loadResult.tags.isSuccess)
                                return <ErrorPage />;
                            return (
                                <EditArticleFormPage
                                    initialArticle={loadResult.article.data}
                                    initialMode="update"
                                    tagOptions={loadResult.tags.data}
                                />
                            );
                        }}
                    </ArticleEditParamsLoader>
                )}
            </ShowErrorPageIfArticleIdIsInvalid>
        </RequireAuthorized>
    );
}
