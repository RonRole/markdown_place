import { useRouter } from 'next/router';
import { NavBar, RequireAuthorized } from '../../components/container';

export default function EditArticlePage() {
    const router = useRouter();
    const { articleId } = router.query;
    return (
        <RequireAuthorized>
            <h1>記事閲覧/編集機能 記事ID:{articleId}</h1>
        </RequireAuthorized>
    );
}
