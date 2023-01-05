import HTMLReactParser from 'html-react-parser';
import { marked } from 'marked';
import React from 'react';

export type ParsedMarkdownProps = {
    markdownSrc?: string;
};

export function ParsedMarkdown({ markdownSrc }: ParsedMarkdownProps) {
    if (!markdownSrc) return <></>;
    const htmlSrc = marked.parse(markdownSrc);
    const parsed = HTMLReactParser(htmlSrc);
    return <>{parsed}</>;
}
