import { AppBar, Toolbar, ToolbarProps, Tooltip } from '@mui/material';
import React from 'react';
import Article from '../../../domains/article';
import { AfterCreateCallback, BeforeCreateCallback } from '../ArticleSaveAsFormDialog';
import { SaveAsButton } from './SaveAsButton';
import { AfterSaveCallback, BeforeSaveCallback, SaveButton, SaveButtonProps } from './SaveButton';

/**
 * ツールバー共通のコールバック
 * 各アイテムごとのコールバックが呼ばれる前後に共通して呼ばれる
 */
export type ToolBarCommonCallbacks = Partial<{
    before: () => Promise<void>;
    after: () => Promise<void>;
}>;

/**
 * 各アイテムごとのコールバック
 */
export type BottomBarActionCallbacks = Partial<{
    save: Partial<{
        before: BeforeSaveCallback;
        after: AfterSaveCallback;
    }>;
    create: Partial<{
        before: BeforeCreateCallback;
        after: AfterCreateCallback;
    }>;
}>;

export type ItemStates = Partial<{
    [key in 'save' | 'saveAs']: Partial<{ hidden: boolean; disabled: boolean }>;
}>;

export type EditArticleToolBarProps = {
    contentTextAreaRef: React.RefObject<HTMLTextAreaElement>;
    article?: Article;
    disabled?: boolean;
    commonCallbacks?: ToolBarCommonCallbacks;
    itemCallbacks?: BottomBarActionCallbacks;
    itemStates?: ItemStates;
} & ToolbarProps;

export const EditArticleToolBar = ({
    contentTextAreaRef,
    article,
    disabled = false,
    commonCallbacks,
    itemCallbacks,
    itemStates,
    ...props
}: EditArticleToolBarProps) => {
    const [open, setOpen] = React.useState<boolean>(false);
    const handleClose = React.useCallback(() => setOpen(false), []);
    return (
        <Toolbar {...props}>
            {!itemStates?.save?.hidden && (
                <Tooltip title="上書き保存">
                    <span>
                        <SaveButton
                            article={article}
                            type="submit"
                            beforeSaveCallbacks={[
                                commonCallbacks?.before,
                                itemCallbacks?.save?.before,
                            ]}
                            afterSaveCallbacks={[
                                itemCallbacks?.save?.after,
                                commonCallbacks?.after,
                            ]}
                            contentTextAreaRef={contentTextAreaRef}
                            disabled={disabled || itemStates?.save?.disabled}
                        />
                    </span>
                </Tooltip>
            )}
            {!itemStates?.saveAs?.hidden && (
                <Tooltip title="タイトルをつけて保存">
                    <span>
                        <SaveAsButton
                            type="submit"
                            open={open}
                            onClose={handleClose}
                            contentTextAreaRef={contentTextAreaRef}
                            beforeCreateCallbacks={[
                                commonCallbacks?.after,
                                itemCallbacks?.create?.before,
                            ]}
                            afterCreateCallbacks={[
                                itemCallbacks?.create?.after,
                                commonCallbacks?.after,
                            ]}
                            disabled={disabled || itemStates?.saveAs?.disabled}
                        />
                    </span>
                </Tooltip>
            )}
        </Toolbar>
    );
};
