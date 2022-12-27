import { Box, Container, TextareaAutosize } from '@mui/material';
import React from 'react';
import { marked } from 'marked';
import parseHtmlToReact from 'html-react-parser';

export function EditNewArticleForm() {
    const [content, setContent] = React.useState<string>('');
    const handleChange = React.useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setContent(e.currentTarget.value);
    }, []);
    const parsed = React.useMemo(() => {
        const src = marked.parse(content);
        return parseHtmlToReact(src);
    }, [content]);
    return (
        <Container maxWidth="xl" sx={{ display: 'flex', flexGlow: '2' }}>
            <Box sx={{ flexGlow: 1, width: '100%' }}>
                <TextareaAutosize
                    onChange={handleChange}
                    style={{ width: '100%', resize: 'none', height: '100vh' }}
                    placeholder="こっちが入力エリア"
                ></TextareaAutosize>
            </Box>
            <Box sx={{ flexGlow: 1, width: '100%' }}>{parsed}</Box>
        </Container>
    );
}
