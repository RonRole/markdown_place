import { AppBar, AppBarProps, Box, Button, Container, Toolbar, Typography } from '@mui/material';
import Link from 'next/link';
import React from 'react';
import { AuthContext } from '../context';
import { OpenAuthDialogButton } from './OpenAuthDialogButton';

import { LogoutButton } from './LogoutButton';
import { useRouter } from 'next/router';
import { ArticleSearchFormComponent } from '../presentational/ArticleSearchFormComponent';

export type LinkSrc = {
    path: string;
    display: string;
};

export type NavBarProps = {
    children: React.ReactNode;
} & Omit<AppBarProps, 'position'>;

// 管理者ユーザーの場合のみ表示されるリンク
const adminLinks: LinkSrc[] = [{ path: '/admin', display: '管理' }];

export function NavBar({ children, ...props }: NavBarProps) {
    const { currentAuthStatus } = React.useContext(AuthContext);
    const router = useRouter();
    const links = React.useMemo(
        () => [...(currentAuthStatus.isFixedAsAdmin ? adminLinks : [])],
        [currentAuthStatus]
    );
    const onSearch = React.useCallback(
        async (value = '') => {
            await router.push(`/articles?q=${value}`);
        },
        [router]
    );
    return (
        <>
            <AppBar position="sticky" {...props}>
                <Toolbar sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', flexGrow: 1 }}>
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
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'end', alignItems: 'center' }}>
                        {currentAuthStatus.isFixedAsAuthorized && (
                            <Box mr={2}>
                                <ArticleSearchFormComponent onSubmit={onSearch} />
                            </Box>
                        )}
                        {currentAuthStatus.isFixedAsUnauthorized && (
                            <OpenAuthDialogButton sx={{ whiteSpace: 'nowrap' }} />
                        )}
                        {currentAuthStatus.isFixedAsAuthorized && (
                            <LogoutButton sx={{ whiteSpace: 'nowrap' }} />
                        )}
                    </Box>
                </Toolbar>
            </AppBar>
            {children}
        </>
    );
}
