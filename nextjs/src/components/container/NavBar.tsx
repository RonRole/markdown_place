import { AppBar, Button, Container, Toolbar, Typography } from '@mui/material';
import Link from 'next/link';
import React from 'react';
import { AuthContext } from '../context';

import { LogoutButton } from './LogoutButton';

export type LinkSrc = {
    path: string;
    display: string;
};

export type NavBarProps = {
    children: React.ReactNode;
};

// ログイン済でなくても表示されるリンク
const commonLinks: LinkSrc[] = [{ path: '/login', display: 'ログイン/ユーザー登録' }];
// ログイン済の場合のみ表示されるリンク
const requireAuthorizedLinks: LinkSrc[] = [
    { path: '/articles', display: '記事一覧' },
    { path: '/articles/new', display: '記事作成' },
];

export function NavBar({ children }: NavBarProps) {
    const { currentAuthStatus } = React.useContext(AuthContext);
    const links = React.useMemo(
        () => [...(currentAuthStatus === 'authorized' ? requireAuthorizedLinks : [])],
        [currentAuthStatus]
    );
    return (
        <>
            <AppBar position="sticky">
                <Toolbar sx={{ flexGrow: 1 }}>
                    <Container sx={{ display: 'flex', flexGrow: 1 }} maxWidth="xl" disableGutters>
                        <Typography sx={{ mr: 2 }} variant="h6" component={Link} href="/">
                            Sawai Kei
                        </Typography>
                        {links.map((link) => (
                            <Link key={link.path} href={link.path} passHref>
                                <Button sx={{ color: 'white' }}>{link.display}</Button>
                            </Link>
                        ))}
                    </Container>
                    {currentAuthStatus === 'unauthorized' && (
                        <Link href="/login" passHref>
                            <Button sx={{ color: 'white', whiteSpace: 'nowrap' }}>
                                ログイン/ユーザー登録
                            </Button>
                        </Link>
                    )}
                    {currentAuthStatus === 'authorized' && (
                        <LogoutButton sx={{ whiteSpace: 'nowrap' }} />
                    )}
                </Toolbar>
            </AppBar>
            {children}
        </>
    );
}
