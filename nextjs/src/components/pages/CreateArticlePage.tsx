import { AuthContext } from '../context';
import { EditArticleFormPage } from './EditArticleFormPage';
import { ErrorPage } from './ErrorPage';
import { LoadingPage } from './LoadingPage';

export type CreateArticlePageProps = {};

export function CreateArticlePage({}: CreateArticlePageProps) {
    return (
        <AuthContext.Consumer>
            {({ tags }) => <EditArticleFormPage initialMode="create" tagOptions={tags} />}
        </AuthContext.Consumer>
    );
}
