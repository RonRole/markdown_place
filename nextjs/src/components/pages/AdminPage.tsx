import React from 'react';
import { AppGlobalConfig } from '../../domains/app-global-config';
import { NavBar } from '../container';
import { RequireAdmin } from '../container/RequireAdmin';
import { useAppGlobalConfig } from '../hooks/app-global-config';
import { Box, FormControl, TextField, FormLabel, Container, Button, Grid } from '@mui/material';
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
                    <FormWithSubmittingState onSubmit={handleSubmit}>
                        {(submitting) => (
                            <Container>
                                <h1>管理者ページ</h1>
                                <Grid container rowSpacing={4} columnSpacing={1}>
                                    <FormControl
                                        component={Grid}
                                        item
                                        xs={4}
                                        disabled={submitting}
                                        required
                                    >
                                        <TextField
                                            id="list-article-count"
                                            label="1ページあたりの記事読み込み件数"
                                            inputRef={listArticleCountInputRef}
                                            defaultValue={config.listArticleCount}
                                            type="number"
                                            disabled={submitting}
                                            required
                                            sx={{ mb: 1 }}
                                            variant="standard"
                                        />
                                    </FormControl>
                                </Grid>
                                <Box sx={{ display: 'flex', justifyContent: 'end' }}>
                                    <Button disabled={submitting} type="submit" variant="outlined">
                                        更新
                                    </Button>
                                </Box>
                            </Container>
                        )}
                    </FormWithSubmittingState>
                </NavBar>
            )}
        </RequireAdmin>
    );
}
