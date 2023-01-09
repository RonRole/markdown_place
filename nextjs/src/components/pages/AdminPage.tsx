import React from 'react';
import { AppGlobalConfig } from '../../domains/app-global-config';
import { NavBar } from '../container';
import { RequireAdmin } from '../container/RequireAdmin';
import { useAppGlobalConfig } from '../hooks/app-global-config';
import { FormControl, TextField, FormLabel, Container, Button } from '@mui/material';
import { LoadingPage } from './LoadingPage';
import { FormWithSubmittingState } from '../presentational';

export function AdminPage() {
    const listArticleCountInputRef = React.useRef<HTMLInputElement>(null);
    const [config, setConfig] = React.useState<AppGlobalConfig | null>(null);
    const { load, update } = useAppGlobalConfig();
    React.useEffect(() => {
        load().then((value) => {
            if (value instanceof AppGlobalConfig) {
                setConfig(value);
            }
        });
    }, [load]);
    const handleSubmit = React.useCallback(async () => {
        const listArticleCountInput = listArticleCountInputRef.current?.value;
        const listArticleCount = Number.isNaN(Number(listArticleCountInput))
            ? 0
            : Number(listArticleCountInput);
        await update({
            listArticleCount,
        });
    }, [update]);
    return (
        <RequireAdmin>
            {!config ? (
                <LoadingPage />
            ) : (
                <NavBar>
                    <Container maxWidth="xl">
                        <h1>管理者ページ</h1>
                        <FormWithSubmittingState onSubmit={handleSubmit}>
                            {(submitting) => (
                                <FormControl disabled={submitting} required>
                                    <FormLabel htmlFor="list-article-count">
                                        ページあたり記事読み込み件数
                                    </FormLabel>
                                    <TextField
                                        id="list-article-count"
                                        inputRef={listArticleCountInputRef}
                                        defaultValue={config.listArticleCount}
                                        type="number"
                                        disabled={submitting}
                                        required
                                        sx={{ mb: 1 }}
                                    />
                                    <Button disabled={submitting} type="submit" variant="outlined">
                                        更新
                                    </Button>
                                </FormControl>
                            )}
                        </FormWithSubmittingState>
                    </Container>
                </NavBar>
            )}
        </RequireAdmin>
    );
}
