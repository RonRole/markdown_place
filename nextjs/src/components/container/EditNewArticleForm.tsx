import { Box, Button, Container, TextareaAutosize } from '@mui/material';
import React from 'react';
import { marked } from 'marked';
import parseHtmlToReact from 'html-react-parser';
import { useArticles } from '../hooks';

export function EditNewArticleForm() {
    const [content, setContent] = React.useState<string>('');
    const [parsed, setParsed] = React.useState<ReturnType<typeof parseHtmlToReact>>('');
    const handleChange = React.useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setContent(e.currentTarget.value);
        const src = marked.parse(e.currentTarget.value);
        const parsed = parseHtmlToReact(src);
        setParsed(parsed);
    }, []);
    const { create } = useArticles();
    const onSubmit = React.useCallback(
        async (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            const title = content.split('\n').find((e) => e) || '';
            await create({
                title,
                content,
            });
        },
        [content, create]
    );
    return (
        <form onSubmit={onSubmit}>
            <Container maxWidth="xl" sx={{ display: 'flex', flexGlow: '2' }}>
                <Box sx={{ flexGlow: 1, width: '100%' }}>
                    <TextareaAutosize
                        onChange={handleChange}
                        style={{ width: '100%', resize: 'none', height: '100vh' }}
                        placeholder="こっちが入力エリア"
                    />
                </Box>
                <Box sx={{ flexGlow: 1, width: '100%' }}>{parsed}</Box>
            </Container>
            <Button type="submit">Submit</Button>
        </form>
    );
}
