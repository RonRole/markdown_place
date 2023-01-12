import { useRouter } from 'next/router';
import { ErrorPage } from '../../components/pages/ErrorPage';
import { ShowArticlePage } from '../../components/pages/ShowArticlePage';

export default function EditArticlePage() {
    const { articleId } = useRouter().query;
    if (typeof articleId !== 'string' || Number.isNaN(articleId)) {
        return <ErrorPage errorMessage="記事IDが不正です" />;
    }
    return <ShowArticlePage articleId={Number(articleId)} />;
}
