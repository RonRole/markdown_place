import { Edit } from '@mui/icons-material';
import { Grid, List, ListItemButton } from '@mui/material';
import { useRouter } from 'next/router';
import React from 'react';
import { NavBar, RequireAuthorized } from '../../components/container';
import { ArticleLoader } from '../../components/functional/ArticleLoader';
import { LoadingPage } from '../../components/pages';
import { ErrorPage } from '../../components/pages/ErrorPage';
import { EditArticleForm } from '../../components/presentational';
import { ParsedMarkdown } from '../../components/presentational/ParsedMarkdown';
import Article from '../../domains/article';

export default function EditArticlePage() {
    const { articleId } = useRouter().query;
    const [editting, setEditting] = React.useState<boolean>(false);
    const handleStartEdit = React.useCallback(() => {
        setEditting(true);
    }, []);
    if (Number.isNaN(articleId)) return <></>;
    return (
        <RequireAuthorized>
            <ArticleLoader id={Number(articleId)}>
                {(loading, loadResult) => {
                    if (loading)
                        return (
                            <NavBar>
                                <div>読み込み中...</div>
                            </NavBar>
                        );
                    if (loadResult === null)
                        return (
                            <NavBar>
                                <div>記事が見つかりませんでした</div>
                            </NavBar>
                        );
                    if (!(loadResult instanceof Article))
                        return (
                            <NavBar>
                                <div>
                                    エラーが発生しました
                                    <ul>
                                        {loadResult.id?.map((e: string, i: number) => (
                                            <li key={i}>{e}</li>
                                        ))}
                                    </ul>
                                </div>
                            </NavBar>
                        );
                    if (editting)
                        return <EditArticleForm initialArticle={loadResult} initialMode="update" />;
                    return (
                        <NavBar>
                            <Grid container>
                                <Grid item xs={2}>
                                    <List>
                                        <ListItemButton onClick={handleStartEdit}>
                                            <Edit />
                                            編集
                                        </ListItemButton>
                                    </List>
                                </Grid>
                                <Grid item xs={8}>
                                    <ParsedMarkdown markdownSrc={loadResult.content} />
                                </Grid>
                                <Grid item xs={2}></Grid>
                            </Grid>
                        </NavBar>
                    );
                }}
            </ArticleLoader>
        </RequireAuthorized>
    );
}
