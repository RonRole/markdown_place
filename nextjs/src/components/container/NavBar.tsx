import { AppBar, AppBarProps, Button, Container, Toolbar, Typography } from '@mui/material';
import Link from 'next/link';
import React from 'react';
import { AuthContext } from '../context';
import { OpenAuthDialogButton } from './OpenAuthDialogButton';

import { LogoutButton } from './LogoutButton';

export type LinkSrc = {
    path: string;
    display: string;
};

export type NavBarProps = {
    children: React.ReactNode;
} & Omit<AppBarProps, 'position'>;

// ログイン済の場合のみ表示されるリンク
const requireAuthorizedLinks: LinkSrc[] = [{ path: '/articles', display: '一覧' }];

export function NavBar({ children, ...props }: NavBarProps) {
    const { currentAuthStatus } = React.useContext(AuthContext);
    const links = React.useMemo(
        () => [...(currentAuthStatus.isFixedAsAuthorized ? requireAuthorizedLinks : [])],
        [currentAuthStatus]
    );
    return (
        <>
            <AppBar position="sticky" {...props}>
                <Toolbar sx={{ flexGrow: 1 }}>
                    <Container sx={{ display: 'flex', flexGrow: 1 }} maxWidth="xl" disableGutters>
                        <Typography sx={{ mr: 2 }} variant="h6" component={Link} href="/">
                            MarkdownPlace
                        </Typography>
                        {links.map((link) => (
                            <Link key={link.path} href={link.path} passHref>
                                <Button sx={{ color: 'white' }}>{link.display}</Button>
                            </Link>
                        ))}
                    </Container>

                    {currentAuthStatus.isFixedAsAdmin && (
                        <Button variant="outlined" sx={{ whiteSpace: 'nowrap' }}>
                            管理者ボタン
                        </Button>
                    )}
                    {currentAuthStatus.isFixedAsUnauthorized && (
                        <OpenAuthDialogButton sx={{ whiteSpace: 'nowrap' }} />
                    )}
                    {currentAuthStatus.isFixedAsAuthorized && (
                        <LogoutButton sx={{ whiteSpace: 'nowrap' }} />
                    )}
                </Toolbar>
            </AppBar>
            {children}
        </>
    );
}
