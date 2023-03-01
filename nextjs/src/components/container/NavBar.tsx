import {
    AppBar,
    AppBarProps,
    Box,
    Button,
    Container,
    FormControlLabel,
    FormGroup,
    Switch,
    SxProps,
    Toolbar,
    Typography,
} from '@mui/material';
import Link from 'next/link';
import React from 'react';
import { AuthContext } from '../context';
import { OpenAuthDialogButton } from './OpenAuthDialogButton';

import { LogoutButton } from './LogoutButton';
import { useRouter } from 'next/router';
import {
    ArticleSearchFormComponent,
    ArticleSearchFormComponentProps,
    SearchBy,
} from '../presentational/ArticleSearchFormComponent';
import ArticleTag from '../../domains/article-tag';

export type LinkSrc = {
    path: string;
    display: string;
};

export type NavBarProps = {
    children: React.ReactNode;
} & Omit<AppBarProps, 'position'>;

// ログイン済ユーザーの場合に表示されるリンク
const authUsersLinks: LinkSrc[] = [{ path: '/articles', display: '一覧' }];

// 管理者ユーザーの場合のみ表示されるリンク
const adminLinks: LinkSrc[] = [{ path: '/admin', display: '管理' }];

export function NavBar({ children, ...props }: NavBarProps) {
    const { currentAuthStatus, tags } = React.useContext(AuthContext);
    const router = useRouter();
    const links = React.useMemo(
        () => [
            ...(currentAuthStatus.isFixedAsAuthorized ? authUsersLinks : []),
            ...(currentAuthStatus.isFixedAsAdmin ? adminLinks : []),
        ],
        [currentAuthStatus]
    );
    return (
        <>
            <AppBar position="sticky" {...props}>
                <Toolbar sx={{ flexGrow: 1, height: '100%' }}>
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
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'end',
                            alignItems: 'center',
                            height: '100%',
                        }}
                    >
                        {currentAuthStatus.isFixedAsAuthorized && (
                            <NavbarArticleSearchForm
                                tags={tags}
                                formSx={{ width: 275, mr: 1, height: '100%' }}
                            />
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

function NavbarArticleSearchForm({ formSx, tags }: { formSx: SxProps; tags: ArticleTag[] }) {
    const [searchBy, setSearchBy] = React.useState<SearchBy>('titleOrContent');
    return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <FormGroup>
                <FormControlLabel
                    control={<Switch />}
                    label="タグで検索"
                    onChange={(_, checked) =>
                        checked ? setSearchBy('tags') : setSearchBy('titleOrContent')
                    }
                />
            </FormGroup>
            {searchBy === 'titleOrContent' && <SearchByTitleOrContent sx={formSx} />}
            {searchBy === 'tags' && <SearchByTags sx={formSx} tags={tags} />}
        </Box>
    );
}

function SearchByTitleOrContent({ sx }: { sx: SxProps }) {
    const router = useRouter();
    const onSubmit = React.useCallback(
        async (value = '') => {
            await router.push(`/articles?q=${value}`);
        },
        [router]
    );
    return (
        <ArticleSearchFormComponent
            searchBy="titleOrContent"
            onSubmit={onSubmit}
            componentProps={{
                sx,
            }}
        />
    );
}

function SearchByTags({ tags, sx }: { tags: ArticleTag[]; sx: SxProps }) {
    const router = useRouter();
    const onSubmit = React.useCallback(
        async (values: ArticleTag[] = []) => {
            const tagIds = values.map((value) => `${value.id}`).join('&tag_ids=');
            await router.push(`/articles?tag_ids=${tagIds}`);
        },
        [router]
    );
    return (
        <ArticleSearchFormComponent tagOptions={tags} searchBy="tags" onSubmit={onSubmit} sx={sx} />
    );
}
