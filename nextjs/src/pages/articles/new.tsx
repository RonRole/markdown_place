import { EditNewArticleForm, RequireAuthorized } from '../../components/container';

export default function NewArticle() {
    return (
        <RequireAuthorized>
            <EditNewArticleForm />
        </RequireAuthorized>
    );
}
