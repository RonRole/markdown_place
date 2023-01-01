import HTMLReactParser from 'html-react-parser';
import { marked } from 'marked';
import React from 'react';

export type PrasedMarkdownProps = {
    markdownSrc?: string;
};

export function ParsedMarkdown({ markdownSrc = '' }: PrasedMarkdownProps) {
    const htmlSrc = marked.parse(markdownSrc);
    const parsed = React.useMemo(() => HTMLReactParser(htmlSrc), [htmlSrc]);
    return <>{parsed}</>;
}
