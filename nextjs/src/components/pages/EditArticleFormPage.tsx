import { AppBar, Box, Grid, TextareaAutosize, Toolbar, Tooltip } from '@mui/material';

import React from 'react';
import Article from '../../domains/article';
import { NavBar } from '../container';
import { ArticleSaveAsFormDialogProps } from '../container/ArticleSaveAsFormDialog';
import { SaveAsButton } from '../container/edit-article-form-action-buttons/SaveAsButton';
import {
    SaveButton,
    SaveButtonProps,
} from '../container/edit-article-form-action-buttons/SaveButton';

import { ParsedMarkdown } from '../presentational/ParsedMarkdown';

export type EditArticleFormComponentProps = {
    mode: EditArticleModeKey;
    article?: Article;
} & Omit<BottomBarProps, 'contentTextAreaRef' | 'article'>;

type BottomBarProps = {
    article?: Article;
    contentTextAreaRef: React.RefObject<HTMLTextAreaElement>;
    disabledSaveButton?: boolean;
    disabledSaveAsButton?: boolean;
} & Pick<ArticleSaveAsFormDialogProps, 'beforeCreateCallback' | 'afterCreateCallback'> &
    Pick<SaveButtonProps, 'beforeSaveCallback' | 'afterSaveCallback'>;

const BottomBar = ({
    article,
    contentTextAreaRef,
    beforeSaveCallback,
    afterSaveCallback,
    beforeCreateCallback,
    afterCreateCallback,
    disabledSaveButton = false,
    disabledSaveAsButton = false,
}: BottomBarProps) => {
    const [open, setOpen] = React.useState<boolean>(false);
    const handleClose = React.useCallback(() => setOpen(false), []);
    return (
        <AppBar
            position="fixed"
            sx={{
                top: 'auto',
                bottom: '0',
                opacity: 0.5,
            }}
        >
            <Toolbar sx={{ justifyContent: 'end' }}>
                <Tooltip title="上書き保存">
                    <span>
                        <SaveButton
                            article={article}
                            type="submit"
                            beforeSaveCallback={beforeSaveCallback}
                            afterSaveCallback={afterSaveCallback}
                            disabled={disabledSaveButton}
                            contentTextAreaRef={contentTextAreaRef}
                        />
                    </span>
                </Tooltip>
                <Tooltip title="タイトルをつけて保存">
                    <span>
                        <SaveAsButton
                            type="submit"
                            open={open}
                            onClose={handleClose}
                            contentTextAreaRef={contentTextAreaRef}
                            beforeCreateCallback={beforeCreateCallback}
                            afterCreateCallback={afterCreateCallback}
                            disabled={disabledSaveAsButton}
                        />
                    </span>
                </Tooltip>
            </Toolbar>
        </AppBar>
    );
};

export type EditArticleFormMode = {
    isAbleSave: boolean;
    isAbleSaveAs: boolean;
};

export type EditArticleModeKey = keyof typeof EditArticleFormModes;

const EditArticleFormModes = {
    unauthorized: {
        isAbleSave: false,
        isAbleSaveAs: false,
    },
    create: {
        isAbleSave: false,
        isAbleSaveAs: true,
    },
    update: {
        isAbleSave: true,
        isAbleSaveAs: true,
    },
};

export function EditArticleFormPage({
    mode,
    article,
    beforeSaveCallback = async () => {},
    afterSaveCallback = async () => {},
    beforeCreateCallback = async () => {},
    afterCreateCallback = async () => {},
}: EditArticleFormComponentProps) {
    const contentInputRef = React.useRef<HTMLTextAreaElement>(null);
    const [content, setContent] = React.useState<Article['content']>(article?.content || '');
    const [submitting, setSubmitting] = React.useState<boolean>(false);
    const handleChange = React.useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setContent(e.currentTarget.value);
    }, []);
    const wrappedBeforeCallback =
        <T,>(callback: (result: T) => Promise<void>) =>
        async (result: T) => {
            setSubmitting(true);
            await callback(result);
        };

    const wrappedAfterCallback =
        <T,>(callback: (result: T) => Promise<void>) =>
        async (result: T) => {
            await callback(result);
            setSubmitting(false);
        };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
            <NavBar>
                <Grid container sx={{ flexGrow: 1 }}>
                    <Grid item xs={4}>
                        <TextareaAutosize
                            ref={contentInputRef}
                            defaultValue={content}
                            disabled={submitting}
                            onChange={handleChange}
                            style={{
                                width: '100%',
                                resize: 'none',
                                height: '100%',
                                overflow: 'scroll',
                            }}
                            placeholder="こっちが入力エリア"
                        />
                    </Grid>
                    <Grid item xs={8}>
                        <ParsedMarkdown sx={{ overflow: 'scroll' }} markdownSrc={content} />
                    </Grid>
                </Grid>
                <BottomBar
                    disabledSaveButton={submitting || !EditArticleFormModes[mode].isAbleSave}
                    disabledSaveAsButton={submitting || !EditArticleFormModes[mode].isAbleSaveAs}
                    article={article}
                    contentTextAreaRef={contentInputRef}
                    beforeSaveCallback={wrappedBeforeCallback(beforeSaveCallback)}
                    afterSaveCallback={wrappedAfterCallback(afterSaveCallback)}
                    beforeCreateCallback={wrappedBeforeCallback(beforeCreateCallback)}
                    afterCreateCallback={wrappedAfterCallback(afterCreateCallback)}
                />
            </NavBar>
        </Box>
    );
}
