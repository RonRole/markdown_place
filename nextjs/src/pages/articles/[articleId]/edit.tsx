import { useRouter } from 'next/router';
import { ArticleLoader } from '../../../components/functional/ArticleLoader';
import { EditArticleFormPage } from '../../../components/pages/EditArticleFormPage';
import { ShowErrorPageIfArticleIdIsInvalid } from '../../../components/functional/ShowErrorPageIfArticleIdIsInvalid';
import { LoadingPage } from '../../../components/pages';
import { ErrorPage } from '../../../components/pages/ErrorPage';

export default function EditArticle() {
    const { articleId } = useRouter().query;
    return (
        <ShowErrorPageIfArticleIdIsInvalid articleId={articleId}>
            {(validArticleId) => (
                <ArticleLoader id={validArticleId}>
                    {(loading, loadResult) => {
                        if (loading) return <LoadingPage />;
                        if (!loadResult?.isSuccess)
                            return <ErrorPage errorMessage={loadResult?.data.id} />;
                        return (
                            <EditArticleFormPage
                                initialArticle={loadResult.data}
                                initialMode="update"
                            />
                        );
                    }}
                </ArticleLoader>
            )}
        </ShowErrorPageIfArticleIdIsInvalid>
    );
}
