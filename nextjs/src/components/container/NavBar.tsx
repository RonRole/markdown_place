import { AppBar, AppBarProps, Button, Container, Toolbar, Typography } from '@mui/material';
import Link from 'next/link';
import React from 'react';
import { AuthContext } from '../context';
import { OpenAuthDialogButton } from './OpenAuthDialogButton';

import { LogoutButton } from './LogoutButton';
import { useRouter } from 'next/router';

export type LinkSrc = {
    path: string;
    display: string;
};

export type NavBarProps = {
    children: React.ReactNode;
} & Omit<AppBarProps, 'position'>;

// ログイン済の場合のみ表示されるリンク
const requireAuthorizedLinks: LinkSrc[] = [{ path: '/articles', display: '一覧' }];
// 管理者ユーザーの場合のみ表示されるリンク
const adminLinks: LinkSrc[] = [{ path: '/admin', display: '管理' }];

export function NavBar({ children, ...props }: NavBarProps) {
    const { currentAuthStatus } = React.useContext(AuthContext);
    const router = useRouter();
    const links = React.useMemo(
        () => [
            ...(currentAuthStatus.isFixedAsAuthorized ? requireAuthorizedLinks : []),
            ...(currentAuthStatus.isFixedAsAdmin ? adminLinks : []),
        ],
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
                            <Button
                                key={link.path}
                                sx={{ color: 'white' }}
                                onClick={() => router.push(link.path)}
                            >
                                {link.display}
                            </Button>
                        ))}
                    </Container>
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
