import { Label } from '@mui/icons-material';
import { Autocomplete, IconButton, IconButtonProps, Stack, TextField } from '@mui/material';
import React from 'react';
import { ConfirmDialog } from '../../presentational/ConfirmDialog';

export type AddLabelButtonProps = Omit<IconButtonProps, 'onClick'>;

export function AddLabelButton({ ...props }: AddLabelButtonProps) {
    const [open, setOpen] = React.useState(false);
    return (
        <>
            <IconButton {...props} onClick={() => setOpen(true)}>
                <Label />
            </IconButton>
            <ConfirmDialog
                message="ラベルを選択してください"
                open={open}
                onClose={() => setOpen(false)}
                maxWidth="xs"
                cancelButtonProps={{
                    onClick: () => setOpen(false),
                }}
            >
                <Stack maxWidth={275}>
                    <Autocomplete
                        multiple
                        sx={{ width: '100%' }}
                        options={['テスト1', 'テスト2', 'テスト3']}
                        renderInput={(params) => (
                            <TextField {...params} label="ラベル" variant="standard" />
                        )}
                    />
                </Stack>
            </ConfirmDialog>
        </>
    );
}
