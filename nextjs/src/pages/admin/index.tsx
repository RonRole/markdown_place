import { RequireAdmin } from '../../components/container/RequireAdmin';
import { AdminPage } from '../../components/pages/AdminPage';

export default function Admin() {
    return (
        <RequireAdmin>
            <AdminPage />
        </RequireAdmin>
    );
}
