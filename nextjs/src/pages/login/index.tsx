import { useRouter } from 'next/router';
import React from 'react';
import { LoginResult } from '../../components/hooks';
import { LoginPage } from '../../components/pages';

export default function Login() {
    const router = useRouter();
    const afterLoginCallback = React.useCallback(
        async (result: LoginResult) => {
            if (result === true) {
                await router.push('/');
            }
        },
        [router]
    );
    return <LoginPage afterLoginCallback={afterLoginCallback} />;
}
