import { Dialog, DialogProps, Card, CardHeader, CardContent, Button } from '@mui/material';

export type AlertDialogProps = {
    message?: string;
    description?: string;
    onClickOk?: React.MouseEventHandler<HTMLButtonElement>;
} & DialogProps;

export function AlertDialog({
    message = 'エラーが発生しました',
    description,
    onClickOk,
    ...props
}: AlertDialogProps) {
    return (
        <Dialog {...props}>
            <Card>
                <CardHeader title={message} />
                {description && <CardContent>{description}</CardContent>}
                <CardContent>
                    <Button onClick={onClickOk} variant="outlined" fullWidth>
                        OK
                    </Button>
                </CardContent>
            </Card>
        </Dialog>
    );
}
