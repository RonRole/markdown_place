import { useRouter } from 'next/router';
import { EditArticleFormPage } from '../../../components/pages/EditArticleFormPage';
import { ShowErrorPageIfArticleIdIsInvalid } from '../../../components/functional/ShowErrorPageIfArticleIdIsInvalid';
import { LoadingPage } from '../../../components/pages';
import { ErrorPage } from '../../../components/pages/ErrorPage';
import { RequireAuthorized } from '../../../components/container';
import { ArticleEditParamsLoader } from '../../../components/functional/loaders/ArticleEditParamsLoader';
import { ArticleLoader } from '../../../components/functional/loaders/ArticleLoader';
import { AuthContext } from '../../../components/context';

export default function EditArticle() {
    const { articleId } = useRouter().query;
    return (
        <RequireAuthorized>
            <ShowErrorPageIfArticleIdIsInvalid articleId={articleId}>
                {(validArticleId) => (
                    <AuthContext.Consumer>
                        {({ tags }) => (
                            <ArticleLoader id={validArticleId}>
                                {(loading, loadResult) => {
                                    if (loading) return <LoadingPage />;
                                    if (!loadResult?.isSuccess) return <ErrorPage />;
                                    return (
                                        <EditArticleFormPage
                                            initialArticle={loadResult.data}
                                            initialMode="update"
                                            tagOptions={tags}
                                        />
                                    );
                                }}
                            </ArticleLoader>
                        )}
                    </AuthContext.Consumer>
                )}
            </ShowErrorPageIfArticleIdIsInvalid>
        </RequireAuthorized>
    );
}
