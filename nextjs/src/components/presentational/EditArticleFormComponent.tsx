import { Save } from '@mui/icons-material';
import {
    AppBar,
    Box,
    Container,
    IconButton,
    TextareaAutosize,
    Toolbar,
    Tooltip,
} from '@mui/material';
import HTMLReactParser from 'html-react-parser';
import { marked } from 'marked';
import React from 'react';
import { FormWithSubmittingState } from './FormWithSubmittingState';

export type EditArticleFormComponentProps = {
    onSubmit(content: string): Promise<void>;
};

export function EditArticleFormComponent({ onSubmit }: EditArticleFormComponentProps) {
    const contentRef = React.useRef<HTMLTextAreaElement>(null);
    const [parsed, setParsed] = React.useState<ReturnType<typeof HTMLReactParser>>('');
    const handleChange = React.useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const src = marked.parse(e.currentTarget.value);
        const parsed = HTMLReactParser(src);
        setParsed(parsed);
    }, []);
    const handleSubmit = React.useCallback(
        async (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            const content = contentRef.current?.value || '';
            await onSubmit(content);
        },
        [onSubmit]
    );
    return (
        <FormWithSubmittingState onSubmit={handleSubmit}>
            {(submitting) => (
                <>
                    <Container maxWidth="xl" sx={{ display: 'flex' }} disableGutters>
                        <Box flex={2} sx={{ height: '100vh' }}>
                            <TextareaAutosize
                                ref={contentRef}
                                disabled={submitting}
                                onChange={handleChange}
                                style={{ width: '100%', resize: 'none', height: '100%' }}
                                placeholder="こっちが入力エリア"
                            />
                        </Box>
                        <Box flex={3}>{parsed}</Box>
                    </Container>
                    <AppBar
                        position="fixed"
                        sx={{
                            top: 'auto',
                            bottom: '0',
                            opacity: 0.5,
                        }}
                    >
                        <Toolbar sx={{ justifyContent: 'end' }}>
                            <Tooltip title="保存">
                                <IconButton type="submit" disabled={submitting}>
                                    <Save />
                                </IconButton>
                            </Tooltip>
                        </Toolbar>
                    </AppBar>
                </>
            )}
        </FormWithSubmittingState>
    );
}
