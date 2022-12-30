import { EditArticleForm, RequireAuthorized } from '../../components/container';

export default function NewArticle() {
    return (
        <RequireAuthorized>
            <EditArticleForm />
        </RequireAuthorized>
    );
}
