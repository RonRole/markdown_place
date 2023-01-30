import {
    Dialog,
    DialogProps,
    Card,
    CardHeader,
    CardContent,
    Button,
    CardProps,
    ButtonProps,
} from '@mui/material';

export type ConfirmDialogProps = {
    message?: string;
    disabled?: boolean;
    okButtonProps?: ButtonProps;
    cancelButtonProps?: ButtonProps;
    cardProps?: CardProps;
} & DialogProps;

export function ConfirmDialog({
    message = '続行しますか?',
    disabled,
    okButtonProps,
    cancelButtonProps,
    cardProps,
    children,
    ...props
}: ConfirmDialogProps) {
    return (
        <Dialog {...props}>
            <Card {...cardProps}>
                <CardHeader title={message} />
                {children && <CardContent>{children}</CardContent>}
                <CardContent sx={{ display: 'flex', flexDirection: 'row-reverse' }}>
                    <Button
                        sx={{ ml: 1 }}
                        disabled={disabled}
                        variant="outlined"
                        color="primary"
                        {...okButtonProps}
                    >
                        OK
                    </Button>
                    <Button
                        disabled={disabled}
                        variant="outlined"
                        color="secondary"
                        {...cancelButtonProps}
                    >
                        Cancel
                    </Button>
                </CardContent>
            </Card>
        </Dialog>
    );
}
