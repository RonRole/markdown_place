import { Box, BoxProps, SxProps } from '@mui/material';
import HTMLReactParser from 'html-react-parser';
import { marked } from 'marked';
import React from 'react';

export type ParsedMarkdownProps = {
    markdownSrc?: string;
} & BoxProps;

export function ParsedMarkdown({ markdownSrc, ...props }: ParsedMarkdownProps) {
    if (!markdownSrc) return <></>;
    const htmlSrc = marked.parse(markdownSrc);
    const parsed = HTMLReactParser(htmlSrc);
    return <Box {...props}>{parsed}</Box>;
}
