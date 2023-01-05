import { Save, SaveAs } from '@mui/icons-material';
import { AppBar, Grid, IconButton, TextareaAutosize, Toolbar, Tooltip } from '@mui/material';

import React from 'react';
import { FormWithSubmittingState } from '../presentational/FormWithSubmittingState';
import { ParsedMarkdown } from '../presentational/ParsedMarkdown';

export type OnsubmitInput = {
    submitterId: SubmitterId;
    content: string;
};

export type EditArticleFormComponentProps = {
    mode: EditArticleModeKey;
    defaultInput?: string;
    onSubmit(input: OnsubmitInput): Promise<void>;
};

export type SubmitterId = 'save' | 'saveAs';

type BottomBarProps = {
    disabledSaveButton?: boolean;
    disabledSaveAsButton?: boolean;
};

const BottomBar = ({
    disabledSaveButton = false,
    disabledSaveAsButton = false,
}: BottomBarProps) => {
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
                        <IconButton id="save" type="submit" disabled={disabledSaveButton}>
                            <Save />
                        </IconButton>
                    </span>
                </Tooltip>
                <Tooltip title="新しいタイトルで保存">
                    <span>
                        <IconButton id="saveAs" type="submit" disabled={disabledSaveAsButton}>
                            <SaveAs />
                        </IconButton>
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
    defaultInput = '',
    onSubmit,
}: EditArticleFormComponentProps) {
    const [content, setContent] = React.useState<string>(defaultInput);
    const handleChange = React.useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setContent(e.currentTarget.value);
    }, []);
    const handleSubmit = React.useCallback(
        async (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            const submitterId = (e.nativeEvent as SubmitEvent).submitter?.id as SubmitterId;
            if (!submitterId) {
                return;
            }
            await onSubmit({
                submitterId,
                content,
            });
        },
        [content, onSubmit]
    );
    return (
        <FormWithSubmittingState onSubmit={handleSubmit}>
            {(submitting) => (
                <>
                    <Grid container sx={{ height: '100vh' }}>
                        <Grid item xs={4}>
                            <TextareaAutosize
                                defaultValue={content}
                                disabled={submitting}
                                onChange={handleChange}
                                style={{ width: '100%', resize: 'none', height: '100%' }}
                                placeholder="こっちが入力エリア"
                            />
                        </Grid>
                        <Grid item xs={8}>
                            <ParsedMarkdown markdownSrc={content} />
                        </Grid>
                    </Grid>
                    <BottomBar
                        disabledSaveButton={submitting || !EditArticleFormModes[mode].isAbleSave}
                        disabledSaveAsButton={
                            submitting || !EditArticleFormModes[mode].isAbleSaveAs
                        }
                    />
                </>
            )}
        </FormWithSubmittingState>
    );
}
