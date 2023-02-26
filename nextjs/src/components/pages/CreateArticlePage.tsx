import { ArticleTagsLoader } from '../functional/ArticleTagsLoader';
import { EditArticleFormPage } from './EditArticleFormPage';
import { ErrorPage } from './ErrorPage';
import { LoadingPage } from './LoadingPage';

export type CreateArticlePageProps = {};

export function CreateArticlePage({}: CreateArticlePageProps) {
    return (
        <ArticleTagsLoader>
            {(_, result) => {
                return (
                    <EditArticleFormPage
                        initialMode="create"
                        tagOptions={result?.isSuccess ? result.data : []}
                    />
                );
            }}
        </ArticleTagsLoader>
    );
}
